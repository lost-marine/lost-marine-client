import type { Plankton } from "@/game/types/plankton";
import type { Player } from "@/game/types/player";
import type { BaseSocketObject } from "@/game/types/socket";

export type NameCertificateResponse = {
  isSuccess: boolean;
  msg: string;
};
export type EnterResponse = {
  myInfo: Player;
  playerList: Player[];
  planktonList: Plankton[];
} & BaseSocketObject;
