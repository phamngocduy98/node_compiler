import {Terminal} from '../Grammar';
import {Token, TokenPosition} from './IToken';

export function scanSymbol(pos: TokenPosition, s: string) {
	const _pos = pos.copy();
	_pos.col++;
	return new Token(_pos, s as Terminal);
}
