import type { Creature } from "./creature";

export type Player = {
  playerId: number;
  socketId: string;
  nickname: string;
  planktonCount: number;
  microplasticCount: number;
  playerCount: number;
  stopTime: number;
  level: number;
  point: number;
} & Creature;
