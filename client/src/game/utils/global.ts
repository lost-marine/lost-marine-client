import { Queue } from "queue-typescript";
import type { Player } from "../types/player";
import type { BaseSocketObject } from "../types/socket";
import type { Plankton } from "../types/plankton";

type GlobalStore = {
  myInfo: null | Player;
  playerList: Player[];
  eventQueue: Queue<BaseSocketObject>;
  planktonList: Plankton[];
};
const global: GlobalStore = {
  myInfo: null,
  playerList: [],
  eventQueue: new Queue<BaseSocketObject>(),
  planktonList: []
};

export default global;
