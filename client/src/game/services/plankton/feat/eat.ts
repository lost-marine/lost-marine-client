import g from "@/game/utils/global";

export const onTriggerPlanktonEat = (planktonId: any): void => {
  g.eventQueue.append({
    key: "plankton-eat",
    data: planktonId
  });
};
