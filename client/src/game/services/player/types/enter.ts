import type { Player } from "@/game/types/player";
import type { BaseSocketObject } from "@/game/types/socket";

export type EnterResponse = {
  myInfo: Player;
  playerList: Player[];
} & BaseSocketObject;
