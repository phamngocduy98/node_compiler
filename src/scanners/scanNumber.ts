import { EOF, NextCharFunc, TempBuffer } from "../fileUtils";
import { isNumber, isSpace } from "./is";
import { ScanResult } from "./IScanResult";

// firstChar should isNumber()
export function scanNumber(nextChar: NextCharFunc, firstChar: string) {
  let buff = new TempBuffer(firstChar);
  let c;
  if (firstChar === "0") {
    c = nextChar(buff);
    if (c === EOF || isSpace(c)) return new ScanResult("NUMBER", 0);
    throw Error(
      `Invalid syntax! No more character after 0 Near ${buff.buffer}`
    );
  } else {
    while ((c = nextChar(buff)) != EOF && !isSpace(c)) {
      if (!isNumber(c)) {
        throw Error(`Invalid syntax! Invalid ID Near ${buff.buffer}`);
      }
    }
    return new ScanResult("NUMBER", parseInt(buff.buffer));
  }
}
