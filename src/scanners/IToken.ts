import {Symbol} from '../Grammar';

export class TokenPosition {
	constructor(public line: number, public col: number) {}
	copy() {
		return new TokenPosition(this.line, this.col);
	}
}

export class Token {
	constructor(private _pos: TokenPosition, private _type: Symbol, private value?: any) {}
	get type() {
		return this._type;
	}
	get pos() {
		return this._pos;
	}
	posString() {
		return `[at line ${this._pos.line} col ${this._pos.col}]`;
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
