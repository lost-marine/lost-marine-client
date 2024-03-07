import { reactive } from "vue";
import { io } from "socket.io-client";
import type { Player } from "../types/player";
import { onReceviedEnter } from "../services/player";
import type { PlayerPositionInfo } from "../services/player/types/position";
import { onReceviedOthersPositionSync } from "../services/player/feat/movement";
import { onReceviedQuit } from "../services/player/feat/quit";

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
});

// 다른 플레이어가 게임방 입장
socket.on("enter", (newPlayer: Player) => {
  onReceviedEnter(newPlayer);
});

// 다른 플레이어가 게임방 퇴장
socket.on("quit", (playerId: number) => {
  onReceviedQuit(playerId);
});

// 다른 플레이어들의 위치 동기화 신호 수신
socket.on("others-position-sync", (positionsInfo: PlayerPositionInfo[]) => {
  onReceviedOthersPositionSync(positionsInfo);
});
