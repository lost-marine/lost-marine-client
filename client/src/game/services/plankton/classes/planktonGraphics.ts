import type { Plankton } from "@/game/types/plankton";

export class PlanktonGraphics extends Phaser.GameObjects.Graphics {
  constructor(scene: Phaser.Scene, plankton: Plankton) {
    super(scene);
    this.scene = scene;
    this.scene.add.existing(this);
    this.drawPlankton(plankton);
  }

  drawPlankton(plankton: Plankton): void {
    this.lineStyle(3, 0x006400, 1.0);
    this.fillStyle(0x00ff00, 1.0);
    this.fillCircle(plankton.centerX, plankton.centerY, 5);
    this.strokeCircle(plankton.centerX, plankton.centerY, 8);
  }
}
