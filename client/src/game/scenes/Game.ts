import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { DIRECTION } from "@/game/constants/direction";
import type { DirectionType } from "@/game/types/direction";
import { getDirection } from "../utils/calcs/getDirection";
import { directionToAngleFlip } from "../utils/calcs/directionToAngleFlip";

export class Game extends Scene {
  player: Phaser.Physics.Arcade.Sprite;
  playerContainer: Phaser.GameObjects.Container;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  platform: Phaser.GameObjects.Image;
  direction: DirectionType;
  layer: Phaser.Tilemaps.TilemapLayer;
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
    this.load.tilemapTiledJSON("map", "assets/map.json");
  }

  create(): void {
    // 배경화면을 그립니다.
    this.platform = this.physics.add.staticImage(0, 0, "bg").setOrigin(0, 0).refreshBody();

    // 캐릭터를 추가합니다.
    this.player = this.physics.add.sprite(0, 0, "sunfish");
    this.anims.create({
      key: "swim",
      frames: this.anims.generateFrameNumbers("sunfish", {
        start: 0,
        end: 1
      }),
      frameRate: 3,
      repeat: -1
    });
    this.player.anims.play("swim");

    // 플레이어 닉네임을 설정합니다.
    this.player.name = "nickname";
    const nickname: Phaser.GameObjects.Text = this.add.text(0, 0, this.player.name, {
      fontSize: "16px",
      fontStyle: "bold",
      stroke: "#000",
      strokeThickness: 1
    });

    // 플레이어 점수를 설정합니다.
    const score: Phaser.GameObjects.Text = this.add.text(0, 0, "30", {
      fontSize: "16px",
      fontStyle: "bold",
      stroke: "#000",
      strokeThickness: 1
    });

    // 플레이어 스프라이트, 닉네임, 점수를 하나의 컨테이너로 관리합니다.
    nickname.setPosition(this.player.x - nickname.width / 2, this.player.y - this.player.height / 2 - nickname.height * 2);
    score.setPosition(this.player.x - score.width / 2, this.player.y - this.player.height / 2 - score.height);
    this.playerContainer = this.add.container(Math.trunc(this.cameras.main.centerX), Math.trunc(this.cameras.main.centerY), [
      this.player,
      nickname,
      score
    ]);
    this.playerContainer.setSize(192, 192);
    this.physics.world.enable(this.playerContainer);
    const playerContainerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body;
    playerContainerBody.setCollideWorldBounds(true);
    playerContainerBody.setBounce(0.2);

    // 맵(지형지물)을 그립니다.
    const map: Phaser.Tilemaps.Tilemap = this.make.tilemap({ key: "map" });
    const tilesetForest: Phaser.Tilemaps.Tileset | null = map.addTilesetImage("forest_bg_1", "tile_forest", 16, 16, 0, 0);
    const tilesetOcean: Phaser.Tilemaps.Tileset | null = map.addTilesetImage("ocean_day", "tile_ocean_day", 16, 16, 0, 0);

    // 레이어 생성
    let createLayerResult: Phaser.Tilemaps.TilemapLayer | null = null;
    if (tilesetForest !== null && tilesetOcean !== null) {
      createLayerResult = map.createLayer("Tile Layer 1", [tilesetForest, tilesetOcean], 0, 0);
    } else {
      console.error("One or more tilesets failed to load. Layer creation aborted.");
    }
    if (createLayerResult !== null) {
      this.layer = createLayerResult;
    }
    console.assert(this.layer !== undefined, "Layer not created");

    // 레이어 세팅
    if (this.layer !== undefined && this.playerContainer !== undefined) {
      // this.layer.setCollisionByProperty({ collides: true }, true);
      console.log(this.physics.add.collider(this.playerContainer, this.layer));
    }

    // 카메라 뷰를 관리합니다.
    this.cameras.main.setBounds(0, 0, 2688, 1536, true);
    this.physics.world.setBounds(0, 0, 2688, 1536);
    // 카메라의 움직임의 부드러운 정도는 startFollow의 3,4번째 인자인 lerp(보간) 값(0~1)을 조정하여 바꿀 수 있습니다.
    this.cameras.main.startFollow(this.playerContainer, true, 0.5, 0.5);

    // 커서 키를 생성합니다.
    if (this.input?.keyboard !== null) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    EventBus.emit("current-scene-ready", this);

    this.direction = DIRECTION.RIGHT;
    EventBus.emit("player-moved", this.player.x, this.player.y, this.direction);
  }

  update(): void {
    // moveSpeed는 정수여야 합니다.
    const moveSpeed = 5;

    const { direction, directionX, directionY } = getDirection(this.player.flipX, this.cursors);
    this.direction = direction;
    const { angle, shouldFlipX } = directionToAngleFlip(direction, this.player.flipX);

    this.player.setFlipX(shouldFlipX);
    this.player.angle = angle;
    this.playerContainer.x += moveSpeed * directionX;
    this.playerContainer.y += moveSpeed * directionY;

    // 플레이어가 움직일 때만 움직임 결과를 처리합니다.
    const isArrowKeyPressed =
      this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown;

    if (isArrowKeyPressed) {
      EventBus.emit("player-moved", this.playerContainer.x, this.playerContainer.y, this.direction);
    }
  }

  changeScene(): void {
    this.scene.start("GameOver");
  }
}
