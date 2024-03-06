import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { DIRECTION } from "@/game/constants/direction";
import type { DirectionType } from "@/game/types/direction";
import { getDirection } from "../utils/calcs/getDirection";
import { directionToAngleFlip } from "../utils/calcs/directionToAngleFlip";
import g from "../utils/global";
import { PlayerSprite } from "../services/player/classes";
import type { Player } from "../types/player";

export class Game extends Scene {
  player: PlayerSprite;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  platform: Phaser.GameObjects.Image;
  direction: DirectionType;
  playerList: PlayerSprite[];
  backgroundLayer: Phaser.Tilemaps.TilemapLayer;
  collisionLayer: Phaser.Tilemaps.TilemapLayer;
  constructor() {
    super("Game");
  }

  preload(): void {
    this.load.spritesheet("sunfish", "assets/Sunfish_move.png", {
      frameWidth: 192,
      frameHeight: 192
    });
    this.load.image("bg", "assets/bg.png");
    this.load.image("tile_forest", "assets/tileset/Forest/BG_1/BG_1.png");
    this.load.image("tile_ocean_day", "assets/tileset/Ocean/Layers/Day/Tile.png");
    this.load.tilemapTiledJSON("map", "assets/tilemap/map.json");
  }

  create(): void {
    this.playerList = [];
    this.platform = this.physics.add.staticImage(0, 0, "bg").setOrigin(0, 0).refreshBody();
    this.anims.create({
      key: "swim",
      frames: this.anims.generateFrameNumbers("sunfish", {
        start: 0,
        end: 1
      }),
      frameRate: 3,
      repeat: -1
    });

    // 플레이어 스프라이트를 추가합니다.
    if (g.myInfo !== null) {
      g.playerList.forEach((player) => {
        const newPlayer = this.addPlayer(player);
        if (g.myInfo?.playerId === newPlayer.playerId) {
          this.player = newPlayer;
        }
      });
    }

    // 타일 맵을 그립니다.
    this.createTilemap();

    // 카메라 뷰를 관리합니다.
    this.cameras.main.setBounds(0, 0, 2688, 1536, true);
    this.physics.world.setBounds(0, 0, 2688, 1536);
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
  }

  update(): void {
    // moveSpeed는 정수여야 합니다.
    this.handleSocketEvent();
    // moveSpeed가 1,000 이상이면 벽을 뚫는 기이한 현상이 벌어집니다.
    const moveSpeed = 900;

    const { direction, directionX, directionY } = getDirection(this.player.characterSprite.flipX, this.cursors);
    this.direction = direction;
    const { angle, shouldFlipX } = directionToAngleFlip(direction, this.player.characterSprite.flipX);

    this.player.characterSprite.setFlipX(shouldFlipX);
    this.player.characterSprite.angle = angle;

    this.player.move(moveSpeed * directionX, moveSpeed * directionY);

    // 플레이어가 움직일 때만 움직임 결과를 처리합니다.
    const isArrowKeyPressed =
      this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown;

    if (isArrowKeyPressed) {
      // EventBus.emit("player-moved", this.player.x, this.player.y, this.direction);
    }

    // this.setPlayersPosition();
  }

  changeScene(): void {
    this.scene.start("GameOver");
  }

  handleSocketEvent(): void {
    while (g.eventQueue.length > 0) {
      const event = g.eventQueue.dequeue();
      switch (event.key) {
        case "player-entered":
          this.onReceivedEnter(event.data as Player);
          break;
      }
    }
  }

  setPlayersPosition(): void {
    g.playerList.forEach((player) => {
      const targetPlayer = this.playerList.find((target) => target.playerId === player.playerId);
      if (targetPlayer !== undefined && targetPlayer.playerId !== g.myInfo?.playerId) {
        targetPlayer.x = player.startX;
        targetPlayer.y = player.startY;
      }
    });
  }

  addPlayer(playerInfo: Player): PlayerSprite {
    const newPlayer = new PlayerSprite(this, "sunfish", playerInfo);
    this.playerList.push(newPlayer);
    return newPlayer;
  }

  onReceivedEnter(newPlayer: Player): void {
    if (newPlayer.playerId !== g.myInfo?.playerId) {
      this.addPlayer(newPlayer);
    }
  }

  createTilemap(): void {
    // 맵(지형지물)을 그립니다.
    const map: Phaser.Tilemaps.Tilemap = this.make.tilemap({ key: "map" });
    const tilesetForest: Phaser.Tilemaps.Tileset | null = map.addTilesetImage("forest_bg_1", "tile_forest", 16, 16, 0, 0);
    const tilesetOcean: Phaser.Tilemaps.Tileset | null = map.addTilesetImage("ocean_day", "tile_ocean_day", 16, 16, 0, 0);

    let createBackgroundLayer: Phaser.Tilemaps.TilemapLayer | null = null;
    let createCollisionLayer: Phaser.Tilemaps.TilemapLayer | null = null;
    if (tilesetForest !== null && tilesetOcean !== null) {
      createBackgroundLayer = map.createLayer("Background_Layer", [tilesetForest, tilesetOcean], 0, 0);
      createCollisionLayer = map.createLayer("Collision_Layer", [tilesetForest, tilesetOcean], 0, 0);
    } else {
      console.error("One or more tilesets failed to load. Layer creation aborted.");
    }
    if (createBackgroundLayer !== null && createCollisionLayer !== null) {
      this.backgroundLayer = createBackgroundLayer;
      this.collisionLayer = createCollisionLayer;
    }
    // 충돌을 설정합니다.
    this.collisionLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.collisionLayer, this.player);
  }
}
