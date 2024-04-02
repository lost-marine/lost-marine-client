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
    spritesheetUrl: "assets/items/Starfish.png",
    changeType: 0
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
    spritesheetUrl: "assets/items/Starfish.png",
    changeType: 0
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
    spritesheetUrl: "assets/items/Starfish.png",
    changeType: 0
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
    spritesheetUrl: "assets/items/Oyster_open.png",
    changeType: 1
  },
  {
    key: "oyster_close",
    itemId: 4,
    itemType: 2,
    isActive: false,
    centerX: 1790,
    centerY: 4300,
    width: 150,
    height: 120,
    spritesheetUrl: "assets/items/Oyster_close.png",
    changeType: 2
  },
  {
    key: "oyster_open",
    itemId: 5,
    itemType: 2,
    isActive: true,
    centerX: 4610,
    centerY: 6210,
    width: 150,
    height: 120,
    spritesheetUrl: "assets/items/Oyster_open.png",
    changeType: 1
  },
  {
    key: "oyster_close",
    itemId: 6,
    itemType: 2,
    isActive: false,
    centerX: 4610,
    centerY: 6210,
    width: 150,
    height: 120,
    spritesheetUrl: "assets/items/Oyster_close.png",
    changeType: 2
  },
  {
    key: "chest_open",
    itemId: 7,
    itemType: 3,
    isActive: true,
    centerX: 3090,
    centerY: 5450,
    width: 150,
    height: 120,
    spritesheetUrl: "assets/items/Chest_open.png",
    changeType: 1
  },
  {
    key: "chest_close",
    itemId: 8,
    itemType: 3,
    isActive: false,
    centerX: 3090,
    centerY: 5450,
    width: 150,
    height: 120,
    spritesheetUrl: "assets/items/Chest_close.png",
    changeType: 2
  }
];
