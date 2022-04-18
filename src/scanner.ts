import {EOF, readFileCharByChar, TempBuffer} from './utils/fileUtils';
import {isAlphabet, isNumber, isSpace} from './scanners/is';
import {Token} from './scanners/IToken';
import {scanID} from './scanners/scanId';
import {scanKeyword} from './scanners/scanKeywords';
import {scanNumber} from './scanners/scanNumber';
import {Terminal} from './Grammar';

export async function scanner(fileName: string) {
	const nextChar = await readFileCharByChar(fileName);
	const result: Token[] = [];
	let buff = new TempBuffer();
	let c;
	while ((c = nextChar(buff)) != EOF) {
		if (isSpace(c)) {
			buff.clear();
			continue;
		}
		if (c === 'b') {
			// begin
			result.push(scanKeyword(Terminal.BEGIN, nextChar));
		} else if (c === 'e') {
			// end
			result.push(scanKeyword(Terminal.END, nextChar));
		} else if (c === 'p') {
			// print
			result.push(scanKeyword(Terminal.PRINT, nextChar));
		} else if (c === 'i') {
			// int
			result.push(scanKeyword(Terminal.INT, nextChar));
		} else if (c === 'w') {
			// while
			result.push(scanKeyword(Terminal.WHILE, nextChar));
		} else if (c === 'd') {
			// do
			result.push(scanKeyword(Terminal.DO, nextChar));
		} else if (isAlphabet(c)) {
			// ID
			result.push(scanID(nextChar, buff));
		} else if (isNumber(c)) {
			// NUMBER
			result.push(scanNumber(nextChar, buff.buffer));
		} else if (c === ';') {
			// SEMI-COLON
			result.push(new Token(Terminal.SEMI_COLON));
		} else if (c === '=') {
			// EQUAL
			result.push(new Token(Terminal.EQUAL));
		} else if (c === '-') {
			// MINUS
			result.push(new Token(Terminal.MINUS));
		} else if (c === '*') {
			// STAR
			result.push(new Token(Terminal.STAR));
		} else if (c === '^') {
			// MINUS
			result.push(new Token(Terminal.EXPONENT));
		} else if (c === '(') {
			// LEFT-PARENTHESES
			result.push(new Token(Terminal.LEFT_PARENTHESES));
		} else if (c === ')') {
			// RIGHT-PARENTHESES
			result.push(new Token(Terminal.RIGHT_PARENTHESES));
		} else {
			throw Error(`Invalid syntax: Invalid character ${c}`);
		}
		buff.clear();
	}

	return [...result, new Token(Terminal.EOF)];
}
