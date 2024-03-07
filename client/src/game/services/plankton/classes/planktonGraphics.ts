import type { Plankton } from "@/game/types/plankton";

export class PlanktonGraphics extends Phaser.GameObjects.Graphics {
  invisibleSprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor(scene: Phaser.Scene, plankton: Plankton) {
    super(scene);
    this.scene = scene;
    this.scene.add.existing(this);
    this.drawPlankton(plankton);

    // 충돌 이벤트 감지를 위해 보이지 않는 스프라이트를 정의합니다.
    this.invisibleSprite = scene.physics.add.sprite(plankton.startX, plankton.startY, "").setVisible(false);
    this.invisibleSprite.setSize(8, 8);
    scene.physics.world.enable(this.invisibleSprite);
  }

  drawPlankton(plankton: Plankton): void {
    this.lineStyle(3, 0x006400, 1.0);
    this.fillStyle(0x00ff00, 1.0);
    this.fillCircle(plankton.startX, plankton.startY, 5);
    this.strokeCircle(plankton.startX, plankton.startY, 8);
  }
}
