import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { DIRECTION } from "@/game/constants/direction";
import type { DirectionType } from "@/game/types/direction";
import { getDirection } from "../utils/calcs/getDirection";
import { directionToAngleFlip } from "../utils/calcs/directionToAngleFlip";

export class Game extends Scene {
  player: Phaser.Physics.Arcade.Sprite;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  platform: Phaser.GameObjects.Image;
  direction: DirectionType;
  constructor() {
    super("Game");
  }

  preload() {
    this.load.spritesheet("sunfish", "assets/Sunfish_move.png", {
      frameWidth: 192,
      frameHeight: 192
    });
    this.load.image("platform", "assets/bg.png");
  }

  create() {
    this.platform = this.physics.add.staticImage(0, 0, "platform").setOrigin(0, 0).refreshBody();
    // 스프라이트를 추가합니다.
    this.player = this.physics.add.sprite(
      // 시작 좌표를 정수로 만듭니다.
      Math.trunc(this.cameras.main.centerX),
      Math.trunc(this.cameras.main.centerY),
      "sunfish"
    );

    this.player.setCollideWorldBounds(true);
    // 스프라이트에 애니메이션을 추가합니다.
    this.anims.create({
      key: "swim",
      frames: this.anims.generateFrameNumbers("sunfish", {
        start: 0,
        end: 1
      }),
      frameRate: 3,
      repeat: -1
    });

    // 스프라이트 애니메이션을 재생합니다.
    this.player.anims.play("swim");

    // 커서 키를 생성합니다.
    if (this.input && this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    EventBus.emit("current-scene-ready", this);

    this.direction = DIRECTION.RIGHT;
    EventBus.emit("player-moved", this.player.x, this.player.y, this.direction);
  }

  update() {
    // moveSpeed는 정수여야 합니다.
    const moveSpeed = 5;
    let moveAngle = 0;
    //this.direction = this.player.flipX ? DIRECTION.LEFT : DIRECTION.RIGHT;
    const { direction, directionX, directionY } = getDirection(this.player.flipX, this.cursors);
    this.direction = direction;
    const { angle, shouldFlipX } = directionToAngleFlip(direction, this.player.flipX);

    this.player.setFlipX(shouldFlipX);
    this.player.angle = angle;
    this.player.x += moveSpeed * directionX;
    this.player.y += moveSpeed * directionY;

    // 플레이어가 움직일 때만 움직임 결과를 처리합니다.
    const isArrowKeyPressed =
      this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown;

    if (isArrowKeyPressed) {
      EventBus.emit("player-moved", this.player.x, this.player.y, this.direction);
    }
  }

  changeScene() {
    this.scene.start("GameOver");
  }
}
