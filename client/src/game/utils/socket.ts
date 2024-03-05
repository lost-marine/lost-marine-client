import { reactive } from "vue";
import { io } from "socket.io-client";
import type { Player } from "../types/player";
import { onReceviedEnter } from "../services/player";

export const state = reactive({
  connected: false
});

// "undefined" means the URL will be computed from the `window.location` object
const URL = "http://70.12.246.252:3000";

export const socket = io(URL);

socket.on("connect", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.on("enter", (newPlayer: Player) => {
  onReceviedEnter(newPlayer);
});
