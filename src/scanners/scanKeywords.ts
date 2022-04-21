import {Terminal} from '../Grammar';
import {EOF, NextCharFunc, TempBuffer} from '../utils/fileUtils';
import {isSpace, isSymbol} from './is';
import {Token, TokenPosition} from './IToken';
import {scanID} from './scanId';
import {scanSymbol} from './scanSymbol';

// "begin",
// "end",
// "while",
// "do",
// "int",
// "print",
export function scanKeyword(pos: TokenPosition, keyword: Terminal, nextChar: NextCharFunc): Token[] {
	// first char of keyword is already scanned => add to buff.
	const buff = new TempBuffer(keyword[0]);
	const kw = keyword.slice(1);
	let c;
	for (let kchar of kw) {
		// kchar: keyword char
		c = nextChar(buff); // c: input char
		pos.col++;
		if (c !== kchar) return scanID(pos, nextChar, buff);
	}
	c = nextChar(buff);
	pos.col++;
	const kwToken = new Token(pos.copy(), keyword);
	if (c === EOF || isSpace(c)) {
		return [kwToken];
	}
	if (isSymbol(c)) {
		// end;
		return [kwToken, scanSymbol(pos, c)];
	}
	return scanID(pos, nextChar, buff);
}
