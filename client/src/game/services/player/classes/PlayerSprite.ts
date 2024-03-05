export class PlayerSprite extends Phaser.Physics.Arcade.Sprite {
  playerId: number;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, playerId: number) {
    super(scene, x, y, texture);
    this.playerId = playerId;

    // 필요한 경우 여기에서 추가 설정을 할 수 있습니다.
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}
