import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Game extends Scene {
    player: Phaser.Physics.Arcade.Sprite;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    platform: Phaser.GameObjects.Image;
    constructor() {
        super("Game");
    }

    preload() {
        this.load.spritesheet("sunfish", "assets/Sunfish_move.png", {
            frameWidth: 192,
            frameHeight: 192,
        });
        this.load.image("platform", "assets/bg.png");
    }

    create() {
        this.platform = this.physics.add
            .staticImage(0, 0, "platform")
            .setOrigin(0, 0)
            .refreshBody();
        // 스프라이트를 추가합니다.
        this.player = this.physics.add.sprite(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "sunfish"
        );

        this.player.setCollideWorldBounds(true);
        // 스프라이트에 애니메이션을 추가합니다.
        this.anims.create({
            key: "swim",
            frames: this.anims.generateFrameNumbers("sunfish", {
                start: 0,
                end: 1,
            }),
            frameRate: 3,
            repeat: -1,
        });

        // 스프라이트 애니메이션을 재생합니다.
        this.player.anims.play("swim");

        // 커서 키를 생성합니다.
        if (this.input && this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        const moveSpeed = 5;
        let moveAngle = 0;
        let direction;

        // 대각선 이동 및 회전 각도 결정
        if (this.cursors.left.isDown && this.cursors.up.isDown) {
            moveAngle = 45; // 왼쪽 위
            direction = 7;
        } else if (this.cursors.left.isDown && this.cursors.down.isDown) {
            moveAngle = -45; // 왼쪽 아래
            direction = 5;
        } else if (this.cursors.right.isDown && this.cursors.up.isDown) {
            moveAngle = -45; // 오른쪽 위
            direction = 1;
        } else if (this.cursors.right.isDown && this.cursors.down.isDown) {
            moveAngle = 45; // 오른쪽 아래
            direction = 3;
        } else if (this.cursors.left.isDown) {
            moveAngle = 0; // 왼쪽
            direction = 6;
        } else if (this.cursors.right.isDown) {
            moveAngle = 0; // 오른쪽
            direction = 2;
        } else if (this.cursors.up.isDown) {
            // 위 (보고 있는 좌우방향에 따라 다른 각도를 설정합니다)
            moveAngle = this.player.flipX ? 90 : -90;
            direction = 0;
        } else if (this.cursors.down.isDown) {
            // 아래 (보고 있는 좌우방향에 따라 다른 각도를 설정합니다)
            moveAngle = this.player.flipX ? -90 : 90;
            direction = 4;
        }

        // 플레이어의 움직임을 처리합니다.
        if (this.cursors) {
            this.player.angle = moveAngle;
            // 왼쪽으로 이동
            if (this.cursors.left.isDown) {
                // this.player.scaleX = -1 보다는 flipX 프로퍼티를 활용하는 게 불필요한 계산을 피하는 방법입니다.
                this.player.setFlipX(true); // 스프라이트를 좌우로 뒤집음
                this.player.x -= moveSpeed; // 스프라이트를 왼쪽으로 이동
            }
            // 오른쪽으로 이동
            else if (this.cursors.right.isDown) {
                // this.player.scaleX = 1 보다는 flipX 프로퍼티를 활용하는 게 불필요한 계산을 피하는 방법입니다.
                this.player.setFlipX(false); // 스프라이트의 기본 방향
                this.player.x += moveSpeed; // 스프라이트를 오른쪽으로 이동
            }

            // 위로 이동
            if (this.cursors.up.isDown) {
                this.player.y -= moveSpeed; // 스프라이트를 위로 이동
            }
            // 아래로 이동
            else if (this.cursors.down.isDown) {
                this.player.y += moveSpeed; // 스프라이트를 아래로 이동
            }
        }

        // 플레이어의 움직임 결과를 처리합니다.
        EventBus.emit("player-moved", this.player.x, this.player.y, direction);
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
