import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import type { SceneType } from "../types/scene";
import g from "../utils/global";
import { speciesMap } from "../constants/species";
import type { Species } from "../types/species";

export class GameOver extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  speciesInfo: null | Species;
  newGameButton: Phaser.GameObjects.Image;

  constructor() {
    super("GameOver");
  }

  preload(): void {
    this.load.audio("bgm", "assets/sounds/background.mp3");
    if (g.myInfo != null) this.speciesInfo = speciesMap.get(g.myInfo?.speciesId) ?? null;
    if (this.speciesInfo != null) {
      this.load.spritesheet(this.speciesInfo.key, this.speciesInfo.spritesheetUrl, {
        frameWidth: this.speciesInfo.width,
        frameHeight: this.speciesInfo.height
      });
      this.anims.create({
        key: this.speciesInfo.key,
        frames: this.anims.generateFrameNumbers(this.speciesInfo.key, {
          start: this.speciesInfo.frameStart,
          end: this.speciesInfo.frameEnd
        }),
        frameRate: 3,
        repeat: -1
      });
    }
    this.load.image("restartButton", "assets/components/restartButton.png");
  }

  create(): void {
    this.sound.add("bgm", { loop: true }).play();
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor("rgba(0,0,0)");

    this.background = this.add.image(512, 384, "background");
    this.background.setAlpha(0.4);

    const baseTextStyle = {
      fontFamily: "Arial Black",
      fontSize: 17,
      color: "#FFFFFF",
      align: "center"
    };

    const titleTextStyle = {
      fontSize: 25
    };

    const COLORS = {
      RED: "#DB4A4A"
    };

    if (g.myInfo != null && this.speciesInfo != null) {
      this.add.text(100, 50, g.myInfo?.nickname, {
        fontFamily: "Arial Black",
        fontSize: 25,
        color: "#ffffff"
      });

      this.add.text(100, 90, `당신의 안일함이\n${this.speciesInfo.name}의 개체수를 줄였습니다.`, {
        fontFamily: "Arial Black",
        fontSize: 25,
        color: "#FDE790"
      });

      this.add.text(100, 170, "킬", baseTextStyle);

      this.add.text(100, 200, "0", baseTextStyle);

      this.add.text(150, 170, "경험치", baseTextStyle);

      this.add.text(150, 200, "0", baseTextStyle);

      this.add.text(250, 170, "플랑크톤", baseTextStyle);

      this.add.text(250, 200, "0", baseTextStyle);
      this.add.text(380, 170, "미세 플라스틱", baseTextStyle);

      this.add.text(380, 200, "0", baseTextStyle);

      this.add.image(150, 330, this.speciesInfo.key);
      this.add.text(90, 420, `${this.speciesInfo.name} (${this.speciesInfo.englishName})`, baseTextStyle);
      this.add.text(90, 450, `멸종위기 등급 : ${this.speciesInfo.IUCNGrade}`, baseTextStyle);
      this.add.text(90, 500, `${this.speciesInfo.info}`, { wordWrap: { width: 400 }, ...baseTextStyle, align: "left" });

      this.add
        .text(this.camera.width - 200, this.camera.height - 140, "박연서의 지느러미", { ...baseTextStyle, align: "right" })
        .setOrigin(1, 0.5);
      this.add
        .text(this.camera.width - 200, this.camera.height - 100, "당신은 나의 비늘에 불과하지", {
          ...baseTextStyle,
          ...titleTextStyle,
          align: "right",
          color: COLORS.RED
        })
        .setOrigin(1, 0.5);
      this.add.image(this.camera.width - 100, this.camera.height - 120, this.speciesInfo.key);

      // 게임시작 버튼 추가
      this.newGameButton = this.add
        .image(this.camera.width - 100, this.camera.height - 50, "restartButton")
        .setScale(0.7)
        .setInteractive()
        .setOrigin(0.5)
        .setDepth(100)
        .on("pointerdown", async () => {
          console.log("click");
        });

      // 버튼에 마우스 오버/아웃 효과
      this.newGameButton.on("pointerover", () => {
        this.newGameButton.setScale(0.8); // 마우스 오버 시 버튼 확대`
      });
      this.newGameButton.on("pointerout", () => {
        this.newGameButton.setScale(0.7); // 마우스 아웃 시 버튼 원래 크기로
      });
    }

    EventBus.emit("current-scene-ready", this);
  }

  changeScene(target: SceneType): void {
    this.scene.start(target);
  }
}
