import type { Plankton } from "@/game/types/plankton";
import type { PlayerSprite } from "../../player/classes";

export class PlanktonGraphics extends Phaser.GameObjects.GameObject {
  circleBody: MatterJS.BodyType; // 원형 스프라이트의 물리적 바디를 저장할 속성

  constructor(scene: Phaser.Scene, plankton: Plankton, player: PlayerSprite) {
    super(scene, "PlanktonGraphics");

    this.circleBody = scene.matter.add.circle(
      plankton.startX,
      plankton.startY,
      10,
      {
        restitution: 0.3,
        isStatic: true,
        render: {
          fillColor: 0x00ff00,
          lineColor: 0x006400,
          lineThickness: 1
        }
      },
      1
    );

    this.setPlayerCollisionEvent(scene, player);
  }

  setPlayerCollisionEvent(scene: Phaser.Scene, player: PlayerSprite): void {
    scene.matter.world.on(
      "collisionstart",
      (event: Phaser.Physics.Matter.Events.CollisionStartEvent, bodyA: unknown, bodyB: unknown) => {
        if ((bodyA === this.circleBody && bodyB === player.body) || (bodyA === player.body && bodyB === this.circleBody)) {
          console.log("Sprite and Circle have collided");
        }
      }
    );
  }
}
