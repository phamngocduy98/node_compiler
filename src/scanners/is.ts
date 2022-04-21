import {Terminal} from '../Grammar';
import {TempBuffer} from '../utils/fileUtils';

export function isSpace(char: string) {
	return char === ' ' || char === '\r' || char === '\n';
}
export function isEOF(c?: string) {
	return c === '\r' || c === '\n';
}

export function isAlphabet(char: string) {
	// return /[a-zA-Z]/.test(char);
	return ('a' <= char && char <= 'z') || ('A' <= char && char <= 'Z');
}

export function isNumber(char: string) {
	// return /[0-9]/.test(char);
	return '0' <= char && char <= '9';
}

export function isSymbol(c: string) {
	return (
		[
			Terminal.EXPONENT,
			Terminal.LEFT_PARENTHESES,
			Terminal.MINUS,
			Terminal.RIGHT_PARENTHESES,
			Terminal.SEMI_COLON,
			Terminal.STAR,
			Terminal.EQUAL,
		] as string[]
	).includes(c);
}
