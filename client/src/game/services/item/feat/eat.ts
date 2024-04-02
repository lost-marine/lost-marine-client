import g from "@/game/utils/global";
import type { ItemInfo } from "../../player/types/item";

type ItemEatService = {
  itemEat: (itemId: number) => void;
  itemSync: (itemId: ItemInfo) => void;
};
const itemEatService: ItemEatService = {
  itemEat: (itemId: number) => {
    g.eventQueue.append({
      key: "item-eat",
      data: itemId
    });
  },
  itemSync: (itemInfo: ItemInfo) => {
    g.eventQueue.append({
      key: "item-sync",
      data: itemInfo
    });
  }
};

export default itemEatService;
