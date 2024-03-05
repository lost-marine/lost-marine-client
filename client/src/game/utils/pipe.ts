/**
 * 비동기 함수가 아닌 함수들의 실행 순서를 보장해주는 함수입니다.
 * @param actions 비동기 함수가 아닌 동작들
 * @returns
 */
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
