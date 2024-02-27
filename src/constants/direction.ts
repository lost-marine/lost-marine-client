const DIRECTION = {
    TOP: 0,
    TOP_RIGHT: 1,
    RIGHT: 2,
    DOWN_RIGHT: 3,
    DOWN: 4,
    DOWN_LEFT: 5,
    LEFT: 6,
    TOP_LEFT: 7,
} as const;

// 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
export type DIRECTION = (typeof DIRECTION)[keyof typeof DIRECTION];
