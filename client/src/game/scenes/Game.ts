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
import { speciesMap } from "../constants/species";
import crashService from "../services/player/feat/crash";
import { SCENE } from "../constants/scene";
import Swal from "sweetalert2";
import type { SceneType } from "../types/scene";

export class Game extends Scene {
  player: PlayerSprite;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  platform: Phaser.GameObjects.Image;
  direction: DirectionType;
  playerList: Map<number, PlayerSprite>;
  isMoving: boolean;
  planktonList: Map<number, PlanktonGraphics>;
  backgroundLayer: Phaser.Tilemaps.TilemapLayer;
  collisionLayer: Phaser.Tilemaps.TilemapLayer;
  constructor() {
    super("Game");
  }

  preload(): void {
    this.load.audio("bgm", "assets/sounds/background.mp3");
    this.load.image("bg", "assets/bg.png");
    this.load.image("tile_deep_water", "assets/tileset/DeepWater/Tiles/tileset.png");
    this.load.image("tile_deep_water_object", "assets/tileset/DeepWater/Objects/tileset.png");
    this.load.image("tile_deep_water_green", "assets/tileset/DeepWater_Green/Tiles/tileset.png");
    this.load.tilemapTiledJSON("map", "assets/tilemap/map.json");
    this.load.json("shapes", "assets/shapes/shapes.json");
    speciesMap.forEach((value) => {
      try {
        // 동적으로
        this.load.spritesheet(value.key, value.spritesheetUrl, {
          frameWidth: value.width,
          frameHeight: value.height
        });
        this.anims.create({
          key: value.key,
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
  }

  async create(): Promise<void> {
    this.sound.add("bgm", { loop: true }).play();
    // 배경 이미지의 사이즈를 맵의 크기에 맞게 스케일 업 합니다.
    this.platform = this.add.image(0, 0, "bg").setScale(4, 6).setOrigin(0, 0);
    this.playerList = new Map<number, PlayerSprite>();

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
      if (g.myInfo !== null) {
        g.playerMap.forEach((player) => {
          const newPlayer = this.addPlayer(player);
          if (g.myInfo?.playerId === newPlayer.playerId) {
            this.player = newPlayer;
          }
        });
      }
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
    this.planktonList = new Map<number, PlanktonGraphics>();

    g.planktonMap.forEach((plankton) => {
      const planktonGraphic = new PlanktonGraphics(this, plankton);
      this.planktonList.set(plankton.planktonId, planktonGraphic);
    });

    this.matter.world.on(
      "collisionstart",
      (event: Phaser.Physics.Matter.Events.CollisionStartEvent, bodyA: MatterJS.BodyType, bodyB: MatterJS.BodyType) => {
        // 플레이어간 충돌
        if (bodyA.gameObject instanceof PlayerSprite && bodyB.gameObject instanceof PlayerSprite) {
          this.sendPlayerCrash(bodyA.gameObject.playerId, bodyB.gameObject.playerId);
        }
      }
    );
  }

  update(): void {
    this.handleSocketEvent();

    const { direction, directionX, directionY } = getDirection(this.player.flipX, this.cursors);
    const { angle, shouldFlipX } = directionToAngleFlip(direction, this.player.flipX);
    this.direction = direction;
    this.player.setFlipX(shouldFlipX);
    this.player.setAngle(angle);

    const isArrowKeyPressed =
      this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown;
    // 플레이어가 움직일 때만 움직임 결과를 처리합니다.
    if (isArrowKeyPressed || this.isMoving) {
      this.player.move(directionX, directionY);
      this.sendSyncPosition();
      // 움직임 상태 여부를 동기화합니다.
      if (isArrowKeyPressed) {
        this.isMoving = true;
      } else {
        this.isMoving = false;
      }
    }

    // 캐릭터의 닉네임 위치를 관리합니다.
    const playerBody = this.player.body as MatterJS.BodyType;
    if (!playerBody.isSleeping) {
      this.player.updateNicknamePosition();
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
    this.playerList.set(playerInfo.playerId, newPlayer);
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
          this.onReceviedPositionSync(event.data as PlayerPositionInfo[]);
          break;
        case "game-over":
          this.onReceivedGameOver();
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
      targetPlayer?.nicknameSprite.destroy();
      targetPlayer?.destroy();
      this.playerList.delete(playerId);
    }
  }

  // 다른 플레이어들의 위치 동기화 신호 수신
  onReceviedPositionSync(positionsInfo: PlayerPositionInfo[]): void {
    positionsInfo.forEach((player) => {
      const targetPlayer = g.playerMap.get(player.playerId);
      if (targetPlayer != null && this.playerList.has(player.playerId)) {
        const targetPlayerSprite = this.playerList.get(targetPlayer.playerId);
        if (targetPlayerSprite !== undefined && targetPlayerSprite.playerId !== g.myInfo?.playerId) {
          targetPlayerSprite.x = player.centerX;
          targetPlayerSprite.y = player.centerY;
          const { angle, shouldFlipX } = directionToAngleFlip(player.direction, player.isFlipX ?? false);
          targetPlayer.isFlipX = shouldFlipX;
          targetPlayerSprite.setFlipX(shouldFlipX);
          targetPlayerSprite.updateNicknamePosition();
          targetPlayerSprite.setAngle(angle);
        }
      }
    });
  }

  onReceivedGameOver(): void {
    EventBus.emit("change-scene", SCENE.GAME_OVER);
  }

  sendPlayerCrash = _.throttle((playerAId: number, playerBId: number) => {
    crashService.crash(playerAId, playerBId);
  }, 30);

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

  changeScene(target: SceneType): void {
    this.scene.start(target);
  }
}
