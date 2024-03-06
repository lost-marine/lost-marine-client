import type { Creature } from "./creature";

export type Plankton = {
  width: number;
  height: number;
  planktonId: number;
  // health: number;
  // type: number;
  // power: number;
  // status: number;
} & Creature;
