import type { Plankton } from "@/game/types/plankton";
export class PlanktonGraphics extends Phaser.Physics.Matter.Sprite {
  plankton: Plankton;
  graphics: Phaser.GameObjects.Graphics;

  constructor(world: Phaser.Physics.Matter.World, scene: Phaser.Scene, plankton: Plankton) {
    super(world, plankton.centerX, plankton.centerY, "planktonGraphics");

    const radius = plankton.width * 2.5;
    this.setBody(
      {
        type: "circle",
        sides: 5,
        radius
      },
      {
        isSensor: true
      }
    );

    this.plankton = plankton;
    this.graphics = scene.add.graphics();
    this.drawPlankton(radius);
  }

  drawPlankton(radius: number): void {
    this.graphics.lineStyle(3, 0x006400, 1.0);
    this.graphics.fillStyle(0x00ff00, 1.0);
    this.graphics.fillCircle(this.plankton.centerX, this.plankton.centerY, radius - 3);
    this.graphics.strokeCircle(this.plankton.centerX, this.plankton.centerY, radius);
  }

  destroy(): void {
    super.destroy();
    this.graphics.destroy();
  }

  hidden(): void {
    this.setActive(false).setVisible(false);
    this.graphics.setVisible(false);
  }
}
