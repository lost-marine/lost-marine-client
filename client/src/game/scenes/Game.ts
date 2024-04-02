import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { DIRECTION } from "@/game/constants/direction";
import type { DirectionType } from "@/game/types/direction";
import { getDirection } from "../utils/calcs/getDirection";
import { directionToAngleFlip } from "../utils/calcs/directionToAngleFlip";
import g from "../utils/global";
import { PlayerSprite } from "../services/player/classes";
import type { Player } from "../types/player";
import _ from "lodash";
import { syncMyPosition } from "../services/player/feat/movement";
import type { PlayerPositionInfo } from "../services/player/types/position";
import { PlanktonGraphics } from "../services/plankton/classes";
import type { Plankton } from "../types/plankton";
import { socket } from "../utils/socket";
import type { eatPlanktonResponse } from "../services/plankton";
import { speciesMap } from "../constants/species";
import crashService from "../services/player/feat/crash";
import { SCENE } from "../constants/scene";
import Swal from "sweetalert2";
import type { SceneType } from "../types/scene";
import { checkPortal } from "../utils/portal";
import { ItemSprite } from "../services/item/classes";
import { ITEM_STATUS, itemList } from "../constants/item";
import type { ItemInfo } from "../services/player/types/item";
import type { PlayerCrashResult } from "../services/player/types/crash";
import type { OthersEvolutionInfo } from "../services/player/types/evolution";
import type { SpeciesId } from "../types/species";
import itemEatService from "../services/item/feat/eat";

export class Game extends Scene {
  player: PlayerSprite;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  platform: Phaser.GameObjects.Image;
  miniMap: Phaser.GameObjects.Image;
  mapPoint: Phaser.GameObjects.Arc;
  direction: DirectionType;
  playerList: Map<number, PlayerSprite>;
  isMoving: boolean;
  planktonList: Map<number, PlanktonGraphics>;
  backgroundLayer: Phaser.Tilemaps.TilemapLayer;
  collisionLayer: Phaser.Tilemaps.TilemapLayer;
  ready: boolean;
  itemList: ItemSprite[];
  mapStartPosition: { x: number; y: number };
  colors: Record<string, number>;
  constructor() {
    super("Game");
  }

  preload(): void {
    this.load.audio("bgm", "assets/sounds/background.mp3");
    this.load.audio("eat_plankton", "assets/sounds/eatPlankton.wav");
    this.load.image("bg", "assets/bg.png");
    this.load.image("tile_deep_water", "assets/tileset/DeepWater/Tiles/tileset.png");
    this.load.image("tile_deep_water_object", "assets/tileset/DeepWater/Objects/tileset.png");
    this.load.image("tile_deep_water_green", "assets/tileset/DeepWater_Green/Tiles/tileset.png");
    this.load.tilemapTiledJSON("map", "assets/tilemap/map.json");
    this.load.json("shapes", "assets/shapes/shapes.json");
    this.load.image("mini_map", "assets/tilemap/miniMap.png");

    speciesMap.forEach((value) => {
      try {
        // 동적으로
        this.load.spritesheet(value.key, value.spritesheetUrl, {
          frameWidth: value.width,
          frameHeight: value.height
        });
      } catch (e) {
        console.error(e);
      }
    });

    // 아이템 이미지 등록
    itemList.forEach((value) => {
      try {
        // 동적으로
        this.load.spritesheet(value.key, value.spritesheetUrl, {
          frameWidth: value.width,
          frameHeight: value.height
        });
      } catch (e) {
        console.error(e);
      }
    });

    this.colors = {
      red: 0xff0000,
      crimson: 0xff9ea6
    };
  }

  async create(): Promise<void> {
    // 배경 이미지의 사이즈를 맵의 크기에 맞게 스케일 업 합니다.

    this.ready = false;
    if (this.playerList?.size > 0) {
      this.playerList.forEach((player) => {
        player.destroy();
      });
    }
    this.playerList = new Map<number, PlayerSprite>();

    this.platform = this.add.image(0, 0, "bg").setScale(4, 6).setOrigin(0, 0);

    this.miniMap = this.add
      .image(this.cameras.main.width, this.cameras.main.height, "mini_map")
      .setOrigin(1, 1)
      .setDepth(3)
      .setScale(0.3)
      .setAlpha(0.7)
      .setScrollFactor(0);

    this.mapStartPosition = {
      x: this.cameras.main.width - this.miniMap.width * 0.3,
      y: this.cameras.main.height - this.miniMap.height * 0.3
    };

    this.mapPoint = this.add
      .circle(this.mapStartPosition.x, this.mapStartPosition.y, 20, this.colors.red)
      .setDepth(5)
      .setScale(0.3)
      .setAlpha(0.5)
      .setScrollFactor(0);

    // 모든 개체의 애니메이션 전부 등록
    speciesMap.forEach((value) => {
      try {
        this.anims.create({
          key: value.key + "_anims",
          frames: this.anims.generateFrameNumbers(value.key, {
            start: value.frameStart,
            end: value.frameEnd
          }),
          frameRate: 3,
          repeat: -1
        });
      } catch (e) {
        console.error(e);
      }
    });

    // 타일 맵을 그린 이후 `PlayerSprite`를 추가합니다.
    if (this.createTilemap()) {
      // 플레이어 스프라이트를 생성합니다.

      g.playerMap.forEach((player) => {
        const newPlayer = this.addPlayer(player);
        if (g.myInfo?.playerId === newPlayer.playerId) {
          this.player = newPlayer;
          this.mapPoint.setPosition(
            this.mapStartPosition.x + (this.player.x / 8) * 0.3,
            this.mapStartPosition.y + (this.player.y / 8) * 0.3
          );
        }
      });
      this.ready = true;
    } else {
      await Swal.fire("error", "맵 생성 중 오류가 발생했습니다.", "error").then(() => {
        EventBus.emit("change-scene", SCENE.MAIN_MENU);
        throw new Error("맵 생성 중 오류가 발생했습니다.");
      });
    }

    // 카메라 뷰를 관리합니다.
    this.cameras.main.setBounds(0, 0, 6400, 6400, true);
    this.matter.world.setBounds(0, 0, 6400, 6400);

    // 카메라의 움직임의 부드러운 정도는 startFollow의 3,4번째 인자인 lerp(보간) 값(0~1)을 조정하여 바꿀 수 있습니다.
    this.cameras.main.startFollow(this.player, true, 0.5, 0.5);

    // 커서 키를 생성합니다.
    if (this.input?.keyboard !== null) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    EventBus.emit("current-scene-ready", this);

    // 기본 방향을 설정하고 초기 생성 위치를 보낼 필요가 있을까요?
    this.direction = DIRECTION.RIGHT;
    EventBus.emit("player-moved", this.player.x, this.player.y, this.direction);

    // 플랑크톤을 그립니다.
    if (this.planktonList?.size > 0) {
      this.planktonList.forEach((plankton) => {
        plankton.destroy();
      });
    }

    this.planktonList = new Map<number, PlanktonGraphics>();

    g.planktonMap.forEach((plankton: Plankton) => {
      const planktonGraphic = new PlanktonGraphics(this.matter.world, this, plankton);
      this.planktonList.set(plankton.planktonId, planktonGraphic);
    });

    this.matter.world.on("collisionstart", (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
      event.pairs.forEach((pair: Phaser.Types.Physics.Matter.MatterCollisionData) => {
        // 플레이어와의 충돌
        if (pair.bodyA.gameObject instanceof PlayerSprite && pair.bodyB.gameObject instanceof PlayerSprite) {
          this.sendPlayerCrash(pair.bodyA.gameObject.playerId, pair.bodyB.gameObject.playerId);
        }
        // 플랑크톤과 플레이어의 충돌
        else if (pair.bodyA.gameObject instanceof PlanktonGraphics && pair.bodyB.gameObject === this.player) {
          this.eatPlankton(pair.bodyA.gameObject.plankton.planktonId, this.player.playerId);
        }
        // 아이템과 플레이어의 충돌
        else if (pair.bodyA.gameObject instanceof ItemSprite && pair.bodyB.gameObject === this.player) {
          itemEatService.itemEat(pair.bodyA.gameObject.itemId);
        }
      });
    });

    this.itemList = [];

    // 아이템 추가
    itemList.forEach((item) => {
      this.itemList.push(new ItemSprite(this.matter.world, this, item.key, item));
    });
  }

  update(): void {
    this.handleSocketEvent();

    const { direction, directionX, directionY } = getDirection(this.player.flipX, this.cursors);
    const { angle, shouldFlipX } = directionToAngleFlip(direction, this.player.flipX);
    if (this.direction !== direction) {
      this.direction = direction;
    }
    if (this.player.flipX !== shouldFlipX) {
      this.player.setFlipX(shouldFlipX);
    }
    if (this.player?.angle !== undefined && this.player.angle !== angle) {
      this.player.setAngle(angle);
    }

    // 대시 스피드를 적용합니다.
    if (g.dashInfo.dashing) {
      this.player.moveSpeed = this.player.originSpeed * g.dashInfo.speedUpMultiple;
    } else {
      this.player.moveSpeed = this.player.originSpeed;
    }

    const isArrowKeyPressed =
      this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown;

    // 플레이어가 움직일 때만 움직임 결과를 처리합니다.
    if (
      isArrowKeyPressed ||
      this.isMoving ||
      (g.myInfo != null && this.player.x !== g.myInfo.centerX) ||
      (g.myInfo != null && this.player.y !== g.myInfo.centerY) ||
      g.dashInfo.dashing
    ) {
      if (g.myInfo != null) {
        g.myInfo.centerX = this.player.x;
        g.myInfo.centerY = this.player.y;
      }
      this.checkPortal();
      // 플레이어가 움직이지 않을 때도 대시를 할 수 있습니다.
      if (g.dashInfo.dashing && !this.isMoving) {
        if (this.player.flipX) {
          this.player.move(-1, 0);
        } else {
          this.player.move(1, 0);
        }
      } else {
        this.player.move(directionX, directionY);
      }
      this.sendSyncPosition();
      this.mapPoint.setPosition(
        this.mapStartPosition.x + (this.player.x / 8) * 0.3,
        this.mapStartPosition.y + (this.player.y / 8) * 0.3
      );
      // 움직임 상태 여부를 동기화합니다.
      if (isArrowKeyPressed) {
        this.isMoving = true;
      } else {
        this.isMoving = false;
      }
    }

    // 캐릭터의 닉네임 위치를 관리합니다.
    // const playerBody = this.player.body as MatterJS.BodyType;
    if (this.isMoving) {
      this.player.updateNicknamePosition();
    }

    // 채팅 입력필드에 포커스되면 커서를 비활성화합니다.
    if (g.chatInputFocused) {
      this.disableCursors();
    } else {
      this.enableCursors();
    }
  }

  // 플레이어 추가
  addPlayer(playerInfo: Player): PlayerSprite {
    const newPlayer = new PlayerSprite(
      this.matter.world,
      this,
      speciesMap.get(g.myInfo?.speciesId ?? 1)?.key ?? "nemo",
      playerInfo
    );
    newPlayer.setFlipX(playerInfo.isFlipX);
    this.playerList.set(playerInfo.playerId, newPlayer);
    newPlayer.setBounce(0);
    if (playerInfo.playerId !== g.myInfo?.playerId) {
      newPlayer.setStatic(true);
    }
    return newPlayer;
  }

  sendSyncPosition = _.throttle(() => {
    syncMyPosition({
      playerId: this.player.playerId,
      centerX: this.player.x,
      centerY: this.player.y,
      direction: this.direction,
      isFlipX: this.player.flipX
    });
  }, 30);

  handleSocketEvent(): void {
    while (g.eventQueue.length > 0) {
      const event = g.eventQueue.dequeue();
      switch (event.key) {
        // 다른 플레이어가 게임방 입장
        case "player-enter":
          this.onReceivedEnter(event.data as Player);
          break;
        // 다른 플레이어가 게임방 퇴장
        case "player-quit":
          this.onReceivedQuit(event.data as number);
          break;
        // 다른 플레이어들의 위치 동기화 신호 수신
        case "others-position-sync":
          this.onReceivedPositionSync(event.data as PlayerPositionInfo[]);
          break;
        // 다른 플레이어가 플랑크톤 섭취
        case "plankton-delete":
          this.onReceivedPlanktonDelete(event.data as number);
          break;
        // 플랑크톤 리스폰
        case "plankton-respawn":
          this.onReceivedPlanktonRespawn(event.data as Plankton[]);
          break;
        // 내 플레이어가 아이템 섭취
        case "item-eat":
          this.onReceivedItemEat(event.data as number, this.player.playerId);
          break;
        // 아이템 싱크
        case "item-sync":
          this.onReceivedItemSync(event.data as ItemInfo);
          break;
        // 플레이어간의 충돌
        case "player-crash":
          this.onReceivedPlayerCrash(event.data as PlayerCrashResult);
          break;
        case "player-evolution":
          this.onReceivedPlayerEvolution(event.data as SpeciesId);
          break;
        case "others-evolution-sync":
          this.onReceivedOthersEvolution(event.data as OthersEvolutionInfo);
          break;
      }
    }
  }

  // 다른 플레이어가 게임방 입장
  onReceivedEnter(newPlayer: Player): void {
    if (newPlayer.playerId !== g.myInfo?.playerId) {
      this.addPlayer(newPlayer);
    }
  }

  // 다른 플레이어가 게임방 퇴장
  onReceivedQuit(playerId: number): void {
    if (this.playerList.has(playerId)) {
      const targetPlayer = this.playerList.get(playerId);
      targetPlayer?.destroy();
      this.playerList.delete(playerId);
    } else {
      console.error("targetPlayer가 없습니다. ");
    }
  }

  // 다른 플레이어들의 위치 동기화 신호 수신
  onReceivedPositionSync(positionsInfo: PlayerPositionInfo[]): void {
    positionsInfo.forEach((player) => {
      const targetPlayer = g.playerMap.get(player.playerId);
      if (targetPlayer != null && this.playerList.has(player.playerId)) {
        const targetPlayerSprite = this.playerList.get(targetPlayer.playerId);
        if (targetPlayerSprite !== undefined && targetPlayerSprite.playerId !== g.myInfo?.playerId) {
          targetPlayerSprite.x = player.centerX;
          targetPlayerSprite.y = player.centerY;
          const { angle, shouldFlipX } = directionToAngleFlip(player.direction, player.isFlipX ?? false);
          if (targetPlayerSprite.flipX !== shouldFlipX) {
            targetPlayerSprite.setFlipX(shouldFlipX);
          }
          if (targetPlayerSprite.angle !== angle) {
            targetPlayerSprite.setAngle(angle);
          }
          targetPlayerSprite.setStatic(true);
          targetPlayerSprite.updateNicknamePosition();
        }
      }
    });
  }

  sendPlayerCrash = _.throttle((playerAId: number, playerBId: number) => {
    crashService.crash(playerAId, playerBId);
  }, 30);

  checkPortal = _.throttle(() => {
    const result = checkPortal(this.player.x, this.player.y);
    if (result !== undefined) {
      this.player.x = result[0];
      this.player.y = result[1];
    }
  }, 300);

  createTilemap(): boolean {
    const map: Phaser.Tilemaps.Tilemap = this.make.tilemap({ key: "map" });
    const tilesetDeepWater: Phaser.Tilemaps.Tileset | null = map.addTilesetImage("DeepWater", "tile_deep_water", 128, 128, 0, 0);
    const tilesetDeepWaterObject: Phaser.Tilemaps.Tileset | null = map.addTilesetImage(
      "DeepWater_Object",
      "tile_deep_water_object",
      128,
      128,
      0,
      0
    );
    const tilesetDeepWaterGreen: Phaser.Tilemaps.Tileset | null = map.addTilesetImage(
      "DeepWater_Green",
      "tile_deep_water_green",
      128,
      128,
      0,
      0
    );

    let createBackgroundLayer: Phaser.Tilemaps.TilemapLayer | null = null;
    let createCollisionLayer: Phaser.Tilemaps.TilemapLayer | null = null;
    if (tilesetDeepWater !== null && tilesetDeepWaterGreen !== null && tilesetDeepWaterObject !== null) {
      createBackgroundLayer = map.createLayer("Background_Layer", [tilesetDeepWaterObject], 0, 0);
      createCollisionLayer = map.createLayer("Collision_Layer", [tilesetDeepWater, tilesetDeepWaterGreen], 0, 0);
    } else {
      console.error(
        "하나 이상의 타일셋을 로드하는 데 실패했습니다. 타일셋의 이름이나 경로를 확인해주세요. Tiled 에디터에서 사용한 것과 일치하는지도 확인해주세요."
      );
      return false;
    }

    if (createBackgroundLayer !== null && createCollisionLayer !== null) {
      this.backgroundLayer = createBackgroundLayer;
      this.collisionLayer = createCollisionLayer;
    } else {
      console.error("하나 이상의 레이어를 생성하는 데 실패했습니다. 레이어의 이름을 확인해주세요.");
      return false;
    }

    // collisionLayer의 모든 타일을 충돌이 가능한 상태로 바꾸고, matter 물리학을 적용합니다.
    this.collisionLayer.setCollisionByExclusion([-1]);
    this.matter.world.convertTilemapLayer(this.backgroundLayer);
    this.matter.world.convertTilemapLayer(this.collisionLayer);

    return true;
  }

  eatPlankton(planktonId: number, playerId: number): void {
    socket.emit(
      "plankton-eat",
      {
        playerId,
        planktonId
      },
      (response: eatPlanktonResponse) => {
        if (response.isSuccess) {
          this.planktonList.get(planktonId)?.destroy();
          this.planktonList.delete(planktonId);
          g.planktonMap.delete(planktonId);
          this.sound.add("eat_plankton").play({ volume: 0.2 });

          if (g.myInfo !== null) {
            g.myInfo.planktonCount = response.planktonCount;
            g.myInfo.microplasticCount = response.microplasticCount;
            g.myInfo.health = response.playerStatusInfo.health;
            g.myInfo.nowExp = response.playerStatusInfo.nowExp;

            // 글로벌 상태를 업데이트 한 후 진화 요청 프로세스로 넘어갑니다.
            const currentSpeciesInfo = speciesMap.get(g.myInfo.speciesId);
            if (currentSpeciesInfo !== undefined && g.myInfo.nowExp >= currentSpeciesInfo.requirementPoint) {
              EventBus.emit("player-evolution-required");
            }
          }
          EventBus.emit("player-eat-plankton", response.playerStatusInfo);
        }
      }
    );
  }

  onReceivedPlanktonDelete(planktonId: number): void {
    this.planktonList.get(planktonId)?.destroy();
    this.planktonList.delete(planktonId);
  }

  onReceivedPlanktonRespawn(newPlanktonList: Plankton[]): void {
    newPlanktonList.forEach((plankton: Plankton) => {
      g.planktonMap.set(plankton.planktonId, plankton);
      const planktonGraphic = new PlanktonGraphics(this.matter.world, this, plankton);
      this.planktonList.set(plankton.planktonId, planktonGraphic);
    });
  }

  onReceivedPlayerEvolution(selectedSpeciesId: SpeciesId): void {
    if (g.myInfo !== null) {
      g.myInfo.speciesId = selectedSpeciesId;
      this.player.evolve(selectedSpeciesId);
    } else {
      throw new Error("내 정보가 없습니다.");
    }
  }

  onReceivedOthersEvolution({ playerId, speciesId }: OthersEvolutionInfo): void {
    if (this.playerList.has(playerId)) {
      const targetPlayer = this.playerList.get(playerId);
      targetPlayer?.evolve(speciesId);
    }
  }

  disableCursors(): void {
    this.cursors.up.enabled = false;
    this.cursors.down.enabled = false;
    this.cursors.left.enabled = false;
    this.cursors.right.enabled = false;
    this.cursors.space.enabled = false;
    this.cursors.shift.enabled = false;
  }

  enableCursors(): void {
    this.cursors.up.enabled = true;
    this.cursors.down.enabled = true;
    this.cursors.left.enabled = true;
    this.cursors.right.enabled = true;
    this.cursors.space.enabled = true;
    this.cursors.shift.enabled = true;
  }

  onReceivedItemEat(itemId: number, playerId: number): void {
    if (
      this.itemList[itemId]?.visible &&
      (this.itemList[itemId]?.changeType === ITEM_STATUS.STATIC || this.itemList[itemId]?.changeType === ITEM_STATUS.OPEN)
    ) {
      socket.emit("item-eat", {
        playerId,
        itemType: this.itemList[itemId]?.itemType,
        itemId
      });

      if (this.itemList[itemId]?.changeType === ITEM_STATUS.OPEN) {
        this.itemList[itemId + 1]?.setVisible(true);
      }
      this.itemList[itemId]?.setVisible(false);
    }
  }

  onReceivedItemSync(item: ItemInfo): void {
    this.itemList[item.itemId]?.setVisible(item.isActive);
    if (this.itemList[item.itemId]?.changeType === ITEM_STATUS.OPEN) {
      this.itemList[item.itemId + 1]?.setVisible(!item.isActive);
    }
  }

  onReceivedPlayerCrash(playerCrashResult: PlayerCrashResult): void {
    const playerId = playerCrashResult.playerId;
    const damageAmount = playerCrashResult.damage;
    const targetPlayer = this.playerList.get(playerId);
    if (targetPlayer !== undefined) {
      this.spriteFlashRed(targetPlayer);
      const damageText = this.add.text(targetPlayer.x, targetPlayer.y, "" + damageAmount, {
        fontSize: "22px",
        color: "red"
      });
      this.tweens.add({
        targets: damageText,
        y: targetPlayer.y - 15,
        alpha: 0.8,
        duration: 800,
        onComplete: () => {
          damageText.destroy();
        }
      });
    }
  }

  changeScene(target: SceneType): void {
    this.scene.start(target);
  }

  spriteFlashRed(sprite: PlayerSprite): void {
    sprite.setTint(this.colors.crimson); // 붉은색으로 변경
    sprite.setAlpha(0.8);
    this.time.delayedCall(200, () => {
      sprite.clearTint(); // 원래 색상으로 복원
      sprite.setAlpha(1);
    });
  }
}
