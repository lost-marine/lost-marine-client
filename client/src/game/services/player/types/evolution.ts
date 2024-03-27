import type { SpeciesId } from "@/game/types/species";

export type PlayerEvolutionInfo = {
  speciesId: SpeciesId;
  playerId: number;
  point: number;
};

export type PlayerEvolutionResponse = {
  isSuccess: boolean;
  msg: string;
};

export type OthersEvolutionInfo = {
  playerId: number;
  speciesId: SpeciesId;
};
