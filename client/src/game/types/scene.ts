import type { SCENE } from "../constants/scene";

export type SceneType = (typeof SCENE)[keyof typeof SCENE];
