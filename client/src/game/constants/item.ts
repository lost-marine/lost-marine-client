import type { Item } from "../types/item";

export const ITEM_STATUS = {
  STATIC: 0,
  OPEN: 1,
  CLOSE: 2
} as const;

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
    changeType: ITEM_STATUS.STATIC
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
    changeType: ITEM_STATUS.STATIC
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
    changeType: ITEM_STATUS.STATIC
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
    changeType: ITEM_STATUS.OPEN
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
    changeType: ITEM_STATUS.CLOSE
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
    changeType: ITEM_STATUS.OPEN
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
    changeType: ITEM_STATUS.CLOSE
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
    changeType: ITEM_STATUS.OPEN
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
    changeType: ITEM_STATUS.CLOSE
  }
];
