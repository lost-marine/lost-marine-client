import { reactive } from "vue";
import { io } from "socket.io-client";
import g from "@/game/utils/global";
export const state = reactive({
  connected: false,
  userInfo: g.userInfo
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
