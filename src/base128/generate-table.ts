import {toCharCode, SYMBOLS, TERMINATOR} from "./constants";

// creates a Markdown table of the symbols, plus the regexp
let tbl = `
|pos|char|code|  |pos|char|code|  |pos|char|code|  |pos|char|code|
|---:|:---:|---:|---|---:|:---:|---:|---|---:|:---:|---:|---|---:|:---:|---:|
`;
for (let i = 0; i < SYMBOLS.length / 4; i++) {
  tbl += `${row(i)} ${row(i + 32)} ${row(i + 64)} ${row(i + 96)}\n`;
}

function row(pos: number): string {
  const code = SYMBOLS.charCodeAt(pos).toString(16).toUpperCase();
  const  char = SYMBOLS.charAt(pos);
  return `|${pos}|**\`${char}\`**|0x${code}|`;
}
console.log(tbl);

// regex
let regexStr = "^[", startBlock = "", lastChar = "";
for (let i = 0; i < SYMBOLS.length; i++) {
  const char = SYMBOLS.charAt(i);
  if (startBlock === "") {
    startBlock = char;
    lastChar = char;
  } else if (toCharCode(lastChar) + 1 < toCharCode(char)) {
    //mark a block, start a new one
    regexStr += `${startBlock}-${lastChar}`;
    startBlock = char;
  } else if (i === SYMBOLS.length - 1) {
    regexStr += `${startBlock}-${char}`;
  }
  lastChar = char;
}
regexStr += "]{2,}" + TERMINATOR + "$";
console.log(regexStr);

if (SYMBOLS.length != 128) throw new Error(`SYMBOLS is wrong length: ${SYMBOLS.length}`);