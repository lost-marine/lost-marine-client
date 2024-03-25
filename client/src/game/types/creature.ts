import type { DirectionType } from "./direction";

export type Creature = {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  direction: DirectionType;
  health: number;
  type: number;
  power: number;
  status: number;
};
