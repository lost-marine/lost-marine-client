export const inputNameElement = (scene: Phaser.Scene): HTMLInputElement => {
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
};
