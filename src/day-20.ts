// ░░░░#░░░#░░░#░░░#░░░#░░░
// ░░#░░░#░░░#░░░#░░░#░░░#░
// ░░░░#░░░#░░░#░░░#░░░#░░░
// ░░▀█▀ █ █ █▀█ █▀▀ █▀▀ ░░
// ░░░█ ░▀█▀ █▀▀ █▀▀ ▀▀█ ░░
// ░░░▀ ░░▀  ▀ ░ ▀▀▀ ▀▀▀ ░░
// ░░░░#░░░#░░░#░░░#░░░#░░░
// ░░#░░░#░░░#░░░#░░░#░░░#░
// ░░░░#░░░#░░░#░░░#░░░#░░░
type Font = {
  A: [ '█▀█ ', '█▀█ ', '▀ ▀ ', ],
  B: [ '█▀▄ ', '█▀▄ ', '▀▀  ' ],
  C: [ '█▀▀ ', '█ ░░', '▀▀▀ ' ],
  E: [ '█▀▀ ', '█▀▀ ', '▀▀▀ ' ],
  H: [ '█ █ ', '█▀█ ', '▀ ▀ ' ],
  I: [ '█ ', '█ ', '▀ ' ],
  M: [ '█▄░▄█ ', '█ ▀ █ ', '▀ ░░▀ ' ],
  N: [ '█▄░█ ', '█ ▀█ ', '▀ ░▀ ' ],
  P: [ '█▀█ ', '█▀▀ ', '▀ ░░' ],
  R: [ '█▀█ ', '██▀ ', '▀ ▀ ' ],
  S: [ '█▀▀ ', '▀▀█ ', '▀▀▀ ' ],
  T: [ '▀█▀ ', '░█ ░', '░▀ ░' ],
  Y: [ '█ █ ', '▀█▀ ', '░▀ ░' ],
  W: [ '█ ░░█ ', '█▄▀▄█ ', '▀ ░ ▀ ' ],
  ' ': [ '░', '░', '░' ],
  ':': [ '#', '░', '#' ],
  '*': [ '░', '#', '░' ]
};

type FontHeight = Font[" "]["length"]

type ToAsciiArt<Text extends string> = RenderText<Uppercase<Text>>

type RenderText<Text, $Output extends string[] = []> =
  Text extends `${infer Line}\n${infer Tail}`
    ? RenderText<Tail, [...$Output, ...RenderLine<Line>]>
    : [...$Output, ...RenderLine<Text>]

type RenderLine<Line, $Output extends string[] = []> =
  $Output["length"] extends FontHeight
    ? $Output
    : RenderLine<Line, [...$Output, RenderRow<Line, $Output["length"]>]>

type RenderRow<Line, Index extends number, $Output extends string = ""> =
  Line extends `${infer Letter}${infer Tail}`
    ? RenderRow<Tail, Index, `${$Output}${RenderLetter<Letter, Index>}`>
    : $Output

type RenderLetter<Letter, Row extends number> =
  Letter extends keyof Font
    ? Font[Letter][Row]
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
import { Equal, Expect } from "type-testing";

type test_0_actual = ToAsciiArt<"   * : * Merry * : *   \n  Christmas  ">;
//   ^?
type test_0_expected = [
  "░░░░░#░░░█▄░▄█ █▀▀ █▀█ █▀█ █ █ ░░░#░░░░░",
  "░░░#░░░#░█ ▀ █ █▀▀ ██▀ ██▀ ▀█▀ ░#░░░#░░░",
  "░░░░░#░░░▀ ░░▀ ▀▀▀ ▀ ▀ ▀ ▀ ░▀ ░░░░#░░░░░",
  "░░█▀▀ █ █ █▀█ █ █▀▀ ▀█▀ █▄░▄█ █▀█ █▀▀ ░░",
  "░░█ ░░█▀█ ██▀ █ ▀▀█ ░█ ░█ ▀ █ █▀█ ▀▀█ ░░",
  "░░▀▀▀ ▀ ▀ ▀ ▀ ▀ ▀▀▀ ░▀ ░▀ ░░▀ ▀ ▀ ▀▀▀ ░░",
];
type test_0 = Expect<Equal<test_0_actual, test_0_expected>>;

type test_1_actual = ToAsciiArt<"  Happy new  \n  * : * : * Year * : * : *  ">;
//   ^?
type test_1_expected = [
        "░░█ █ █▀█ █▀█ █▀█ █ █ ░█▄░█ █▀▀ █ ░░█ ░░",
        "░░█▀█ █▀█ █▀▀ █▀▀ ▀█▀ ░█ ▀█ █▀▀ █▄▀▄█ ░░",
        "░░▀ ▀ ▀ ▀ ▀ ░░▀ ░░░▀ ░░▀ ░▀ ▀▀▀ ▀ ░ ▀ ░░",
        "░░░░#░░░#░░░█ █ █▀▀ █▀█ █▀█ ░░░#░░░#░░░░",
        "░░#░░░#░░░#░▀█▀ █▀▀ █▀█ ██▀ ░#░░░#░░░#░░",
        "░░░░#░░░#░░░░▀ ░▀▀▀ ▀ ▀ ▀ ▀ ░░░#░░░#░░░░",
];
type test_1 = Expect<Equal<test_1_actual, test_1_expected>>;

type test_2_actual = ToAsciiArt<"  * : * : * : * : * : * \n  Trash  \n  * : * : * : * : * : * ">;
//   ^?
type test_2_expected = [
  "░░░░#░░░#░░░#░░░#░░░#░░░",
  "░░#░░░#░░░#░░░#░░░#░░░#░",
  "░░░░#░░░#░░░#░░░#░░░#░░░",
  "░░▀█▀ █▀█ █▀█ █▀▀ █ █ ░░",
  "░░░█ ░██▀ █▀█ ▀▀█ █▀█ ░░",
  "░░░▀ ░▀ ▀ ▀ ▀ ▀▀▀ ▀ ▀ ░░",
  "░░░░#░░░#░░░#░░░#░░░#░░░",
  "░░#░░░#░░░#░░░#░░░#░░░#░",
  "░░░░#░░░#░░░#░░░#░░░#░░░",
];
type test_2 = Expect<Equal<test_2_actual, test_2_expected>>;

type test_3_actual = ToAsciiArt<"  : * : * : * : * : * : * : \n  Ecyrbe  \n  : * : * : * : * : * : * : ">;
//   ^?
type test_3_expected = [
  "░░#░░░#░░░#░░░#░░░#░░░#░░░#░",
  "░░░░#░░░#░░░#░░░#░░░#░░░#░░░",
  "░░#░░░#░░░#░░░#░░░#░░░#░░░#░",
  "░░█▀▀ █▀▀ █ █ █▀█ █▀▄ █▀▀ ░░",
  "░░█▀▀ █ ░░▀█▀ ██▀ █▀▄ █▀▀ ░░",
  "░░▀▀▀ ▀▀▀ ░▀ ░▀ ▀ ▀▀  ▀▀▀ ░░",
  "░░#░░░#░░░#░░░#░░░#░░░#░░░#░",
  "░░░░#░░░#░░░#░░░#░░░#░░░#░░░",
  "░░#░░░#░░░#░░░#░░░#░░░#░░░#░",
];
type test_3 = Expect<Equal<test_3_actual, test_3_expected>>;
