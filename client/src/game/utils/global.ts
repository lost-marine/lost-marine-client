import { Queue } from "queue-typescript";
import type { Player } from "../types/player";
import type { BaseSocketObject } from "../types/socket";

type GlobalStore = {
  myInfo: null | Player;
  playerList: Player[];
  eventQueue: Queue<BaseSocketObject>;
};
const global: GlobalStore = {
  myInfo: null,
  playerList: [],
  eventQueue: new Queue<BaseSocketObject>()
};

export default global;
