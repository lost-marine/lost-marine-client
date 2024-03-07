import { Queue } from "queue-typescript";
import type { Player } from "../types/player";
import type { BaseSocketObject } from "../types/socket";
import type { Plankton } from "../types/plankton";

type GlobalStore = {
  myInfo: null | Player;
  playerMap: Map<number, Player>;
  eventQueue: Queue<BaseSocketObject>;
  planktonList: Plankton[];
};
const g: GlobalStore = {
  myInfo: null,
  playerMap: new Map<number, Player>(),
  eventQueue: new Queue<BaseSocketObject>(),
  planktonList: []
};

export default g;
