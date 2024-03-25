export type PlayerCrashResponse = {
  isSuccess: boolean;
  msg: string;
};
export type PlayerStatusInfo = {
  playerId: number;
  health: number;
  point: number;
  centerX: number;
  centerY: number;
  isGameOver: boolean;
};
