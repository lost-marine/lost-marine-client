import type { Player } from "@/game/types/player";

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

    super(world, player.centerX, player.centerY, texture, undefined, { shape: shapes.sunfish });
    this.shapes = {
      default: shapes.sunfish,
      flipped: shapes.sunfishFlipped
    };
    this.playerId = player.playerId;
    this.name = player.nickname;
    this.moveSpeed = 10;

    this.anims.play("swim");

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
  }

  move(directionX: number, directionY: number): void {
    this.setAwake(); // 잠자는 상태일 때 객체를 깨워줍니다.
    this.setVelocity(this.moveSpeed * directionX, this.moveSpeed * directionY);
  }

  setFlipX(isFlipX: boolean): this {
    if (this.body !== null) {
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
}
