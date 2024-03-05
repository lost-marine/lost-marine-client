import type { Player } from "@/game/types/player";
import { pipe } from "@/game/utils/pipe";

export class PlayerSprite extends Phaser.GameObjects.Container {
  playerId: number;
  score: number;
  // 닉네임과 스코어를 제외한 오직 캐릭터 부분의 sprite만 의미합니다.
  playerSprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor(scene: Phaser.Scene, texture: string, player: Player) {
    super(scene, player.startX, player.startY);
    this.playerId = player.playerId;
    this.name = player.nickname;
    this.score = 30;

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
    const score: Phaser.GameObjects.Text = scene.add.text(0, 0, this.score + "", {
      fontSize: "16px",
      fontStyle: "bold",
      stroke: "#000",
      strokeThickness: 1
    });

    nickname.setPosition(
      this.playerSprite.x - nickname.width / 2,
      this.playerSprite.y - this.playerSprite.height / 2 - nickname.height * 2
    );
    score.setPosition(this.playerSprite.x - score.width / 2, this.playerSprite.y - this.playerSprite.height / 2 - score.height);

    this.add([this.playerSprite, nickname, score]);

    const playerContainerBody = this.body as Phaser.Physics.Arcade.Body;
    playerContainerBody.setCollideWorldBounds(true);
  }
}
