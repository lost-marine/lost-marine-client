import { DIRECTION, DIRECTION_X, DIRECTION_Y } from "@/game/constants/direction";
import type { AxisDirectionType, DirectionType } from "@/game/types/direction";

type getDirectionResult = {
  direction: DirectionType;
  directionX: AxisDirectionType;
  directionY: AxisDirectionType;
};

/**
 * 나의 direction을 구하는 함수입니다.
 * 현재 이동중이지 않을 때에는 `isFlipX`를 이용하여 계산됩니다.
 * cursor가 입력된 값에 따라 direction(0~7)을 반환합니다.
 * @param isFlipX
 * @param cursors
 * @direction =s
 */
export const getDirection = (isFlipX: boolean, cursors: Phaser.Types.Input.Keyboard.CursorKeys): getDirectionResult => {
  let direction: DirectionType = DIRECTION.RIGHT;
  let directionX: AxisDirectionType = -1;
  let directionY: AxisDirectionType = -1;

  // x축 방향을 계산합니다.
  if (cursors.left.isDown == cursors.right.isDown) {
    // 왼쪽 키와 오른쪽 키를 같이 눌렀거나, 둘다 누르지 않았을 경우에는 X축 움직임이 없음.
    directionX = DIRECTION_X.NONE;
  } else if (cursors.left.isDown) {
    directionX = DIRECTION_X.LEFT;
  } else {
    directionX = DIRECTION_X.RIGHT;
  }

  // y축 방향을 계산합니다.
  if (cursors.down.isDown == cursors.up.isDown) {
    // 위쪽 키와 아래쪽 키를 같이 눌렀거나, 둘다 누르지 않았을 경우에는 y축 움직임이 없음.
    directionY = DIRECTION_Y.NONE;
  } else if (cursors.down.isDown) {
    directionY = DIRECTION_Y.DOWN;
  } else {
    directionY = DIRECTION_Y.UP;
  }

  // 최종적으로 directionX와 directionY를 이용하여 direction을 판별합니다.

  switch (directionX) {
    case DIRECTION_X.NONE:
      switch (directionY) {
        case DIRECTION_Y.NONE:
          // x축과 y축 방향 모두 없을 경우에는 기존 방향을 따라갑니다.
          if (isFlipX) {
            direction = DIRECTION.LEFT;
            break;
          } else {
            direction = DIRECTION.RIGHT;
            break;
          }
        case DIRECTION_Y.DOWN:
          direction = DIRECTION.BOTTOM;
          break;
        case DIRECTION_Y.UP:
          direction = DIRECTION.TOP;
          break;
      }
      break;
    case DIRECTION_X.LEFT:
      // x축이 왼쪽일 경우
      switch (directionY) {
        case DIRECTION_Y.NONE:
          direction = DIRECTION.LEFT;
          break;
        case DIRECTION_Y.DOWN:
          direction = DIRECTION.BOTTOM_LEFT;
          break;
        case DIRECTION_Y.UP:
          direction = DIRECTION.TOP_LEFT;
          break;
      }
      break;
    case DIRECTION_X.RIGHT:
      // x축이 오쪽일 경우
      switch (directionY) {
        case DIRECTION_Y.NONE:
          direction = DIRECTION.RIGHT;
          break;
        case DIRECTION_Y.DOWN:
          direction = DIRECTION.BOTTOM_RIGHT;
          break;
        case DIRECTION_Y.UP:
          direction = DIRECTION.TOP_RIGHT;
          break;
      }
  }
  return {
    direction,
    directionX,
    directionY
  };
};
