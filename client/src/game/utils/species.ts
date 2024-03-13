import type { Species } from "../types/species";

export const speciesMap: Map<number, Species> = new Map<number, Species>([
  [
    1,
    {
      speciesId: 1,
      name: "니모",
      key: "nemo",
      width: 200,
      height: 300,
      power: 10,
      health: 100,
      evolutionSet: new Set([3, 4]),
      tierCode: 1,
      spritesheetUrl: "assets/sprites/Nemo.png",
      shapesUrl: "assets/shapes/nemo-shapes.json"
    }
  ],
  [
    2,
    {
      speciesId: 2,
      name: "고등어",
      key: "mackerel",
      width: 200,
      height: 300,
      power: 10,
      health: 100,
      evolutionSet: new Set([3, 4]),
      tierCode: 1,
      spritesheetUrl: "assets/sprites/Mackerel.png",
      shapesUrl: "assets/shapes/mackerel-shapes.json"
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
      shapesUrl: "assets/shapes/sunfish-shapes.json"
    }
  ],
  [
    4,
    {
      speciesId: 4,
      name: "해마",
      key: "seahorse",
      width: 200,
      height: 300,
      power: 10,
      health: 100,
      evolutionSet: new Set([6]),
      tierCode: 2,
      spritesheetUrl: "assets/sprites/Nemo.png",
      shapesUrl: "assets/shapes/nemo-shapes.json"
    }
  ]
]);
