import g from "@/game/utils/global";
import type { GameOverResponse } from "../types/quit";
import { SCENE } from "@/game/constants/scene";
import { EventBus } from "@/game/EventBus";

const quitService = {
  onReceviedQuit: (playerId: number): void => {},
  onReceviedGameOver: (gameOverResponse: GameOverResponse): void => {}
};

// 플레이어 퇴장 처리
quitService.onReceviedQuit = (playerId: number): void => {
  g.playerMap.delete(playerId);
  g.eventQueue.append({
    key: "player-quit",
    data: playerId
  });
};

quitService.onReceviedGameOver = (gameOverResponse: GameOverResponse): void => {
  g.playerMap.delete(gameOverResponse.playerId);
  g.gameOverResult = gameOverResponse;
  g.currentScene = SCENE.GAME_OVER;
  EventBus.emit("change-scene", SCENE.GAME_OVER);
};

export default quitService;
