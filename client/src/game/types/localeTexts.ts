import type { stringSet } from "../utils/getText";

export type LocaleTextSet = {
  [K in keyof (typeof stringSet)["ko"]]: string;
};
