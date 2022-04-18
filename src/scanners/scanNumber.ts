import {Terminal} from '../Grammar';
import {EOF, NextCharFunc, TempBuffer} from '../utils/fileUtils';
import {isNumber, isSpace} from './is';
import {Token, TokenPosition} from './IToken';

// firstChar should isNumber()
export function scanNumber(pos: TokenPosition, nextChar: NextCharFunc, firstChar: string) {
	let buff = new TempBuffer(firstChar);
	let c;
	if (firstChar === '0') {
		c = nextChar(buff);
		if (c === EOF || isSpace(c)) return new Token(pos.copy(), Terminal.NUMBER, 0);
		throw Error(`Invalid syntax! No more character after 0 Near ${buff.buffer}`);
	} else {
		while ((c = nextChar(buff)) != EOF && !isSpace(c)) {
			if (!isNumber(c)) {
				throw Error(`Invalid syntax! Invalid ID Near ${buff.buffer}`);
			}
		}
		return new Token(pos.copy(), Terminal.NUMBER, parseInt(buff.buffer));
	}
}
