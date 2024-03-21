import type { Plankton } from "@/game/types/plankton";
import { type PlayerSprite } from "../../player/classes";
export class PlanktonGraphics extends Phaser.Physics.Matter.Sprite {
  plankton: Plankton;
  graphics: Phaser.GameObjects.Graphics;

  constructor(world: Phaser.Physics.Matter.World, scene: Phaser.Scene, plankton: Plankton, player: PlayerSprite) {
    super(world, plankton.centerX, plankton.centerY, "planktonGraphics", "", { isStatic: true });

    this.setBody(
      {
        type: "circle",
        sides: 5,
        radius: 10
      },
      {
        isStatic: true // 정적 바디로 설정
      }
    );

    this.plankton = plankton;

    this.graphics = scene.add.graphics();
    this.drawPlankton();
  }

  drawPlankton(): void {
    this.graphics.lineStyle(3, 0x006400, 1.0);
    this.graphics.fillStyle(0x00ff00, 1.0);
    this.graphics.fillCircle(this.plankton.centerX, this.plankton.centerY, 5);
    this.graphics.strokeCircle(this.plankton.centerX, this.plankton.centerY, 8);
  }

  destroy(): void {
    super.destroy();
    this.graphics.destroy();
  }
}
