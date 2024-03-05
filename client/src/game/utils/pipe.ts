export const pipe = (...actions: Array<() => any>): boolean => {
  try {
    for (const action of actions) {
      action();
    }
  } catch (e: unknown) {
    console.error(e);
    return false;
  }

  return true;
};
