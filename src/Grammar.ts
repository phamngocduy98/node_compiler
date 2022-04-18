export enum NonTerminal {
	Program = 'Program',
	Statements = 'Statements',
	Statement = 'Statement',
	Decl = 'Decl',
	Type = 'Type',
	Assignment = 'Assignment',

	Expr = 'Expr',
	Expr_ = "Expr'",
	Term = 'Term',
	Term_ = "Term'",
	Factor = 'Factor',
	Factor_ = "Factor'",
	SubFactor = 'SubFactor',

	Loop = 'Loop',
}
export const NonTerminals: Symbol[] = Object.values(NonTerminal);

export enum Terminal {
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

	NUMBER = 'NUMBER',
	ID = 'ID',
}
export const Terminals: Symbol[] = Object.values(Terminal);

export type Symbol = NonTerminal | Terminal;

export type IGrammar = {[start in NonTerminal]: Symbol[][]};

export const Grammar: IGrammar = {
	[NonTerminal.Program]: [[Terminal.BEGIN, NonTerminal.Statements, Terminal.END, Terminal.EOF]],
	[NonTerminal.Statements]: [
		[NonTerminal.Statement, Terminal.SEMI_COLON, NonTerminal.Statements],
		[Terminal.EPSILON],
	],
	[NonTerminal.Statement]: [
		[NonTerminal.Decl],
		[NonTerminal.Assignment],
		[NonTerminal.Loop],
		[Terminal.PRINT, NonTerminal.Expr],
	],
	[NonTerminal.Decl]: [[NonTerminal.Type, Terminal.ID, Terminal.SEMI_COLON, NonTerminal.Decl], [Terminal.EPSILON]],
	[NonTerminal.Type]: [[Terminal.INT]],
	[NonTerminal.Assignment]: [[Terminal.ID, Terminal.EQUAL, NonTerminal.Expr]],

	// ORIGINAL
	// [NonTerminal.Expr]: [
	// 	[NonTerminal.Expr, Terminal.MINUS, NonTerminal.Expr],
	// 	[NonTerminal.Expr, Terminal.STAR, NonTerminal.Expr],
	// 	[NonTerminal.Expr, Terminal.EXPONENT, NonTerminal.Expr],
	// 	[Terminal.LEFT_PARENTHESES, NonTerminal.Expr, Terminal.RIGHT_PARENTHESES],
	// 	[Terminal.NUMBER],
	// 	[Terminal.ID],
	// ],

	// Priority + Kết hợp trái / phải
	// Expr  => Expr - Term
	// 		| Term
	// Term  => Term * Factor
	// 		| Factor
	// Factor => SubFactor ^ Factor
	// 		| SubFactor
	// SubFactor => ( Expr )
	// 			| Number
	// 			| ID
	[NonTerminal.Expr]: [[NonTerminal.Term, NonTerminal.Expr_]],
	[NonTerminal.Expr_]: [[Terminal.MINUS, NonTerminal.Term, NonTerminal.Expr_], [Terminal.EPSILON]],

	[NonTerminal.Term]: [[NonTerminal.Factor, NonTerminal.Term_]],
	[NonTerminal.Term_]: [[Terminal.STAR, NonTerminal.Factor, NonTerminal.Term_], [Terminal.EPSILON]],

	[NonTerminal.Factor]: [[NonTerminal.SubFactor, NonTerminal.Factor_]],
	[NonTerminal.Factor_]: [[Terminal.EXPONENT, NonTerminal.Factor, NonTerminal.Factor_], [Terminal.EPSILON]],
	[NonTerminal.SubFactor]: [
		[Terminal.LEFT_PARENTHESES, NonTerminal.Expr, Terminal.RIGHT_PARENTHESES],
		[Terminal.NUMBER],
		[Terminal.ID],
	],

	[NonTerminal.Loop]: [
		[Terminal.WHILE, NonTerminal.Expr, Terminal.DO, Terminal.BEGIN, NonTerminal.Statements, Terminal.END],
	],
};
