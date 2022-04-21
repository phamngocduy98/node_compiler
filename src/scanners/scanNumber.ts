import {Terminal} from '../Grammar';
import {EOF, NextCharFunc, TempBuffer} from '../utils/fileUtils';
import {isNumber, isSpace, isSymbol} from './is';
import {Token, TokenPosition} from './IToken';
import {scanSymbol} from './scanSymbol';

// firstChar should isNumber()
export function scanNumber(pos: TokenPosition, nextChar: NextCharFunc, firstChar: string): Token[] {
	let buff = new TempBuffer(firstChar);
	let c;
	if (firstChar === '0') {
		c = nextChar(buff);
		if (c === EOF || isSpace(c)) return [new Token(pos.copy(), Terminal.NUMBER, 0)];
		throw Error(`Invalid syntax! No more character after 0 Near ${buff.buffer}`);
	} else {
		while ((c = nextChar(buff)) != EOF && !isSpace(c) && !isSymbol(c)) {
			if (!isNumber(c)) {
				throw Error(`Invalid syntax! Invalid ID Near ${buff.buffer}`);
			}
		}
		const numberToken = new Token(pos.copy(), Terminal.NUMBER, parseInt(buff.buffer));
		if (c != null && isSymbol(c)) {
			// a = 1 + 1;
			pos.col++;
			return [numberToken, scanSymbol(pos, c)];
		} else {
			return [numberToken];
		}
	}
}
