import { type DIRECTION, type DIRECTION_X } from "@/game/constants/direction";

// 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
export type DirectionType = (typeof DIRECTION)[keyof typeof DIRECTION];
export type AxisDirectionType = (typeof DIRECTION_X)[keyof typeof DIRECTION_X];
