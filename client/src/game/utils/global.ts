import { Queue } from "queue-typescript";
import type { Player } from "../types/player";
import type { BaseSocketObject } from "../types/socket";
import type { Plankton } from "../types/plankton";
import type { SceneType } from "../types/scene";
import { SCENE } from "../constants/scene";
import { ref, type Ref } from "vue";
import type { Chat, SystemChat } from "../types/chat";
import type { GameOverResponse } from "../services/player/types/quit";
import type { Dash } from "../types/dash";

type GlobalStore = {
  myInfo: null | Player;
  playerMap: Map<number, Player>;
  eventQueue: Queue<BaseSocketObject>;
  planktonMap: Map<number, Plankton>;
  currentScene: SceneType;
  chatList: Ref<Array<Chat | SystemChat>>;
  chatInputFocused: boolean;
  dashInfo: Dash;
  gameOverResult: GameOverResponse | null;
  clear: () => void;
};
const g: GlobalStore = {
  myInfo: null,
  playerMap: new Map<number, Player>(),
  eventQueue: new Queue<BaseSocketObject>(),
  planktonMap: new Map<number, Plankton>(),
  currentScene: SCENE.MAIN_MENU,
  chatList: ref<Chat[]>([]),
  chatInputFocused: false,
  dashInfo: {
    delayTime: 5,
    durationTime: 0.3,
    dashing: false,
    dashable: true,
    speedUpMultiple: 2.5
  },
  gameOverResult: null,
  clear: () => {
    g.playerMap.clear();
    g.eventQueue = new Queue<BaseSocketObject>();
    g.planktonMap.clear();
  }
};

export default g;
