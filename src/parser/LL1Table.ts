import {IGrammar, NonTerminal, NonTerminals, Symbol, Terminal, Terminals} from '../Grammar';
import {FirstPlus, IFirstFollowDict} from './IFirstFollowDict';

// type LL1Table = {
// 	[A in Symbol]?: {
// 		[w in Symbol]?: Symbol[];
// 	};
// };

// export function buildLL1Table(grammar: IGrammar, FIRSTPLUS: FirstPlus) {
// 	let table: LL1Table = {};

// 	for (let A of NonTerminals) {
// 		table[A] = {};
// 		for (let w of Terminals) {
// 			table[A]![w] = [];
// 		}
// 	}

// 	for (let A of Object.keys(grammar) as (keyof typeof grammar)[]) {
// 		for (let i = 0; i < grammar[A].length; i++) {
// 			// for each rule A -> ... (B)
// 			let B = grammar[A][i];

// 			for (let w of FIRSTPLUS[A][i]) {
// 				table[A]![w] = B;
// 			}
// 			if (FIRSTPLUS[A][i].includes(Terminal.EOF)) {
// 				table[A]![Terminal.EOF] = B;
// 			}
// 		}
// 	}

// 	console.log('LL1Table', table);
// 	return table;
// }

type LL1Table = {
	[A in Symbol]?: {
		[w in Symbol]?: Symbol[][];
	};
};

export function buildLL1Table(grammar: IGrammar, FIRSTPLUS: FirstPlus) {
	let table: LL1Table = {};

	for (let A of NonTerminals) {
		table[A] = {};
		for (let w of Terminals) {
			table[A]![w] = [];
		}
	}

	for (let A of Object.keys(grammar) as (keyof typeof grammar)[]) {
		for (let i = 0; i < grammar[A].length; i++) {
			// for each rule A -> ... (B)
			let B = grammar[A][i];

			for (let w of FIRSTPLUS[A][i]) {
				table[A]![w] = table[A]![w] ? [...table[A]![w]!, B] : [B];
			}
			if (FIRSTPLUS[A][i].includes(Terminal.EOF)) {
				table[A]![Terminal.EOF] = [B];
			}
		}
	}
	return table;
}

// export function buildLL1Table(grammar: IGrammar, FIRST: IFirstFollowDict) {
// 	let table: LL1Table = {};

// 	for (let A of NonTerminals) {
// 		table[A] = {};
// 		for (let w of Terminals) {
// 			table[A]![w] = [];
// 		}
// 	}

// 	for (let A of Object.keys(grammar) as (keyof typeof grammar)[]) {
// 		for (let i = 0; i < grammar[A].length; i++) {
// 			// for each rule A -> ... (B)
// 			let B = grammar[A][i];

// 			for (let w of FIRST[A]) {
// 				table[A]![w] = table[A]![w] ? [...table[A]![w]!, B] : [B];
// 			}
// 			// if (FIRSTPLUS[A][i].includes(Terminal.EOF)) {
// 			// 	table[A]![Terminal.EOF] = [B];
// 			// }
// 		}
// 	}

// 	console.log('LL1Table', table);
// 	return table;
// }
