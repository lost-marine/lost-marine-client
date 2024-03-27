import { type RequiredPointToEvolve, type Species, type SpeciesId } from "../types/species";

const IUCN_GRADE = {
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

const requiredPointToEvolve: RequiredPointToEvolve = {
  tier1: 5,
  tier2: 500,
  tier3: 1000,
  tier4: Number.POSITIVE_INFINITY
};

export const speciesMap: Map<SpeciesId, Species> = new Map<SpeciesId, Species>([
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
      evolutionList: [4, 5],
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
      evolutionList: [3, 5],
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
      name: "베타",
      key: "betta",
      width: 128,
      height: 128,
      power: 30,
      health: 110,
      evolutionList: [6, 9],
      tierCode: 2,
      spritesheetUrl: "assets/sprites/Betta.png",
      baseSpriteUrl: "assets/sprites/base/Betta.png",
      frameStart: 0,
      frameEnd: 1,
      englishName: "Betta Splendens",
      IUCNGrade: IUCN_GRADE.VU,
      info: "베타(Betta splendens)는 동남아시아가 원산지인 민물고기이다. 캄보디아, 라오스, 미얀마, 말레이시아, 인도네시아, 태국, 베트남 등에 서식한다. 베타속(genus Betta)에는 73종이 있지만 관상어로서 베타라고 불리는 종은 그 중에 단 1종만을 의미한다.",
      get requirementPoint() {
        return requiredPointToEvolve[("tier" + this.tierCode) as keyof RequiredPointToEvolve];
      }
    }
  ],
  [
    4,
    {
      speciesId: 4,
      name: "페넌트 코랄 피쉬",
      key: "pennant",
      width: 128,
      height: 128,
      power: 15,
      health: 160,
      evolutionList: [6, 7],
      tierCode: 2,
      spritesheetUrl: "assets/sprites/Pennant.png",
      baseSpriteUrl: "assets/sprites/base/Pennant.png",
      frameStart: 0,
      frameEnd: 1,
      englishName: "Pennant Coral Fish",
      IUCNGrade: IUCN_GRADE.LC,
      info: "긴지느러미 배너피쉬 혹은 마부라고도 불리운다. 체토돈티데과의 열대 물고기 중의 하나이다. 야생에서는 플랑크톤을 주로 먹지만 어항에서는 잡식성을 띈다.",
      get requirementPoint() {
        return requiredPointToEvolve[("tier" + this.tierCode) as keyof RequiredPointToEvolve];
      }
    }
  ],
  [
    5,
    {
      speciesId: 5,
      name: "아홀로틀",
      key: "axolotl",
      width: 128,
      height: 128,
      power: 20,
      health: 130,
      evolutionList: [7, 8],
      tierCode: 2,
      spritesheetUrl: "assets/sprites/Axolotl.png",
      baseSpriteUrl: "assets/sprites/base/Axolotl.png",
      frameStart: 0,
      frameEnd: 1,
      englishName: "Axolotl",
      IUCNGrade: IUCN_GRADE.CR,
      info: "멕시코가 원산지인 도롱뇽. 올챙이 시기를 유지한 채 성숙하는, 이른바 유형성숙의 대표적 사례로 유명하다. 대한민국에서는 '우파루파'라는 명칭으로도 잘 알려져있다.",
      get requirementPoint() {
        return requiredPointToEvolve[("tier" + this.tierCode) as keyof RequiredPointToEvolve];
      }
    }
  ],
  [
    6,
    {
      speciesId: 6,
      name: "푸른바다거북",
      key: "turtle",
      width: 192,
      height: 192,
      power: 40,
      health: 350,
      evolutionList: [11],
      tierCode: 3,
      spritesheetUrl: "assets/sprites/GreenSeaTurtle.png",
      baseSpriteUrl: "assets/sprites/base/GreenSeaTurtle.png",
      frameStart: 0,
      frameEnd: 1,
      englishName: "Green Sea Turtle",
      IUCNGrade: IUCN_GRADE.NE,
      info: "푸른바다거북은 다른 바다거북과 유사하게 최근 개체수가 급감하고 있어 IUCN에서는 Endangered A2bd, CITES와 CMS는 멸종위기종 1급으로 지정해 불법 포획 및 생태계 교란을 금지하며, 이외에도 많은 국제기구에서 이 종을 보호하기 위해 노력하고 있다.",
      get requirementPoint() {
        return requiredPointToEvolve[("tier" + this.tierCode) as keyof RequiredPointToEvolve];
      }
    }
  ],
  [
    7,
    {
      speciesId: 7,
      name: "개복치",
      key: "sunfish",
      width: 192,
      height: 192,
      power: 60,
      health: 200,
      evolutionList: [10, 11],
      tierCode: 3,
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
  ],
  [
    8,
    {
      speciesId: 8,
      name: "가오리",
      key: "stringray",
      width: 192,
      height: 192,
      power: 50,
      health: 300,
      evolutionList: [10],
      tierCode: 3,
      spritesheetUrl: "assets/sprites/Stringray.png",
      baseSpriteUrl: "assets/sprites/base/Stringray.png",
      frameStart: 0,
      frameEnd: 1,
      englishName: "Stringray",
      IUCNGrade: IUCN_GRADE.EN,
      info: "가오리는 가오리상목(Batoidea)에 속하는 연골어류의 총칭이다. 어린 개체는 간자미라 부른다. 전 세계에 350여 종이 분포하며 대부분이 바다 밑바닥에서 생활하나 매가오리나 쥐가오리 등의 일부 종은 헤엄치며 생활한다.",
      get requirementPoint() {
        return requiredPointToEvolve[("tier" + this.tierCode) as keyof RequiredPointToEvolve];
      }
    }
  ],
  [
    9,
    {
      speciesId: 9,
      name: "검자주복",
      key: "puffer",
      width: 192,
      height: 192,
      power: 70,
      health: 250,
      evolutionList: [11],
      tierCode: 3,
      spritesheetUrl: "assets/sprites/Puffer.png",
      baseSpriteUrl: "assets/sprites/base/Puffer.png",
      frameStart: 0,
      frameEnd: 1,
      englishName: "Chinese Puffer",
      IUCNGrade: IUCN_GRADE.CR,
      info: "살과 껍질에는 독이 없지만 난소와 간에는 치명적인 맹독이 있고 장에도 독이 있는데 서식 지역에 따라서 그 정도가 다른 것이 특징이다. 이건 검자주복 뿐만 아니라 대부분의 복어류에게 해당된다.서식지 파괴와 남획으로 인해 심각한 멸종위기에 처해 있는 종이기도 하다.",
      get requirementPoint() {
        return requiredPointToEvolve[("tier" + this.tierCode) as keyof RequiredPointToEvolve];
      }
    }
  ],
  [
    10,
    {
      speciesId: 10,
      name: "가리비귀상어",
      key: "shark",
      width: 288,
      height: 192,
      power: 90,
      health: 450,
      evolutionList: [],
      tierCode: 4,
      spritesheetUrl: "assets/sprites/WhaleShark.png",
      baseSpriteUrl: "assets/sprites/base/WhaleShark.png",
      frameStart: 0,
      frameEnd: 1,
      englishName: "Scalloped Hammerhead",
      IUCNGrade: IUCN_GRADE.EN,
      info: "가리비귀상어는 다른 귀상어과의 상어들과 마찬가지로 망치 모양의 머리를 가진 것이 특징이다.가리비귀상어는 학교의 넓은 군영을 이루어 집단 생활을 하는 어종 중에 하나이며 밤, 낮, 아침에 모두 거대한 무리를 지은 가리비귀상어의 모습을 관찰할 수가 있다.",
      get requirementPoint() {
        return requiredPointToEvolve[("tier" + this.tierCode) as keyof RequiredPointToEvolve];
      }
    }
  ],
  [
    11,
    {
      speciesId: 11,
      name: "대왕고래",
      key: "whale",
      width: 288,
      height: 192,
      power: 70,
      health: 600,
      evolutionList: [],
      tierCode: 4,
      spritesheetUrl: "assets/sprites/BlueWhale.png",
      baseSpriteUrl: "assets/sprites/base/BlueWhale.png",
      frameStart: 0,
      frameEnd: 1,
      englishName: "Blue Whale",
      IUCNGrade: IUCN_GRADE.EN,
      info: "고래는 수천만 년 동안 몸속의 이산화탄소(CO2) 저장 체계를 통해 지구를 지켜 왔다. 고래 한 마리는 평생 CO2 약 33t을 축적하는데 이는 나무 한 그루가 1년간 CO2 약 22kg을 흡수하는 것과 비교했을 때 어마어마한 양이다. 고래를 비롯한 해양 생태계를 보호하기 위해서는 여러분의 관심이 필요하다.",
      get requirementPoint() {
        return requiredPointToEvolve[("tier" + this.tierCode) as keyof RequiredPointToEvolve];
      }
    }
  ]
]);
