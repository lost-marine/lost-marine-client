import type { Creature } from "./creature";
import type { SpeciesId } from "./species";

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
  nowExp: number;
  speciesId: SpeciesId;
} & Creature;
