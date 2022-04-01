import { EOF, NextCharFunc, TempBuffer } from "../fileUtils";
import { isSpace } from "./is";
import { ScanResult } from "./IScanResult";
import { scanID } from "./scanId";

// "begin",
// "end",
// "while",
// "do",
// "int",
// "print",
export function scanKeyword(keyword: string, nextChar: NextCharFunc) {
  // first char of keyword is already scanned => add to buff.
  const buff = new TempBuffer(keyword[0]);
  const kw = keyword.slice(1);
  let c;
  for (let kchar of kw) {
    // kchar: keyword char
    c = nextChar(buff); // c: input char
    if (c !== kchar) return scanID(nextChar, buff);
  }
  c = nextChar(buff);
  if (c === EOF || isSpace(c)) {
    return new ScanResult(`KEYWORD.${keyword.toUpperCase()}`);
  }
  return scanID(nextChar, buff);
}
