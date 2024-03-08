import enText from "@public/locales/en-US.json";
import koText from "@public/locales/ko-KR.json";
import g from "./global";

export const stringSet = {
  ko: koText,
  en: enText
};

export const setTextSet = (): void => {
  const userLanguages = navigator.languages[0];

  if (userLanguages === "ko-KR") {
    g.textSet = stringSet.ko;
  } else {
    g.textSet = stringSet.en;
  }
};

export const getText = (key: string): string => {
  if (key in g.textSet) {
    return g.textSet[key];
  } else {
    return "";
  }
};
