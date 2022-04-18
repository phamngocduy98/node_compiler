import {arrayExclude, arrayUnion} from '../utils/arrayUtils';
import {IGrammar, NonTerminal, Symbol, Terminal} from '../Grammar';
import {FirstPlus, IFirstFollowDict} from './IFirstFollowDict';

export function calculateFirstPlus(grammar: IGrammar, FIRST: IFirstFollowDict, FOLLOW: IFirstFollowDict) {
	const FIRSTPLUS: FirstPlus = {
		Program: [],
		Statements: [],
		Statement: [],
		Decl: [],
		Type: [],
		Assignment: [],
		Expr: [],
		"Expr'": [],
		Term: [],
		"Term'": [],
		Factor: [],
		"Factor'": [],
		SubFactor: [],

		Loop: [],
	};
	for (let A of Object.keys(grammar) as (keyof typeof grammar)[]) {
		for (let i = 0; i < grammar[A].length; i++) {
			// for each rule A -> ... (B)
			let B = grammar[A][i];

			let ii = 0;
			let firstB: Symbol[] = [];
			firstB = arrayExclude(FIRST[B[0]], Terminal.EPSILON);
			// console.log(`rhs = FIRST[B0] = FIRST[${B[0]}] - e = `, rhs);

			while (FIRST[B[ii]].includes(Terminal.EPSILON) && ii < B.length - 1) {
				firstB = arrayUnion(firstB, arrayExclude(FIRST[B[ii + 1]], Terminal.EPSILON));
				// console.log(`rhs = FIRST[B${ii + 1}] - e =`, rhs);
				ii++;
			}

			if (ii == B.length - 1 && FIRST[B[ii]].includes(Terminal.EPSILON)) {
				firstB = arrayUnion(firstB, [Terminal.EPSILON]);
				// console.log(`rhs = rhs - e =`, rhs);
			}

			if (FIRST[A].includes(Terminal.EPSILON)) {
				FIRSTPLUS[A][i] = arrayUnion(firstB, FOLLOW[A]);
				// console.log(`FIRST+[${A} => ${B}]`, FIRSTPLUS[A][i]);
			} else {
				FIRSTPLUS[A][i] = firstB;
			}
		}
	}
	return FIRSTPLUS;
}
