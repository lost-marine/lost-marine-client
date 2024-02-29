import { DIRECTION } from "@/game/constants/direction";

// 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
export type DirectionType = (typeof DIRECTION)[keyof typeof DIRECTION];
