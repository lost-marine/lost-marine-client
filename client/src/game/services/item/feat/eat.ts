import g from "@/game/utils/global";

export const onTriggerItemEat = (itemId: any): void => {
  g.eventQueue.append({
    key: "item-eat",
    data: itemId
  });
};
