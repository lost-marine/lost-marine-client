import type { DirectionType } from "../../../types/direction";

export type PlayerPositionInfo = {
  playerId: number;
  centerX: number;
  centerY: number;
  direction: DirectionType;
  isFlipX: boolean;
};
