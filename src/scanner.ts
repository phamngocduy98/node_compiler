import { EOF, readFileCharByChar, TempBuffer } from "./fileUtils";
import { isAlphabet, isNumber, isSpace } from "./scanners/is";
import { ScanResult } from "./scanners/IScanResult";
import { scanID } from "./scanners/scanId";
import { scanKeyword } from "./scanners/scanKeywords";
import { scanNumber } from "./scanners/scanNumber";

export async function scanner(fileName: string) {
  const nextChar = await readFileCharByChar(fileName);
  const result: ScanResult[] = [];
  let buff = new TempBuffer();
  let c;
  while ((c = nextChar(buff)) != EOF) {
    if (isSpace(c)) {
      buff.clear();
      continue;
    }
    if (c === "b") {
      // begin
      result.push(scanKeyword("begin", nextChar));
    } else if (c === "e") {
      // end
      result.push(scanKeyword("end", nextChar));
    } else if (c === "p") {
      // print
      result.push(scanKeyword("print", nextChar));
    } else if (c === "i") {
      // int
      result.push(scanKeyword("int", nextChar));
    } else if (c === "w") {
      // while
      result.push(scanKeyword("while", nextChar));
    } else if (c === "d") {
      // do
      result.push(scanKeyword("do", nextChar));
    } else if (isAlphabet(c)) {
      // ID
      result.push(scanID(nextChar, buff));
    } else if (isNumber(c)) {
      // NUMBER
      result.push(scanNumber(nextChar, buff.buffer));
    } else if (c === ";") {
      // SEMI-COLON
      result.push(new ScanResult("SEMI-COLON"));
    } else if (c === "=") {
      // EQUAL
      result.push(new ScanResult("EQUAL"));
    } else if (c === "-") {
      // MINUS
      result.push(new ScanResult("MINUS"));
    } else if (c === "*") {
      // STAR
      result.push(new ScanResult("STAR"));
    } else if (c === "^") {
      // MINUS
      result.push(new ScanResult("EXPONENT"));
    } else if (c === "(") {
      // LEFT-PARENTHESES
      result.push(new ScanResult("LEFT-PARENTHESES"));
    } else if (c === ")") {
      // RIGHT-PARENTHESES
      result.push(new ScanResult("RIGHT-PARENTHESES"));
    } else {
      throw Error(`Invalid syntax: Invalid character ${c}`);
    }
    buff.clear();
  }
  console.log(result.map((r) => r.toString()));
}
