import { reactive } from "vue";
import { io } from "socket.io-client";
import type { Player } from "../types/player";
import { type EnterResponse } from "../services/player";
import type { PlayerPositionInfo } from "../services/player/types/position";
import { onReceviedOthersPositionSync } from "../services/player/feat/movement";
import g from "./global";
import type { Plankton } from "../types/plankton";
import Swal from "sweetalert2";
import { EventBus } from "../EventBus";
import enterService from "./../services/player/feat/enter";
import type { PlayerCrashResult, PlayerStatusInfo } from "../services/player/types/crash";
import crashService from "../services/player/feat/crash";
import type { Chat, SystemChat } from "../types/chat";
import quitService from "../services/player/feat/quit";
import type { GameOverResponse } from "../services/player/types/quit";
import { SCENE } from "../constants/scene";
import type { ItemInfo } from "../services/player/types/item";
import type { OthersEvolutionInfo } from "../services/player/types/evolution";
import evolutionService from "../services/player/feat/evolution";
import itemEatService from "../services/item/feat/eat";

export const state = reactive({
  connected: false
});

// "undefined" means the URL will be computed from the `window.location` object
const URL: string = import.meta.env.VITE_URL;

export const socket = io(URL);

socket.on("connect", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
  void Swal.fire("오류", "서버에 문제가 생겼습니다. ", "error").then(() => {
    EventBus.emit("change-scene", SCENE.MAIN_MENU); // 서버가 터질시 메인메뉴로 이동
  });
});

socket.on("game-start", async (response: EnterResponse) => {
  g.myInfo = response.myInfo;
  g.playerMap = response.playerList.reduce((map, player) => {
    map.set(player.playerId, player);
    return map;
  }, new Map<number, Player>());
  response.planktonList.forEach((plankton: Plankton) => {
    g.planktonMap.set(plankton.planktonId, plankton);
  });
  Swal.close();
  EventBus.emit("change-scene", SCENE.GAME);
});

// 다른 플레이어가 게임방 입장
socket.on("player-enter", (newPlayer: Player) => {
  enterService.onReceviedEnter(newPlayer);
});

// 다른 플레이어가 게임방 퇴장
socket.on("player-quit", (playerId: number) => {
  quitService.onReceviedQuit(playerId);
});

// 플레이어가 게임 오버 당함
socket.on("game-over", async (gameOverResponse: GameOverResponse) => {
  quitService.onReceviedGameOver(gameOverResponse);
});

// 다른 플레이어들의 위치 동기화 신호 수신
socket.on("others-position-sync", (positionsInfo: PlayerPositionInfo[]) => {
  onReceviedOthersPositionSync(positionsInfo);
});

// 다른 플레이어가 플랑크톤 섭취
socket.on("plankton-delete", (planktonId: number) => {
  g.planktonMap.delete(planktonId);
  g.eventQueue.append({
    key: "plankton-delete",
    data: planktonId
  });
});

// 플랑크톤 리스폰
socket.on("plankton-respawn", (newPlanktonList: Plankton[]) => {
  newPlanktonList.forEach((plankton: Plankton) => {
    g.planktonMap.set(plankton.planktonId, plankton);
  });
  g.eventQueue.append({
    key: "plankton-respawn",
    data: newPlanktonList
  });
});

// 플레이어가 입력한 채팅 메시지 수신
socket.on("chat-message-receive", (message: Chat) => {
  g.chatList.value.push(message);
});

// 시스템이 보내주는 시스템 메시지 수신
socket.on("system-log", (message: SystemChat) => {
  g.chatList.value.push(message);
});

// 플레이어 충돌 후 상태 수정
socket.on("player-status-sync", (playerStatusInfo: PlayerStatusInfo) => {
  crashService.onReceivedStatusSync(playerStatusInfo);
});

// 플레이어 충돌 후 결과 수신
socket.on("player-crash", (playerCrashResult: PlayerCrashResult) => {
  crashService.onReceivedCrash(playerCrashResult);
});

// 아이템 충돌 후 상태 수정
socket.on("item-sync", (itemInfo: ItemInfo) => {
  itemEatService.itemSync(itemInfo);
});

// 다른 플레이어 진화 싱크
socket.on("others-evolution-sync", (othersEvolutionInfo: OthersEvolutionInfo) => {
  evolutionService.onReceivedEvolutionSync(othersEvolutionInfo);
});
