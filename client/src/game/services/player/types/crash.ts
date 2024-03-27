export type PlayerCrashResponse = {
  isSuccess: boolean;
  msg: string;
};
export type PlayerStatusInfo = {
  playerId: number;
  health: number;
  nowExp: number;
  centerX: number;
  centerY: number;
  isGameOver: boolean;
};
