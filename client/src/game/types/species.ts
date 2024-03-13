export type Species = {
  speciesId: number;
  name: string;
  key: string;
  width: number;
  height: number;
  power: number;
  health: number;
  evolutionSet: Set<number>;
  tierCode: number;
  spritesheetUrl: string;
  shapesUrl: string;
};
