import {Terminal} from '../Grammar';
import {EOF, nextCharBuff, NextCharFunc, TempBuffer} from '../utils/fileUtils';
import {isAlphabet, isNumber, isSpace} from './is';
import {Token} from './IToken';

export function scanID(nextChar: NextCharFunc, _buff?: TempBuffer) {
	const _nextChar = nextCharBuff(nextChar, _buff);
	let buff = new TempBuffer();
	let c;
	while ((c = _nextChar(buff)) != EOF && !isSpace(c)) {
		// console.log("c = ", c);
		if (!isNumber(c) && !isAlphabet(c)) {
			throw Error(`Invalid ID syntax! Near ${buff.buffer}`);
		}
	}
	return new Token(Terminal.ID, buff.buffer.slice(0, -1));
}
