import type { PlayerStatusInfo } from "../../player/types/crash";

export type eatPlanktonResponse = {
  isSuccess: boolean;
  planktonCount: number;
  microplasticCount: number;
  playerStatusInfo: PlayerStatusInfo;
};
