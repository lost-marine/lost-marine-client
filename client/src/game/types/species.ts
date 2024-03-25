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
  baseSpriteUrl: string;
  frameStart: number;
  frameEnd: number;
  englishName: string;
  IUCNGrade: string;
  info: string;
  requirementPoint: number;
};

export const IUCN_GRADE = {
  EX: "절멸 (EX, Extinct)",
  EW: "야생절멸 (EW, Extinct in the Wild)",
  CR: "위급 (CR, Critically Endangered)",
  EN: "위기 (EN, Endangered)",
  VU: "취약 (VU, Vulnerable)",
  NT: "준위협 (NT, Near Threatened)",
  LC: "최소관심 (LC, Least Concern)",
  DD: "정보부족 (DD, Data Deficient)",
  NE: "미평가 (NE, Not Evaluated)"
};
