import { Scene, type GameObjects } from "phaser";
import { EventBus } from "../EventBus";
import { inputNameElement } from "../components/inputNameElement";
import enterService from "../services/player/feat/enter";
import type { SceneType } from "../types/scene";
import Swal from "sweetalert2";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  logoTween: Phaser.Tweens.Tween | null;
  startButton: GameObjects.Text;
  nameInput: Phaser.GameObjects.DOMElement;
  inputElement: HTMLInputElement;
  musicOnButton: Phaser.GameObjects.Image;
  musicOffButton: Phaser.GameObjects.Image;
  infoButton: Phaser.GameObjects.Image;
  constructor() {
    super("MainMenu");
  }

  preload(): void {
    this.load.audio("bgm", "assets/sounds/background.mp3");
    this.load.image("music_on", "assets/components/VolumeUp.png");
    this.load.image("music_off", "assets/components/VolumeOff.png");
    this.load.image("info", "assets/components/InfoButton.png");
  }

  create(): void {
    this.sound.add("bgm", { loop: true, volume: 0.5 }).play();
    this.background = this.add.image(0, 0, "background").setOrigin(0, 0);

    // 이미지의 스케일을 게임의 크기에 맞추기
    // 가로 및 세로 방향으로 필요한 스케일 비율을 계산
    const scaleX = this.cameras.main.width / this.background.width;
    const scaleY = this.cameras.main.height / this.background.height;
    const scale = Math.max(scaleX, scaleY);
    // 계산된 스케일로 이미지 스케일 설정
    this.background.setScale(scale).setScrollFactor(0);

    this.logo = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 3, "logo").setDepth(100);
    this.logo.setScale(1.3);
    // name form
    this.inputElement = inputNameElement();

    // Phaser DOMElement로 추가
    this.nameInput = this.add
      .dom(this.cameras.main.width / 2, this.cameras.main.height / 2, this.inputElement)
      .setOrigin(0.5, 0.5)
      .setDepth(100);

    this.inputElement.focus();

    this.inputElement.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        // 엔터 키를 누를 때의 처리
        void this.startGame();
      }
    });

    // 게임시작 버튼 추가
    this.startButton = this.add
      .text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 100, "게임 시작", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center"
      })
      .setInteractive()
      .setOrigin(0.5)
      .setDepth(100)
      .on("pointerdown", async () => {
        await this.startGame();
      });

    // 버튼에 마우스 오버/아웃 효과
    this.startButton.on("pointerover", () => {
      this.startButton.setScale(1.1); // 마우스 오버 시 버튼 확대`
    });
    this.startButton.on("pointerout", () => {
      this.startButton.setScale(1.0); // 마우스 아웃 시 버튼 원래 크기로
    });

    // 음악켜는 버튼 추가
    this.musicOffButton = this.add
      .image(this.cameras.main.width - 100, 100, "music_on")
      .setInteractive()
      .setOrigin(0.5)
      .setDepth(100)
      .on("pointerdown", async () => {
        this.setSoundMute(false);
      });

    // 버튼에 마우스 오버/아웃 효과
    this.musicOffButton.on("pointerover", () => {
      this.musicOffButton.setScale(1.1); // 마우스 오버 시 버튼 확대`
    });
    this.musicOffButton.on("pointerout", () => {
      this.musicOffButton.setScale(1); // 마우스 아웃 시 버튼 원래 크기로
    });

    // 음악끄는 버튼 추가
    this.musicOnButton = this.add
      .image(this.cameras.main.width - 100, 100, "music_off")
      .setInteractive()
      .setDepth(100)
      .on("pointerdown", async () => {
        this.setSoundMute(true);
      });

    // 버튼에 마우스 오버/아웃 효과
    this.musicOnButton.on("pointerover", () => {
      this.musicOnButton.setScale(1.1); // 마우스 오버 시 버튼 확대
    });
    this.musicOnButton.on("pointerout", () => {
      this.musicOnButton.setScale(1); // 마우스 아웃 시 버튼 원래 크기로
    });
    const isSoundMute: boolean = JSON.parse(localStorage.getItem("isSoundMute") ?? "true");
    this.setSoundMute(isSoundMute);

    // 게임 정보 모달을 여는 버튼 추가
    this.infoButton = this.add
      .image(this.cameras.main.width - 200, 100, "info")
      .setInteractive()
      .setDepth(100)
      .on("pointerdown", async () => {
        EventBus.emit("open-info-modal");
      });

    // 버튼에 마우스 오버/아웃 효과
    this.infoButton.on("pointerover", () => {
      this.infoButton.setScale(1.1); // 마우스 오버 시 버튼 확대
    });
    this.infoButton.on("pointerout", () => {
      this.infoButton.setScale(1); // 마우스 아웃 시 버튼 원래 크기로
    });

    EventBus.emit("current-scene-ready", this);
  }

  async startGame(): Promise<void> {
    if (Swal.getContainer() == null) {
      const nickname = this.inputElement.value;
      await enterService.enterGame(nickname);
    }
  }

  changeScene(target: SceneType): void {
    this.scene.start(target);
  }

  setSoundMute(value: boolean): void {
    localStorage.setItem("isSoundMute", JSON.stringify(value));
    this.sound.mute = !value;
    if (value) {
      this.musicOffButton.setActive(true).setVisible(true);
      this.musicOnButton.setActive(false).setVisible(false);
    } else {
      this.musicOffButton.setActive(false).setVisible(false);
      this.musicOnButton.setActive(true).setVisible(true);
    }
  }
}
