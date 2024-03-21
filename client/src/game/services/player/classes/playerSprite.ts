import type { Player } from "@/game/types/player";
import { speciesMap } from "@/game/constants/species";
import { PlanktonGraphics } from "../../plankton/classes";
import g from "@/game/utils/global";

export class PlayerSprite extends Phaser.Physics.Matter.Sprite {
  playerId: number;
  nicknameSprite: Phaser.GameObjects.Text;
  moveSpeed: number;
  shapes: {
    default: string | Phaser.Types.Physics.Matter.MatterSetBodyConfig;
    flipped: string | Phaser.Types.Physics.Matter.MatterSetBodyConfig;
  };

  constructor(world: Phaser.Physics.Matter.World, scene: Phaser.Scene, texture: string, player: Player) {
    const shapes = scene.cache.json.get("shapes");
    const speciesKey = speciesMap.get(player.speciesId ?? 1)?.key ?? "nemo";

    super(world, player.centerX, player.centerY, texture, 0, { shape: shapes[speciesKey] });
    this.shapes = {
      default: shapes[speciesKey],
      flipped: shapes[speciesKey + "Flipped"]
    };
    this.playerId = player.playerId;
    this.name = player.nickname;
    this.moveSpeed = 10;

    // 현재 개체에 맞는 애니메이션 재생
    this.anims.play(speciesKey + "_anims");

    this.nicknameSprite = scene.add.text(0, 0, this.name, {
      fontSize: "16px",
      fontStyle: "bold",
      stroke: "#000",
      strokeThickness: 1
    });

    // 인스턴스의 초기 스폰 위치를 설정합니다.
    scene.add.existing(this);
    this.setPosition(player.centerX, player.centerY);
    this.updateNicknamePosition();

    this.setPlayerCollisionEvent();
  }

  move(directionX: number, directionY: number): void {
    this.setAwake(); // 잠자는 상태일 때 객체를 깨워줍니다.
    this.setVelocity(this.moveSpeed * directionX, this.moveSpeed * directionY);
  }

  setFlipX(isFlipX: boolean): this {
    // TODO: this.body가 가끔 undefined인 문제가 있습니다.
    if (this.body !== null && this.body !== undefined) {
      // 현재 속도와 위치 저장
      const currentVelocity = this.body.velocity;
      const currentPosition = { x: this.x, y: this.y };

      // 바디 교체
      super.setFlipX(isFlipX);
      const bodyData = isFlipX ? this.shapes.flipped : this.shapes.default;
      this.setBody(bodyData);

      // 저장된 속도와 위치를 새 바디에 적용
      this.setVelocity(currentVelocity.x, currentVelocity.y);
      this.setPosition(currentPosition.x, currentPosition.y);
    }

    return this;
  }

  updateNicknamePosition(): void {
    this.nicknameSprite.setPosition(
      this.x - this.nicknameSprite.width / 2,
      this.y - this.height / 2 - this.nicknameSprite.height
    );
  }

  setPlayerCollisionEvent(): void {
    this.world.on(
      "collisionstart",
      (event: Phaser.Physics.Matter.Events.CollisionStartEvent, bodyA: MatterJS.BodyType, bodyB: MatterJS.BodyType) => {
        if (bodyA.gameObject !== null && "plankton" in bodyA.gameObject && bodyB.gameObject === this) {
          this.onTriggerPlanktonEat(bodyA.gameObject.plankton.planktonId);
        }
      }
    );
  }

  onTriggerPlanktonEat(planktonId: any): void {
    g.eventQueue.append({
      key: "plankton-eat",
      data: planktonId
    });
  }
}
