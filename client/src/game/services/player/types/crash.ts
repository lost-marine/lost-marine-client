export type PlayerCrashResult = {
  playerId: number; // 공격 받은 사람
  damage: number;
};

export type PlayerStatusInfo = {
  playerId: number;
  health: number;
  nowExp: number;
  centerX: number;
  centerY: number;
  isGameOver: boolean;
};
