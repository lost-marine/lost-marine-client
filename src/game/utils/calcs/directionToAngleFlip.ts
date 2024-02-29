import { DIRECTION } from "@/game/constants/direction";
import type { DirectionType } from "@/game/types/direction";

type directionToAngleFlipResult = {
  angle: number;
  shouldFlipX: boolean;
};

/**
 * 모든 플레이어를 렌더링 할 때 사용되는 단순 계산 함수입니다.
 *
 * 주어진 방향(0~7)에 따라 `캐릭터가 바라보는 각도`와 `캐릭터 좌우반전 필요 여부`를 반환합니다.
 */
export const directionToAngleFlip = (direction: DirectionType, isFlipX: boolean): directionToAngleFlipResult => {
  const result: directionToAngleFlipResult = {
    angle: 0,
    shouldFlipX: false
  };

  switch (direction) {
    case DIRECTION.TOP:
      result.angle = isFlipX ? 90 : -90;
      result.shouldFlipX = isFlipX;
      break;
    case DIRECTION.TOP_RIGHT:
      result.angle = -45;
      result.shouldFlipX = false;
      break;
    case DIRECTION.RIGHT:
      result.angle = 0;
      result.shouldFlipX = false;
      break;
    case DIRECTION.BOTTOM_RIGHT:
      result.angle = 45;
      result.shouldFlipX = false;
      break;
    case DIRECTION.BOTTOM:
      result.angle = isFlipX ? -90 : 90;
      result.shouldFlipX = isFlipX;
      break;
    case DIRECTION.BOTTOM_LEFT:
      result.angle = -45;
      result.shouldFlipX = true;
      break;
    case DIRECTION.LEFT:
      result.angle = 0;
      result.shouldFlipX = true;
      break;
    case DIRECTION.TOP_LEFT:
      result.angle = 45;
      result.shouldFlipX = true;
      break;
    default:
      break;
  }

  return result;
};
