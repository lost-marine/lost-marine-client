import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene {
    player: Phaser.Physics.Arcade.Sprite;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    platform: Phaser.GameObjects.Image;
    constructor() {
        super('Game');
    }

    preload() {
        this.load.spritesheet('sunfish', 'assets/Sunfish_move.png', { frameWidth: 192, frameHeight: 192 });
        this.load.image('platform', "assets/bg.png");
    }

    create() {
        this.platform = this.physics.add.staticImage(0, 0, 'platform').setOrigin(0, 0).refreshBody();
        // 스프라이트를 추가합니다.
        this.player = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'sunfish');

        this.player.setCollideWorldBounds(true);
        // 스프라이트에 애니메이션을 추가합니다.
        this.anims.create({
            key: 'swim',
            frames: this.anims.generateFrameNumbers('sunfish', { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });

        // 스프라이트 애니메이션을 재생합니다.
        this.player.anims.play('swim');

        // 커서 키를 생성합니다.
        if (this.input && this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }

        EventBus.emit('current-scene-ready', this);
    }

    update() {

        const moveSpeed = 5;
        let moveAngle = 0;
    
        // 대각선 이동 및 회전 각도 결정
        if (this.cursors.left.isDown && this.cursors.up.isDown) {
            moveAngle = 45; // 왼쪽 위
        } else if (this.cursors.left.isDown && this.cursors.down.isDown) {
            moveAngle = 315 ; // 왼쪽 아래
        } else if (this.cursors.right.isDown && this.cursors.up.isDown) {
            moveAngle = 315; // 오른쪽 위
        } else if (this.cursors.right.isDown && this.cursors.down.isDown) {
            moveAngle = 45; // 오른쪽 아래
        } else if (this.cursors.left.isDown) {
            //moveAngle = 180; // 왼쪽
        } else if (this.cursors.right.isDown) {
            moveAngle = 0; // 오른쪽
        } else if (this.cursors.up.isDown) {
            this.player.scaleX = 1; 
            moveAngle = 90; // 위
        } else if (this.cursors.down.isDown) {
            this.player.scaleX = 1; 
            moveAngle = 270; // 아래
        }

        
        // 플레이어의 움직임을 처리합니다.
        if (this.cursors) {
            
            this.player.angle = moveAngle;
            // 왼쪽으로 이동
            if (this.cursors.left.isDown) {
                this.player.x -= moveSpeed; // 스프라이트를 왼쪽으로 이동
                this.player.scaleX = 1; // 스프라이트의 기본 방향
            } 
            // 오른쪽으로 이동
            else if (this.cursors.right.isDown) {
                this.player.x += moveSpeed; // 스프라이트를 오른쪽으로 이동
                this.player.scaleX = -1; // 스프라이트를 좌우로 뒤집음
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
    }

    changeScene() {
        this.scene.start('GameOver');
    }
}
