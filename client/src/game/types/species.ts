export type RequiredPointToEvolve = {
  tier1: number;
  tier2: number;
  tier3: number;
  tier4: number;
};

export type SpeciesId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type Species = {
  speciesId: SpeciesId;
  name: string;
  key: string;
  width: number;
  height: number;
  power: number;
  health: number;
  evolutionList: SpeciesId[];
  tierCode: number;
  spritesheetUrl: string;
  baseSpriteUrl: string;
  frameStart: number;
  frameEnd: number;
  englishName: string;
  IUCNGrade: string;
  info: string;
  requirementPoint: number;
};
