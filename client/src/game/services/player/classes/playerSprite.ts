import type { Player } from "@/game/types/player";

export class PlayerSprite extends Phaser.Physics.Matter.Sprite {
  playerId: number;
  characterSprite: Phaser.Physics.Matter.Sprite;
  nicknameSprite: Phaser.GameObjects.Text;

  constructor(world: Phaser.Physics.Matter.World, scene: Phaser.Scene, texture: string, player: Player) {
    super(world, player.startX, player.startY, texture);

    this.playerId = player.playerId;
    this.name = player.nickname;

    scene.matter.add.sprite(0, 0, texture);
    this.anims.play("swim");

    this.nicknameSprite = scene.add.text(0, 0, this.name, {
      fontSize: "16px",
      fontStyle: "bold",
      stroke: "#000",
      strokeThickness: 1
    });

    // 인스턴스의 초기 스폰 위치를 설정합니다.
    scene.add.existing(this);
    this.setPosition(Math.trunc(scene.cameras.main.centerX), Math.trunc(scene.cameras.main.centerY));
    this.updateNicknamePosition();
  }

  move(x: number, y: number): void {
    this.setAwake(); // 잠자는 상태일 때 객체를 깨워줍니다.
    this.setVelocity(x, y);
  }

  updateNicknamePosition(): void {
    this.nicknameSprite.setPosition(
      this.x - this.nicknameSprite.width / 2,
      this.y - this.height / 2 - this.nicknameSprite.height
    );
  }
}
