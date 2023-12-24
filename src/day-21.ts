// ░░░░#░░░#░░░#░░░#░░░#░░░
// ░░#░░░#░░░#░░░#░░░#░░░#░
// ░░░░#░░░#░░░#░░░#░░░#░░░
// ░░▀█▀ █ █ █▀█ █▀▀ █▀▀ ░░
// ░░░█ ░▀█▀ █▀▀ █▀▀ ▀▀█ ░░
// ░░░▀ ░░▀  ▀ ░ ▀▀▀ ▀▀▀ ░░
// ░░░░#░░░#░░░#░░░#░░░#░░░
// ░░#░░░#░░░#░░░#░░░#░░░#░
// ░░░░#░░░#░░░#░░░#░░░#░░░
type Board = string[][];
type Game = { board: Board, state: string }

type TicTacToe<
  TGame extends Game,
  TStringPosition,
  $Position extends number[] = ParsePosition<TStringPosition>,
  $NextBoard extends Board = NextBoard<TGame, $Position>,
  $NextState = NextState<TGame, $Position, $NextBoard>
> = {
  board: $NextBoard,
  state: $NextState
}

type PositionMap = {
  'top': 0, 'middle': 1, 'bottom': 2,
  'left': 0, 'center': 1, 'right': 2
}

type ParsePosition<T> =
  T extends `${infer V extends keyof PositionMap}-${infer H extends keyof PositionMap}`
    ? [PositionMap[V], PositionMap[H]]
    : never

type NextBoard<
  TGame extends Game,
  TPosition,
  $Board = TGame["board"]
> = {
  [$Key in keyof $Board]:
    $Key extends `${infer $RowIndex extends number}`
      ? NextRow<TGame, TPosition, $RowIndex>
      : never
}

type NextRow<
  TGame extends Game,
  TPosition,
  TRowIndex extends number,
  $Row = TGame["board"][TRowIndex]
> = {
  [$Key in keyof $Row]:
    $Key extends `${infer $ColumnIndex extends number}`
      ? [TRowIndex, $ColumnIndex] extends TPosition
        ? $Row[$Key] extends "  "
          ? TGame["state"]
          : $Row[$Key]
        : $Row[$Key]
      : never
}

type NextState<
  TGame extends Game,
  TPosition extends number[],
  TNextBoard extends Board,
  $Player extends string = TGame["state"]
> =
  IsInvalid<TGame, TPosition, TNextBoard> extends true ? $Player :
  IsWin<TNextBoard, $Player> extends true ? `${$Player} Won` :
  IsDraw<TNextBoard> extends true ? `Draw` :
  $Player extends "❌" ? "⭕" : "❌";

type IsInvalid<TGame extends Game, TPosition extends number[], TBoard extends Board> =
  TGame["state"] extends TBoard[TPosition[0]][TPosition[1]] ? false : true;

type IsWin<TBoard extends Board, TPlayer, $Rows = Rows<TBoard>> =
  true extends ($Rows extends [TPlayer] ? true : never) ? true : false;

type Rows<TBoard extends Board, $Index = 0 | 1 | 2> =
  | [TBoard[0][0] | TBoard[1][1] | TBoard[2][2]]
  | [TBoard[0][2] | TBoard[1][1] | TBoard[2][0]]
  | (
    $Index extends number
      ? [TBoard[$Index][number]]
      | [TBoard[number][$Index]]
      : never
  )

type IsDraw<TBoard extends Board> = "  " extends TBoard[number][number] ? false : true;

// ░░░░#░░░#░░░#░░░#░░░#░░░
// ░░#░░░#░░░#░░░#░░░#░░░#░
// ░░░░#░░░#░░░#░░░#░░░#░░░
// ░░▀█▀ █▀▀ █▀▀ ▀█▀ █▀▀ ░░
// ░░░█ ░█▀▀ ▀▀█ ░█  ▀▀█ ░░
// ░░░▀ ░▀▀▀ ▀▀▀ ░▀  ▀▀▀ ░░
// ░░░░#░░░#░░░#░░░#░░░#░░░
// ░░#░░░#░░░#░░░#░░░#░░░#░
// ░░░░#░░░#░░░#░░░#░░░#░░░
import { Equal, Expect } from 'type-testing';

type EmptyBoard = [["  ", "  ", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];

type NewGame = { board: EmptyBoard; state: "❌" };

type test_move1_actual = TicTacToe<NewGame, 'top-center'>;
//   ^?
type test_move1_expected = {
  board: [
    [ '  ', '❌', '  ' ],
    [ '  ', '  ', '  ' ],
    [ '  ', '  ', '  ' ]
  ];
  state: '⭕';
};
type test_move1 = Expect<Equal<test_move1_actual, test_move1_expected>>;

type test_move2_actual = TicTacToe<test_move1_actual, 'top-left'>;
//   ^?
type test_move2_expected = {
  board: [
    ['⭕', '❌', '  '],
    ['  ', '  ', '  '],
    ['  ', '  ', '  ']];
  state: '❌';
}
type test_move2 = Expect<Equal<test_move2_actual, test_move2_expected>>;

type test_move3_actual = TicTacToe<test_move2_actual, 'middle-center'>;
//   ^?
type test_move3_expected = {
  board: [
    [ '⭕', '❌', '  ' ],
    [ '  ', '❌', '  ' ],
    [ '  ', '  ', '  ' ]
  ];
  state: '⭕';
};
type test_move3 = Expect<Equal<test_move3_actual, test_move3_expected>>;

type test_move4_actual = TicTacToe<test_move3_actual, 'bottom-left'>;
//   ^?
type test_move4_expected = {
  board: [
    [ '⭕', '❌', '  ' ],
    [ '  ', '❌', '  ' ],
    [ '⭕', '  ', '  ' ]
  ];
  state: '❌';
};
type test_move4 = Expect<Equal<test_move4_actual, test_move4_expected>>;


type test_x_win_actual = TicTacToe<test_move4_actual, 'bottom-center'>;
//   ^?
type test_x_win_expected = {
  board: [
    [ '⭕', '❌', '  ' ],
    [ '  ', '❌', '  ' ],
    [ '⭕', '❌', '  ' ]
  ];
  state: '❌ Won';
};
type test_x_win = Expect<Equal<test_x_win_actual, test_x_win_expected>>;

type type_move5_actual = TicTacToe<test_move4_actual, 'bottom-right'>;
//   ^?
type type_move5_expected = {
  board: [
    [ '⭕', '❌', '  ' ],
    [ '  ', '❌', '  ' ],
    [ '⭕', '  ', '❌' ]
  ];
  state: '⭕';
};
type test_move5 = Expect<Equal<type_move5_actual, type_move5_expected>>;

type test_o_win_actual = TicTacToe<type_move5_actual, 'middle-left'>;
//   ^?
type test_o_win_expected = {
  board: [
    [ '⭕', '❌', '  ' ],
    [ '⭕', '❌', '  ' ],
    [ '⭕', '  ', '❌' ]
  ];
  state: '⭕ Won';
};

// invalid move don't change the board and state
type test_invalid_actual = TicTacToe<test_move1_actual, 'top-center'>;
//   ^?
type test_invalid_expected = {
  board: [
    [ '  ', '❌', '  ' ],
    [ '  ', '  ', '  ' ],
    [ '  ', '  ', '  ' ]
  ];
  state: '⭕';
};
type test_invalid = Expect<Equal<test_invalid_actual, test_invalid_expected>>;

type test_before_draw = {
  board: [
    ['⭕', '❌', '⭕'],
    ['⭕', '❌', '❌'],
    ['❌', '⭕', '  ']];
  state: '⭕';
}
type test_draw_actual = TicTacToe<test_before_draw, 'bottom-right'>;
//   ^?
type test_draw_expected = {
  board: [
    ['⭕', '❌', '⭕'],
    ['⭕', '❌', '❌'],
    ['❌', '⭕', '⭕']];
  state: 'Draw';
}
type test_draw = Expect<Equal<test_draw_actual, test_draw_expected>>;
