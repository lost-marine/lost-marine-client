import type { Creature } from "@/game/types";
import type { BaseSocketObject } from "@/game/types/socket";

export type EnterResponse = {
  myInfo: Creature;
} & BaseSocketObject;
