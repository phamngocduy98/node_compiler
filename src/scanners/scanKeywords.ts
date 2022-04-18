import {Terminal} from '../Grammar';
import {EOF, NextCharFunc, TempBuffer} from '../utils/fileUtils';
import {isSpace} from './is';
import {Token, TokenPosition} from './IToken';
import {scanID} from './scanId';

// "begin",
// "end",
// "while",
// "do",
// "int",
// "print",
export function scanKeyword(pos: TokenPosition, keyword: Terminal, nextChar: NextCharFunc) {
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
	if (c === EOF || isSpace(c)) {
		return new Token(pos.copy(), keyword);
	}
	return scanID(pos, nextChar, buff);
}
