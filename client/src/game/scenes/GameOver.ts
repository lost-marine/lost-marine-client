import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import type { SceneType } from "../types/scene";
import g from "../utils/global";
import { speciesMap } from "../constants/species";
import type { Species } from "../types/species";
import type { GameOverResponse } from "../services/player/types/quit";
import { SCENE } from "../constants/scene";

export class GameOver extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  mySpeciesInfo: null | Species;
  attackerSpeciesInfo: null | Species;
  newGameButton: Phaser.GameObjects.Image;
  gameOverResult: GameOverResponse;

  constructor() {
    super("GameOver");
  }

  preload(): void {
    this.load.audio("bgm", "assets/sounds/background.mp3");
    if (g.gameOverResult != null) {
      if (g.gameOverResult.playerId === g.myInfo?.playerId) {
        if (g.myInfo != null) this.mySpeciesInfo = speciesMap.get(g.myInfo?.speciesId) ?? null;
        this.attackerSpeciesInfo = speciesMap.get(g.gameOverResult.attackerSpeciesId) ?? null;
        this.gameOverResult = g.gameOverResult;
      } else {
        this.restartGame();
        console.debug("g.gameOverResult.playerId === g.myInfo?.playerId");
        console.debug("g.gameOverResult.playerId : ", g.gameOverResult?.playerId);
        console.debug("g.myInfo?.playerId : ", g.myInfo?.playerId);
      }
    } else {
      this.restartGame();
      console.debug("gameOverResult is null");
    }
    // 내 캐릭터 이미지 로드
    if (this.mySpeciesInfo != null) {
      this.load.spritesheet(this.mySpeciesInfo.key, this.mySpeciesInfo.spritesheetUrl, {
        frameWidth: this.mySpeciesInfo.width,
        frameHeight: this.mySpeciesInfo.height
      });
      this.anims.create({
        key: this.mySpeciesInfo.key,
        frames: this.anims.generateFrameNumbers(this.mySpeciesInfo.key, {
          start: this.mySpeciesInfo.frameStart,
          end: this.mySpeciesInfo.frameEnd
        }),
        frameRate: 3,
        repeat: -1
      });
    }

    // 날 먹은 캐릭터 이미지 로드
    if (this.attackerSpeciesInfo != null) {
      this.load.spritesheet(this.attackerSpeciesInfo.key, this.attackerSpeciesInfo.spritesheetUrl, {
        frameWidth: this.attackerSpeciesInfo.width,
        frameHeight: this.attackerSpeciesInfo.height
      });
      this.anims.create({
        key: this.attackerSpeciesInfo.key,
        frames: this.anims.generateFrameNumbers(this.attackerSpeciesInfo.key, {
          start: this.attackerSpeciesInfo.frameStart,
          end: this.attackerSpeciesInfo.frameEnd
        }),
        frameRate: 3,
        repeat: -1
      });
    }
    this.load.image("restartButton", "assets/components/restartButton.png");
  }

  create(): void {
    const COLORS = {
      RED: "#DB4A4A",
      WHITE: "#FFFFFF",
      YELLOW: "#FDE790",
      BLACK: "#000000"
    };

    this.sound.add("bgm", { loop: true }).play();
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(COLORS.BLACK);

    this.background = this.add.image(512, 384, "background");
    const scaleX = this.background.width / this.cameras.main.width;
    const scaleY = this.background.height / this.cameras.main.height;
    this.background.setAlpha(0.4);
    this.background.setScale(scaleX, scaleY);

    const baseTextStyle = {
      fontFamily: "Arial Black",
      fontSize: 17,
      color: COLORS.WHITE,
      align: "center"
    };

    const titleTextStyle = {
      fontSize: 25
    };

    if (g.myInfo != null && this.mySpeciesInfo != null && this.attackerSpeciesInfo != null) {
      // 본인 이름
      this.add.text(100, 50, g.myInfo?.nickname, {
        fontFamily: "Arial Black",
        fontSize: 25,
        color: COLORS.WHITE
      });
      // 죽었을 때 보이는 멘트
      this.add.text(100, 90, `당신의 안일함이\n${this.mySpeciesInfo.name}의 개체수를 줄였습니다.`, {
        fontFamily: "Arial Black",
        fontSize: 25,
        color: COLORS.YELLOW
      });

      // 점수 정보
      this.add.text(100, 170, "킬", baseTextStyle);
      this.add.text(100, 200, `${this.gameOverResult.playerCount}`, baseTextStyle);
      this.add.text(150, 170, "경험치", baseTextStyle);
      this.add.text(150, 200, `${this.gameOverResult.totalExp}`, baseTextStyle);
      this.add.text(250, 170, "플랑크톤", baseTextStyle);
      this.add.text(250, 200, `${this.gameOverResult.planktonCount}`, baseTextStyle);
      this.add.text(380, 170, "미세 플라스틱", baseTextStyle);
      this.add.text(380, 200, `${this.gameOverResult.microplasticCount}`, baseTextStyle);
      this.add.image(150, 330, this.mySpeciesInfo.key);
      this.add.text(90, 420, `${this.mySpeciesInfo.name} (${this.mySpeciesInfo.englishName})`, baseTextStyle);
      this.add.text(90, 450, `멸종위기 등급 : ${this.mySpeciesInfo.IUCNGrade}`, baseTextStyle);
      this.add.text(90, 500, `${this.mySpeciesInfo.info}`, { wordWrap: { width: 400 }, ...baseTextStyle, align: "left" });

      // 오른쪽 아래 게임 시작 부분
      this.add
        .text(this.camera.width - 200, this.camera.height - 140, `${this.gameOverResult.attackerNickname}`, {
          ...baseTextStyle,
          align: "right"
        })
        .setOrigin(1, 0.5);
      this.add
        .text(this.camera.width - 200, this.camera.height - 100, `${this.gameOverResult.message}`, {
          ...baseTextStyle,
          ...titleTextStyle,
          align: "right",
          color: COLORS.RED
        })
        .setOrigin(1, 0.5);
      this.add.image(this.camera.width - 100, this.camera.height - 120, this.attackerSpeciesInfo.key);

      // 게임시작 버튼 추가
      this.newGameButton = this.add
        .image(this.camera.width - 100, this.camera.height - 50, "restartButton")
        .setScale(0.7)
        .setInteractive()
        .setOrigin(0.5)
        .setDepth(100)
        .on("pointerdown", async () => {
          this.restartGame();
        });

      // 버튼에 마우스 오버/아웃 효과
      this.newGameButton.on("pointerover", () => {
        this.newGameButton.setScale(0.8); // 마우스 오버 시 버튼 확대`
      });
      this.newGameButton.on("pointerout", () => {
        this.newGameButton.setScale(0.7); // 마우스 아웃 시 버튼 원래 크기로
      });
    } else {
      this.restartGame();
    }

    EventBus.emit("current-scene-ready", this);
  }

  changeScene(target: SceneType): void {
    this.scene.start(target);
  }

  restartGame(): void {
    this.changeScene(SCENE.MAIN_MENU);
    g.gameOverResult = null;
    g.clear();
  }
}
