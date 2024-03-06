import type { Plankton } from "@/game/types/plankton";
import { socket } from "@/game/utils/socket";
import g from "@/game/utils/global";

export const initPlanktonList = (): void => {
  socket.emit("plankton-init", {}, (response: Plankton[]) => {
    g.planktonList = response;
  });
};
