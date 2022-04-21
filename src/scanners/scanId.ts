import {Terminal} from '../Grammar';
import {EOF, nextCharBuff, NextCharFunc, TempBuffer} from '../utils/fileUtils';
import {isAlphabet, isNumber, isSpace, isSymbol} from './is';
import {Token, TokenPosition} from './IToken';
import {scanSymbol} from './scanSymbol';

export function scanID(pos: TokenPosition, nextChar: NextCharFunc, _buff?: TempBuffer): Token[] {
	const _nextChar = nextCharBuff(nextChar, pos, _buff);
	let buff = new TempBuffer();
	let c;
	while ((c = _nextChar(buff)) != EOF && !isSpace(c) && !isSymbol(c)) {
		if (!isNumber(c) && !isAlphabet(c)) {
			throw Error(`Invalid ID syntax! Near ${buff.buffer}`);
		}
	}
	const idToken = new Token(pos.copy(), Terminal.ID, buff.buffer.slice(0, -1));
	if (c != null && isSymbol(c)) {
		// int a;
		// a = a + b;
		pos.col++;
		return [idToken, scanSymbol(pos, c)];
	} else {
		return [idToken];
	}
}
