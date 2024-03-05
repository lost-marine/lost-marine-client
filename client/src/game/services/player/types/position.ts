import type { DirectionType } from "../../../types/direction";

export type PlayerPositionInfo = {
  playerId: number;
  startX: number;
  startY: number;
  direction: DirectionType;
  isFlipX: boolean;
};
