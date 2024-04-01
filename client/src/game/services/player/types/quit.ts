import type { SpeciesId } from "@/game/types/species";

export type GameOverResponse = {
  playerId: number;
  playerNickname: string;
  attackerNickname: string;
  attackerSpeciesId: SpeciesId;
  message: string;
  planktonCount: number;
  microplasticCount: number;
  playerCount: number;
  totalExp: number;
};
