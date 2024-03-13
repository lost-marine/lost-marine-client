import type { Plankton } from "@/game/types/plankton";
import { type PlayerSprite } from "../../player/classes";
import g from "@/game/utils/global";
export class PlanktonGraphics extends Phaser.Physics.Matter.Sprite {
  plankton: Plankton;
  graphics: Phaser.GameObjects.Graphics;

  constructor(world: Phaser.Physics.Matter.World, scene: Phaser.Scene, plankton: Plankton, player: PlayerSprite) {
    super(world, plankton.centerX, plankton.centerY, "planktonGraphics", "", { isStatic: true });

    this.plankton = plankton;

    this.graphics = scene.add.graphics();
    this.drawPlankton();

    this.setPlayerCollisionEvent(player);
  }

  drawPlankton(): void {
    this.graphics.lineStyle(3, 0x006400, 1.0);
    this.graphics.fillStyle(0x00ff00, 1.0);
    this.graphics.fillCircle(this.plankton.centerX, this.plankton.centerY, 5);
    this.graphics.strokeCircle(this.plankton.centerX, this.plankton.centerY, 8);
  }

  setPlayerCollisionEvent(player: PlayerSprite): void {
    this.scene.matter.world.on(
      "collisionstart",
      (event: Phaser.Physics.Matter.Events.CollisionStartEvent, bodyA: MatterJS.BodyType, bodyB: MatterJS.BodyType) => {
        if (bodyA.gameObject === this && bodyB.gameObject?.playerId === player.playerId) {
          this.onTriggerPlanktonEat();
        }
      }
    );
  }

  onTriggerPlanktonEat(): void {
    g.eventQueue.append({
      key: "plankton-eat",
      data: this.plankton.planktonId
    });
  }

  destroy(): void {
    super.destroy();
    this.graphics.destroy();
  }
}
