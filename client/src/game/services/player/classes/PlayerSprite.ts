import type { Player } from "@/game/types/player";
import { pipe } from "@/game/utils/pipe";

export class PlayerSprite extends Phaser.GameObjects.Container {
  playerId: number;
  _point: number;
  // 닉네임과 스코어를 제외한 오직 캐릭터 부분의 sprite만 의미합니다.
  playerSprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  pointSprite: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, texture: string, player: Player) {
    super(scene, player.startX, player.startY);
    this.playerId = player.playerId;
    this.name = player.nickname;
    // 현재는 undefined를 반환하기 때문에 임시로 0을 넣어두었습니다.
    this.point = player.point ?? 0;

    this.setPosition(Math.trunc(scene.cameras.main.centerX), Math.trunc(scene.cameras.main.centerY));
    // 반드시 Container의 size를 정한 후 scene에 add해야합니다.
    pipe(
      () => {
        this.setSize(192, 192);
      },
      () => {
        scene.add.existing(this);
        scene.physics.world.enable(this);
        scene.physics.add.existing(this);
      }
    );

    this.playerSprite = scene.physics.add.sprite(0, 0, texture);
    this.playerSprite.anims.play("swim");

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

    nickname.setPosition(
      this.playerSprite.x - nickname.width / 2,
      this.playerSprite.y - this.playerSprite.height / 2 - nickname.height * 2
    );
    this.pointSprite.setPosition(
      this.playerSprite.x - this.pointSprite.width / 2,
      this.playerSprite.y - this.playerSprite.height / 2 - this.pointSprite.height
    );

    this.add([this.playerSprite, nickname, this.pointSprite]);

    const playerContainerBody = this.body as Phaser.Physics.Arcade.Body;
    playerContainerBody.setCollideWorldBounds(true);
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
