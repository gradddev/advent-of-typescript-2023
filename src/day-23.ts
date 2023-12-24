// ░░░░#░░░#░░░#░░░#░░░#░░░
// ░░#░░░#░░░#░░░#░░░#░░░#░
// ░░░░#░░░#░░░#░░░#░░░#░░░
// ░░▀█▀ █ █ █▀█ █▀▀ █▀▀ ░░
// ░░░█ ░▀█▀ █▀▀ █▀▀ ▀▀█ ░░
// ░░░▀ ░░▀  ▀ ░ ▀▀▀ ▀▀▀ ░░
// ░░░░#░░░#░░░#░░░#░░░#░░░
// ░░#░░░#░░░#░░░#░░░#░░░#░
// ░░░░#░░░#░░░#░░░#░░░#░░░
type Game = { board: Board, state: string }
type Board = [Row, Row, Row, Row, Row, Row]
type Row   = [Cell, Cell, Cell, Cell, Cell, Cell, Cell]
type Cell  = string

type Connect4<
  TGame extends Game,
  TColumn extends number,
  $NextBoard extends Board = DropChip<TGame["board"], TGame["state"], TColumn>
> = {
  board: $NextBoard,
  state: NextState<$NextBoard, TGame["state"]>
}

type BlockRow = [Cell, Cell, Cell, Cell]
type Block = [BlockRow, BlockRow, BlockRow, BlockRow]

type NextState<TNextBoard extends Board, TChip extends string> =
  IsDraw<TNextBoard> extends true ? `Draw` :
  IsWinning<TNextBoard, TChip> extends true ? `${TChip} Won` :
  TChip extends "🟡" ? "🔴" : "🟡"

type IsDraw<TBoard extends Board> =
  "  " extends TBoard[number][number] ? false : true

type IsWinning<
  TBoard extends Board,
  TChip,
  $OffsetRows extends Row[] = [],
  $OffsetColumn extends Cell[] = []
> =
  TBoard extends [
    ...$OffsetRows,
    [...$OffsetColumn, ...infer $Row0 extends BlockRow, ...Cell[]],
    [...$OffsetColumn, ...infer $Row1 extends BlockRow, ...Cell[]],
    [...$OffsetColumn, ...infer $Row2 extends BlockRow, ...Cell[]],
    [...$OffsetColumn, ...infer $Row3 extends BlockRow, ...Cell[]],
    ...Row[]
  ]
    ? IsWinningBlock<[$Row0, $Row1, $Row2, $Row3], TChip> extends true ? true :
      $OffsetColumn["length"] extends 3
        ? IsWinning<TBoard, TChip, [...$OffsetRows, Row], []>
        : IsWinning<TBoard, TChip, $OffsetRows, [...$OffsetColumn, Cell]>
    : false

type IsWinningBlock<TBlock extends Block, TChip> = true extends (
  | HasWinningRows<TBlock, TChip>
  | HasWinningColumns<TBlock, TChip>
  | HasWinningDiagonals<TBlock, TChip>
) ? true : false

type HasWinningRows<TBlock extends Block, TChip, $RowIndex = 0 | 1 | 2 | 3> =
  $RowIndex extends number
    ? IsWinningUnion<TBlock[$RowIndex][number], TChip>
    : never

type HasWinningColumns<TBlock extends Block, TChip, $ColumnIndex = 0 | 1 | 2 | 3> =
  $ColumnIndex extends number
    ? IsWinningUnion<TBlock[number][$ColumnIndex], TChip>
    : never

type HasWinningDiagonals<TBlock extends Block, TChip, > =
  | IsWinningUnion<TBlock[0][0] | TBlock[1][1] | TBlock[2][2] | TBlock[3][3], TChip>
  | IsWinningUnion<TBlock[3][0] | TBlock[2][1] | TBlock[1][2] | TBlock[0][3], TChip>

type IsWinningUnion<TUnion, TChip> =
  Exclude<TUnion, TChip> extends never ? true : false

type DropChip<TBoard, TChip, TColumn extends number, $RestRows extends string[][] = []> =
  TBoard extends [...infer Rows, infer LastRow extends string[]]
  ? LastRow[TColumn] extends "  "
    ? [...Rows, ReplaceChip<LastRow, TChip, TColumn>, ...$RestRows]
    : DropChip<[...Rows], TChip, TColumn, [LastRow, ...$RestRows]>
  : never

type ReplaceChip<TRow, TChip, TColumn, $RestChips extends string[] = []> =
  TRow extends [...infer Chips, infer LastChip extends string]
    ? Chips["length"] extends TColumn
      ? [...Chips, TChip, ...$RestChips]
      : ReplaceChip<Chips, TChip, TColumn, [LastChip, ...$RestChips]>
    : never

// ░░░░#░░░#░░░#░░░#░░░#░░░
// ░░#░░░#░░░#░░░#░░░#░░░#░
// ░░░░#░░░#░░░#░░░#░░░#░░░
// ░░▀█▀ █▀▀ █▀▀ ▀█▀ █▀▀ ░░
// ░░░█ ░█▀▀ ▀▀█ ░█  ▀▀█ ░░
// ░░░▀ ░▀▀▀ ▀▀▀ ░▀  ▀▀▀ ░░
// ░░░░#░░░#░░░#░░░#░░░#░░░
// ░░#░░░#░░░#░░░#░░░#░░░#░
// ░░░░#░░░#░░░#░░░#░░░#░░░
import { Expect, Equal } from "type-testing";

type EmptyBoard = [
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "]
];

type NewGame = { board: EmptyBoard, state: "🟡" };

type test_move1_actual = Connect4<NewGame, 0>;
//   ^?
type test_move1_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
  ];
  state: "🔴";
};
type test_move1 = Expect<Equal<test_move1_actual, test_move1_expected>>;

type test_move2_actual = Connect4<test_move1_actual, 0>;
//   ^?
type test_move2_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
  ];
  state: "🟡";
};
type test_move2 = Expect<Equal<test_move2_actual, test_move2_expected>>;

type test_move3_actual = Connect4<test_move2_actual, 0>;
//   ^?
type test_move3_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
  ];
  state: "🔴";
};
type test_move3 = Expect<Equal<test_move3_actual, test_move3_expected>>;

type test_move4_actual = Connect4<test_move3_actual, 1>;
//   ^?
type test_move4_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "🔴", "  ", "  ", "  ", "  ", "  "],
  ];
  state: "🟡";
};
type test_move4 = Expect<Equal<test_move4_actual, test_move4_expected>>;

type test_move5_actual = Connect4<test_move4_actual, 2>;
//   ^?
type test_move5_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "🔴", "🟡", "  ", "  ", "  ", "  "],
  ];
  state: "🔴";
};
type test_move5 = Expect<Equal<test_move5_actual, test_move5_expected>>;

type test_move6_actual = Connect4<test_move5_actual, 1>;
//   ^?
type test_move6_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "🔴", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "🔴", "🟡", "  ", "  ", "  ", "  "],
  ];
  state: "🟡";
};
type test_move6 = Expect<Equal<test_move6_actual, test_move6_expected>>;

type test_red_win_actual = Connect4<
  {
    board: [
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
      ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
      ['🔴', '🔴', '🔴', '  ', '  ', '  ', '  '],
      ['🟡', '🔴', '🟡', '🟡', '  ', '  ', '  ']
    ];
    state: '🔴';
  },
  3
>;

type test_red_win_expected = {
  board: [
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🔴', '🔴', '🔴', '🔴', '  ', '  ', '  '],
    ['🟡', '🔴', '🟡', '🟡', '  ', '  ', '  ']
  ];
  state: '🔴 Won';
};

type test_red_win = Expect<Equal<test_red_win_actual, test_red_win_expected>>;

type test_yellow_win_actual = Connect4<
  {
    board: [
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['🔴', '  ', '  ', '  ', '  ', '  ', '  '],
      ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
      ['🔴', '  ', '🔴', '🔴', '  ', '  ', '  '],
      ['🟡', '  ', '🟡', '🟡', '  ', '  ', '  ']
    ];
    state: '🟡';
  },
  1
>;

type test_yellow_win_expected = {
  board: [
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🔴', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🔴', '  ', '🔴', '🔴', '  ', '  ', '  '],
    ['🟡', '🟡', '🟡', '🟡', '  ', '  ', '  ']
  ];
  state: '🟡 Won';
};

type test_yellow_win = Expect<
  Equal<test_yellow_win_actual, test_yellow_win_expected>
>;

type test_diagonal_yellow_win_actual = Connect4<
  {
    board: [
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['  ', '  ', '🟡', '🔴', '  ', '  ', '  '],
      ['🔴', '🟡', '🔴', '🔴', '  ', '  ', '  '],
      ['🟡', '🔴', '🟡', '🟡', '  ', '  ', '  ']
    ];
    state: '🟡';
  },
  3
>;

type test_diagonal_yellow_win_expected = {
  board: [
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '🟡', '  ', '  ', '  '],
    ['  ', '  ', '🟡', '🔴', '  ', '  ', '  '],
    ['🔴', '🟡', '🔴', '🔴', '  ', '  ', '  '],
    ['🟡', '🔴', '🟡', '🟡', '  ', '  ', '  ']
  ];
  state: '🟡 Won';
};

type test_diagonal_yellow_win = Expect<
  Equal<test_diagonal_yellow_win_actual, test_diagonal_yellow_win_expected>
>;

type test_draw_actual = Connect4<
  {
    board: [
      ['🟡', '🔴', '🔴', '🟡', '🟡', '🔴', '  '],
      ['🔴', '🟡', '🟡', '🔴', '🔴', '🟡', '🔴'],
      ['🟡', '🔴', '🔴', '🟡', '🟡', '🔴', '🟡'],
      ['🔴', '🟡', '🟡', '🔴', '🔴', '🟡', '🔴'],
      ['🟡', '🔴', '🔴', '🟡', '🟡', '🔴', '🟡'],
      ['🔴', '🟡', '🟡', '🔴', '🔴', '🟡', '🔴']
    ];
    state: '🟡';
  },
  6
>;

type test_draw_expected = {
  board: [
    ['🟡', '🔴', '🔴', '🟡', '🟡', '🔴', '🟡'],
    ['🔴', '🟡', '🟡', '🔴', '🔴', '🟡', '🔴'],
    ['🟡', '🔴', '🔴', '🟡', '🟡', '🔴', '🟡'],
    ['🔴', '🟡', '🟡', '🔴', '🔴', '🟡', '🔴'],
    ['🟡', '🔴', '🔴', '🟡', '🟡', '🔴', '🟡'],
    ['🔴', '🟡', '🟡', '🔴', '🔴', '🟡', '🔴']
  ];
  state: 'Draw';
};

type test_draw = Expect<Equal<test_draw_actual, test_draw_expected>>;