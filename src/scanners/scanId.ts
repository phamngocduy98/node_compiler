import {Terminal} from '../Grammar';
import {EOF, nextCharBuff, NextCharFunc, TempBuffer} from '../utils/fileUtils';
import {isAlphabet, isNumber, isSpace} from './is';
import {Token, TokenPosition} from './IToken';

export function scanID(pos: TokenPosition, nextChar: NextCharFunc, _buff?: TempBuffer) {
	const _nextChar = nextCharBuff(nextChar, pos, _buff);
	let buff = new TempBuffer();
	let c;
	while ((c = _nextChar(buff)) != EOF && !isSpace(c)) {
		// console.log("c = ", c);
		if (!isNumber(c) && !isAlphabet(c)) {
			throw Error(`Invalid ID syntax! Near ${buff.buffer}`);
		}
	}
	return new Token(pos.copy(), Terminal.ID, buff.buffer.slice(0, -1));
}
