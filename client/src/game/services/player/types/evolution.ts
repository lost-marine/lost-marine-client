import type { SpeciesId } from "@/game/types/species";

export type PlayerEvolutionInfo = {
  speciesId: SpeciesId;
  playerId: number;
  nowExp: number;
};

export type PlayerEvolutionResponse = {
  isSuccess: boolean;
  msg: string;
  nowExp: number;
};

export type OthersEvolutionInfo = {
  playerId: number;
  speciesId: SpeciesId;
};
