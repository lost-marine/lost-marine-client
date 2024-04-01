import type { Item } from "../types/item";

export const itemList: Item[] = [
  {
    key: "starfish",
    itemId: 0,
    itemType: 1,
    isActive: true,
    centerX: 5820,
    centerY: 1380,
    width: 75,
    height: 72,
    spritesheetUrl: "assets/items/Starfish.png"
  },
  {
    key: "starfish",
    itemId: 1,
    itemType: 1,
    isActive: true,
    centerX: 1850,
    centerY: 3430,
    width: 75,
    height: 72,
    spritesheetUrl: "assets/items/Starfish.png"
  },
  {
    key: "starfish",
    itemId: 2,
    itemType: 1,
    isActive: true,
    centerX: 6200,
    centerY: 5220,
    width: 75,
    height: 72,
    spritesheetUrl: "assets/items/Starfish.png"
  },
  {
    key: "oyster_open",
    itemId: 3,
    itemType: 2,
    isActive: true,
    centerX: 1790,
    centerY: 4300,
    width: 150,
    height: 120,
    spritesheetUrl: "assets/items/Oyster_open.png"
  },
  {
    key: "oyster_close",
    itemId: 4,
    itemType: 3,
    isActive: false,
    centerX: 1790,
    centerY: 4300,
    width: 150,
    height: 120,
    spritesheetUrl: "assets/items/Oyster_close.png"
  },
  {
    key: "chest_open",
    itemId: 5,
    itemType: 4,
    isActive: true,
    centerX: 3090,
    centerY: 5450,
    width: 150,
    height: 120,
    spritesheetUrl: "assets/items/Chest_open.png"
  },
  {
    key: "chest_close",
    itemId: 6,
    itemType: 5,
    isActive: false,
    centerX: 3090,
    centerY: 5450,
    width: 150,
    height: 120,
    spritesheetUrl: "assets/items/Chest_close.png"
  }
];
