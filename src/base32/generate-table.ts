import {CHECK_EXTRAS, SYMBOLS} from "./constants";
import {DECODE_ALIASES} from "./decode";
import {toCharCode} from "../shared";

// creates a Markdown table of the symbols, plus the checksum addendum
let tbl = `
### Symbol Table
|pos|char|code|  |pos|char|code|
|---:|---|---|---|---:|---|---|
`;
for (let i = 0; i < SYMBOLS.length / 2; i++) {
  const cols = [];
  for (let c = i; c <= i + 16; c += 16) {
    let chars = SYMBOLS.charAt(c);
    const aliases = DECODE_ALIASES[chars];
    if (aliases) {
      chars += aliases.join("");
    } else {
      chars = appendUpperChar(chars);
    }
    cols.push(cell(c, chars));
  }
  tbl += `${cols[0]} ${cols[1]}\n`;
}

console.log(tbl);


tbl = `### Checksum Addedum
|pos|char|code|
|---:|---|---|
`;
Array.from(CHECK_EXTRAS).forEach((char, i) => {
  const chars = appendUpperChar(char);
  tbl += cell(i + 32, chars) + "\n";
});

console.log(tbl);


function cell(pos: number, chars: string): string {
  const codes = Array.from(chars).map(char => "0x" + toCharCode(char).toString(16).toUpperCase());
  let charStr = chars.charAt(0);
  if (codes.length > 1) {
    const aliases = Array.from(chars.substr(1));
    charStr += `[${aliases.join(",")}]`;
  }
  return `|${pos}|**\`${charStr}\`**|${codes.join(", ")}|`;
}

function appendUpperChar(chars: string): string {
  const upper = chars.toUpperCase();
  if (upper != chars) {
    chars += upper;
  }
  return chars;
};
