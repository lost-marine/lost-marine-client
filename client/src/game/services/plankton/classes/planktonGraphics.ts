import type { Plankton } from "@/game/types/plankton";
import type { PlayerSprite } from "../../player/classes";
import g from "@/game/utils/global";

export class PlanktonGraphics {
  circleBody: MatterJS.BodyType; // 원형 스프라이트의 물리적 바디를 저장할 속성
  plankton: Plankton;
  graphics: Phaser.GameObjects.Graphics;
  scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, plankton: Plankton, player: PlayerSprite) {
    this.scene = scene;

    this.plankton = plankton;
    this.circleBody = scene.matter.add.circle(
      plankton.startX,
      plankton.startY,
      10,
      {
        restitution: 0,
        isStatic: true,
        render: {
          fillColor: 0x00ff00,
          lineColor: 0x006400,
          lineThickness: 1
        }
      },
      1
    );

    this.graphics = this.scene.add.graphics();
    this.drawPlankton();

    this.setPlayerCollisionEvent(player);
  }

  drawPlankton(): void {
    this.graphics.lineStyle(3, 0x006400, 1.0);
    this.graphics.fillStyle(0x00ff00, 1.0);
    this.graphics.fillCircle(this.plankton.startX, this.plankton.startY, 5);
    this.graphics.strokeCircle(this.plankton.startX, this.plankton.startY, 8);
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
    if (this.graphics !== null) {
      this.graphics.destroy();
    }
  }
}
