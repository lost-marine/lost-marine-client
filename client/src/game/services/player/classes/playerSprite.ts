import type { Player } from "@/game/types/player";

export class PlayerSprite extends Phaser.Physics.Matter.Sprite {
  playerId: number;
  _point: number;
  characterSprite: Phaser.Physics.Matter.Sprite;
  pointSprite: Phaser.GameObjects.Text;
  nicknameSprite: Phaser.GameObjects.Text;

  constructor(world: Phaser.Physics.Matter.World, scene: Phaser.Scene, texture: string, player: Player) {
    super(world, player.startX, player.startY, texture);

    this.playerId = player.playerId;
    this.name = player.nickname;
    // 현재는 undefined를 반환하기 때문에 임시로 0을 넣어두었습니다.
    this.point = player.point ?? 0;

    // 초기화된 컨테이너에 캐릭터 스프라이트, 닉네임, 포인트를 추가합니다.
    scene.matter.add.sprite(0, 0, texture);
    this.anims.play("swim");

    this.nicknameSprite = scene.add.text(0, 0, this.name, {
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

    // 인스턴스의 초기 스폰 위치를 설정합니다.
    scene.add.existing(this);
    this.setPosition(Math.trunc(scene.cameras.main.centerX), Math.trunc(scene.cameras.main.centerY));
    this.updateTextPosition();
  }

  move(x: number, y: number): void {
    this.setAwake(); // 잠자는 상태일 때 객체를 깨워줍니다.
    this.setVelocity(x, y);
    this.updateTextPosition();
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

  private updateTextPosition(): void {
    this.nicknameSprite.setPosition(
      this.x - this.nicknameSprite.width / 2,
      this.y - this.height / 2 - this.nicknameSprite.height * 2
    );
    this.pointSprite.setPosition(this.x - this.pointSprite.width / 2, this.y - this.height / 2 - this.pointSprite.height);
  }
}
