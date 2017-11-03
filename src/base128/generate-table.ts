import { ALPHABET } from "./constants";

let tbl = `
|pos|char|code|  |pos|char|code|  |pos|char|code|  |pos|char|code|
|---:|:---:|---:|---|---:|:---:|---:|---|---:|:---:|---:|---|---:|:---:|---:|
`;
for (let i = 0; i < ALPHABET.length / 4; i++) {
  tbl += `${row(i)} ${row(i + 32)} ${row(i + 64)} ${row(i + 96)}\n`;
}

function row(pos: number): string {
  const code = ALPHABET.charCodeAt(pos).toString(16).toUpperCase();
  const  char = ALPHABET.charAt(pos);
  return `|${pos}|**\`${char}\`**|0x${code}|`;
}
console.log(tbl);

// regex
let regexStr = "^[", startBlock = "", lastChar = "";
for (let i = 0; i < ALPHABET.length; i++) {
  const char = ALPHABET.charAt(i);
  if (startBlock === "") {
    startBlock = char;
    lastChar = char;
  } else if (lastChar.charCodeAt(0) + 1 < char.charCodeAt(0)) {
    //mark a block, start a new one
    regexStr += `${startBlock}-${lastChar}`;
    startBlock = char;
  } else if (i === ALPHABET.length - 1) {
    regexStr += `${startBlock}-${char}`;
  }
  lastChar = char;
}
regexStr += "]{2,}$";
console.log(regexStr);

if (ALPHABET.length != 128) throw new Error(`ALPHABET is wrong length: ${ALPHABET.length}`);