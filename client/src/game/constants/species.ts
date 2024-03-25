import { IUCN_GRADE, type Species } from "../types/species";

type RequiredPointToEvolve = {
  tier1: number;
  tier2: number;
  tier3: number;
};
const requiredPointToEvolve: RequiredPointToEvolve = {
  tier1: 100,
  tier2: 500,
  tier3: 1000
};

export const speciesMap: Map<number, Species> = new Map<number, Species>([
  [
    1,
    {
      speciesId: 1,
      name: "흰동가리",
      key: "nemo",
      width: 64,
      height: 64,
      power: 10,
      health: 100,
      evolutionSet: new Set([3, 4]),
      tierCode: 1,
      spritesheetUrl: "assets/sprites/Nemo.png",
      baseSpriteUrl: "assets/sprites/base/Nemo.png",
      frameStart: 0,
      frameEnd: 3,
      englishName: "Clownfish",
      IUCNGrade: IUCN_GRADE.LC,
      info: "자리돔과 흰동가리아과에 속하는 물고기를 통칭하여 흰동가리라고 부른다. 또 다른 말은 광대어 혹은 아네모네 피시.영화 니모를 찾아서로 유명해진 그 물고기. 좁은 의미로는 국내 기록종인 흰동가리(Amphiprion clarkii)를 부르는 말이다.",
      get requirementPoint() {
        return requiredPointToEvolve[("tier" + this.tierCode) as keyof RequiredPointToEvolve];
      }
    }
  ],
  [
    2,
    {
      speciesId: 2,
      name: "고등어",
      key: "mackerel",
      width: 64,
      height: 64,
      power: 10,
      health: 100,
      evolutionSet: new Set([3, 4]),
      tierCode: 1,
      spritesheetUrl: "assets/sprites/Mackerel.png",
      baseSpriteUrl: "assets/sprites/base/Mackerel.png",
      frameStart: 0,
      frameEnd: 1,
      englishName: "Mackerel",
      IUCNGrade: IUCN_GRADE.NE,
      info: "삼치, 참치 등과 같은 과에 속하는 대표적인 등푸른 생선 중 하나다. 세계적으로 널리 분포하며 치어 때는 플랑크톤을 먹고, 성어는 멸치 또는 작은 물고기를 주 먹이로 삼는다.",
      get requirementPoint() {
        return requiredPointToEvolve[("tier" + this.tierCode) as keyof RequiredPointToEvolve];
      }
    }
  ],
  [
    3,
    {
      speciesId: 3,
      name: "개복치",
      key: "sunfish",
      width: 192,
      height: 192,
      power: 10,
      health: 100,
      evolutionSet: new Set([5]),
      tierCode: 2,
      spritesheetUrl: "assets/sprites/Sunfish.png",
      baseSpriteUrl: "assets/sprites/base/Sunfish.png",
      frameStart: 0,
      frameEnd: 1,
      englishName: "Ocean sunfish",
      IUCNGrade: IUCN_GRADE.VU,
      info: "복어목 개복치과에 속하는 어류. 현생 경골어류 중 가장 큰 종이다. 쟁반형의 거대하고 넓은 몸에 몸의 끝쪽 위 아래로 뾰족한 지느러미가 돋아나 있는 재미있는 물고기이다. 그 외에도 꼬리지느러미가 달려있지만 돌출되어 있지는 않고, 배지느러미조차 없어서 얼핏 보면 물고기보다는 연에 가까운 모습을 하고 있다.",
      get requirementPoint() {
        return requiredPointToEvolve[("tier" + this.tierCode) as keyof RequiredPointToEvolve];
      }
    }
  ]
]);
