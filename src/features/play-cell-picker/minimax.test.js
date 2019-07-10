import {
  checkGameState,
  checkGameCrossFromTopRightState,
  checkGameCrossFromTopLeftState,
  checkGameColState,
  checkGameRowState,
  WIN_GAME,
  LOSE_GAME
} from "./minimax";

describe("Minimax test", () => {
  it("checkGameColState", () => {
    const result = checkGameColState(
      [[-1, 1, -1], [-1, 1, -1], [-1, 1, -1]],
      0,
      1,
      1
    );
    expect(result).toBe(WIN_GAME);
  });

  it("checkGameCrossFromTopRightState", () => {
    const result = checkGameCrossFromTopRightState(
      [[1, -1, 1], [-1, 1, 0], [1, -1, -1]],
      0,
      2,
      1
    );
    expect(result).toBe(WIN_GAME);
  });
});
