import type { Creature } from "./creature";

export type Player = {
  startX: number;
  startY: number;
  direction: number;
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
