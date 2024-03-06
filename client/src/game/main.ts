import { Boot } from "./scenes/Boot";
import { GameOver } from "./scenes/GameOver";
import { Game as MainGame } from "./scenes/Game";
import { MainMenu } from "./scenes/MainMenu";
import Phaser from "phaser";
import { Preloader } from "./scenes/Preloader";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: "100",
  height: "100",
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: "game-container",
    width: "100%",
    height: "100%"
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true
    }
  },
  parent: "game-container",
  dom: {
    createContainer: true // DOM 요소의 컨테이너를 자동으로 생성하도록 설정
  },
  backgroundColor: "#028af8",
  scene: [Boot, Preloader, MainMenu, MainGame, GameOver]
};

const StartGame = (parent: string): Phaser.Game => {
  return new Phaser.Game({ ...config, parent });
};

export default StartGame;
