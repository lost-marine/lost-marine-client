import type { Plankton } from "@/game/types/plankton";
import type { PlayerSprite } from "../../player/classes";
import g from "@/game/utils/global";

export class PlanktonGraphics extends Phaser.GameObjects.GameObject {
  circleBody: MatterJS.BodyType; // 원형 스프라이트의 물리적 바디를 저장할 속성
  plankton: Plankton;

  constructor(scene: Phaser.Scene, plankton: Plankton, player: PlayerSprite) {
    super(scene, "PlanktonGraphics");

    this.plankton = plankton;
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

    this.setPlayerCollisionEvent(player);
  }

  setPlayerCollisionEvent(player: PlayerSprite): void {
    this.scene.matter.world.on(
      "collisionstart",
      (event: Phaser.Physics.Matter.Events.CollisionStartEvent, bodyA: unknown, bodyB: unknown) => {
        if ((bodyA === this.circleBody && bodyB === player.body) || (bodyA === player.body && bodyB === this.circleBody)) {
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
    // Matter 월드에서 바디를 제거
    if (this.circleBody !== null) {
      this.scene.matter.world.remove(this.circleBody);
    }
  }
}
