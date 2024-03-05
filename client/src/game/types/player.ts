import type { Creature } from "./creature";
import type { DirectionType } from "./direction";

export type Player = {
  startX: number;
  startY: number;
  isFlipX: boolean;
  direction: DirectionType;
  health: number;
  type: number;
  power: number;
  status: number;
  playerId: number;
  nickname: string;
  planktonCount: number;
  microplasticCount: number;
  playerCount: number;
  stopTime: number;
  level: number;
  experience: number;
  socketId: string;
} & Creature;
