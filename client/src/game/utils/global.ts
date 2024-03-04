import type { Creature } from "../types";

type GlobalStore = {
  userInfo: null | Creature;
};
const global: GlobalStore = {
  userInfo: null
};

export default global;
