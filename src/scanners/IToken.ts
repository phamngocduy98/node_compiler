import {Symbol} from '../Grammar';

export class Token {
	constructor(private _type: Symbol, private value?: any) {}
	get type() {
		return this._type;
	}
	toString() {
		return `${this._type}${this.value != null ? `(${this.value})` : ''}`;
	}
}

export enum TokenList {
	SEMI_COLON = ';',
	EQUAL = '=',
	MINUS = '-',
	STAR = '*',
	EXPONENT = '^',
	LEFT_PARENTHESES = '(',
	RIGHT_PARENTHESES = ')',

	BEGIN = 'begin',
	END = 'end',
	PRINT = 'print',
	INT = 'int',
	WHILE = 'while',
	DO = 'do',

	EOF = 'EOF',
	EPSILON = 'e',
}
