import type { Creature } from "./creature";

export type Player = {
  playerId: number;
  socketId: string;
  isFlipX: boolean;
  nickname: string;
  planktonCount: number;
  microplasticCount: number;
  playerCount: number;
  stopTime: number;
  level: number;
  point: number;
  speciesId: number;
} & Creature;
