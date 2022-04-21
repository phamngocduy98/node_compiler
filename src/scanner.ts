import {EOF, readFileCharByChar, TempBuffer} from './utils/fileUtils';
import {isAlphabet, isEOF, isNumber, isSpace, isSymbol} from './scanners/is';
import {Token, TokenPosition} from './scanners/IToken';
import {scanID} from './scanners/scanId';
import {scanKeyword} from './scanners/scanKeywords';
import {scanNumber} from './scanners/scanNumber';
import {Terminal} from './Grammar';
import {scanSymbol} from './scanners/scanSymbol';

export async function scanner(fileName: string) {
	const nextChar = await readFileCharByChar(fileName);
	const result: Token[] = [];
	let buff = new TempBuffer();
	let c;
	let pos = new TokenPosition(1, 0);
	let lastC: string = '';
	while ((c = nextChar(buff)) != EOF) {
		pos.col++;
		// console.log('pos', pos, 'char', c == '\n' || c == '\r', c);
		if (isSpace(c)) {
			if (isEOF(c)) {
				if (!isEOF(lastC)) pos.line++;
				pos.col = 0;
			}
			lastC = c;
			buff.clear();
			continue;
		}
		if (c === 'b') {
			// begin
			result.push(...scanKeyword(pos, Terminal.BEGIN, nextChar));
		} else if (c === 'e') {
			// end
			result.push(...scanKeyword(pos, Terminal.END, nextChar));
		} else if (c === 'p') {
			// print
			result.push(...scanKeyword(pos, Terminal.PRINT, nextChar));
		} else if (c === 'i') {
			// int
			result.push(...scanKeyword(pos, Terminal.INT, nextChar));
		} else if (c === 'w') {
			// while
			result.push(...scanKeyword(pos, Terminal.WHILE, nextChar));
		} else if (c === 'd') {
			// do
			result.push(...scanKeyword(pos, Terminal.DO, nextChar));
		} else if (isAlphabet(c)) {
			// ID
			result.push(...scanID(pos, nextChar, buff));
		} else if (isNumber(c)) {
			// NUMBER
			result.push(...scanNumber(pos, nextChar, buff.buffer));
		} else if (c === ';') {
			// SEMI-COLON
			const _pos = pos.copy();
			_pos.col++;
			result.push(new Token(_pos, Terminal.SEMI_COLON));
		} else if (isSymbol(c)) {
			result.push(scanSymbol(pos, c));
		} else {
			throw Error(`Invalid syntax: Invalid character ${c}`);
		}
		buff.clear();
	}
	pos.col++;
	return [...result, new Token(pos.copy(), Terminal.EOF)];
}
