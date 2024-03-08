import { Queue } from "queue-typescript";
import type { Player } from "../types/player";
import type { BaseSocketObject } from "../types/socket";
import type { Plankton } from "../types/plankton";
import type { SceneType } from "../types/scene";
import { SCENE } from "../constants/scene";
import { stringSet } from "./getText";
import type { LocaleTextSet } from "../types/localeTexts";

type GlobalStore = {
  myInfo: null | Player;
  playerMap: Map<number, Player>;
  eventQueue: Queue<BaseSocketObject>;
  planktonMap: Map<number, Plankton>;
  currentScene: SceneType;
  textSet: LocaleTextSet;
};
const g: GlobalStore = {
  myInfo: null,
  playerMap: new Map<number, Player>(),
  eventQueue: new Queue<BaseSocketObject>(),
  planktonMap: new Map<number, Plankton>(),
  currentScene: SCENE.MAIN_MENU,
  textSet: stringSet.ko
};

export default g;
