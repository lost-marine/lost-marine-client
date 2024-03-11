import type { Player } from "@/game/types/player";

/**
 * 이 함수는 반드시 playerSprite constructor 안에서 호출되어야 합니다.
 *
 * `Container` 초기화 과정의 순서를 명시하는 기능을 합니다.
 * @param {PlayerSprite} playerSprite 타겟 `PlayerSprite`
 * @param {number} speciesWidth `species`의 너비
 * @param {number} speciesHeight `species`의 높이
 * @param {Phaser.Scene} scene 타겟 `Scene`
 * @returns {void}
 */

export class PlayerSprite extends Phaser.Physics.Matter.Sprite {
  playerId: number;
  _point: number;
  pointSprite: Phaser.GameObjects.Text;
  playerContainer: Phaser.GameObjects.Container;
  shapes: {
    default: string | Phaser.Types.Physics.Matter.MatterSetBodyConfig;
    flipped: string | Phaser.Types.Physics.Matter.MatterSetBodyConfig;
  };

  constructor(world: Phaser.Physics.Matter.World, scene: Phaser.Scene, texture: string, player: Player) {
    const shapes = scene.cache.json.get("shapes");

    super(world, player.startX, player.startY, texture, 0, { shape: shapes.sunfish });
    this.shapes = {
      default: shapes.sunfish,
      flipped: shapes.sunfishFlipped
    };
    this.playerId = player.playerId;
    this.name = player.nickname;
    // 현재는 undefined를 반환하기 때문에 임시로 0을 넣어두었습니다.
    this.point = player.point ?? 0;
    // 초기화된 컨테이너에 캐릭터 스프라이트, 닉네임, 포인트를 추가합니다.
    this.anims.play("swim");

    const nickname: Phaser.GameObjects.Text = scene.add.text(0, 0, this.name, {
      fontSize: "16px",
      fontStyle: "bold",
      stroke: "#000",
      strokeThickness: 1
    });
    this.pointSprite = scene.add.text(0, 0, this.point.toString(), {
      fontSize: "16px",
      fontStyle: "bold",
      stroke: "#000",
      strokeThickness: 1
    });

    this.setSize(player.width, player.height);
    nickname.setPosition(this.x - nickname.width / 2, this.y - this.height / 2 - nickname.height * 2);
    this.pointSprite.setPosition(this.x - this.pointSprite.width / 2, this.y - this.height / 2 - this.pointSprite.height);

    // initializeContainer(this, 192, 192, scene);
    this.playerContainer = scene.add.container(0, 0);
    this.playerContainer.setSize(player.width, player.height);
    // scene.matter.add.gameObject(this.playerContainer);
    this.playerContainer.add([this, nickname, this.pointSprite]);

    // 인스턴스의 초기 스폰 위치를 설정합니다.
    scene.add.existing(this);
    this.setPosition(Math.trunc(scene.cameras.main.centerX), Math.trunc(scene.cameras.main.centerY));
    this.playerContainer.setPosition(this.x, this.y);
  }

  move(x: number, y: number): void {
    //   const playerContainerBody = this.body as Phaser.Physics.Arcade.Body;
    //   playerContainerBody.setVelocity(x, y);
    this.setAwake(); // 잠자는 상태일 때 객체를 깨워줍니다.
    this.setVelocity(x, y);
    this.playerContainer.setPosition(this.x, this.y);
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

  get point(): number {
    return this._point;
  }

  set point(value: number) {
    this._point = value;
    if (this.pointSprite !== undefined) {
      this.pointSprite.setText(this._point.toString());
    }
  }
}
