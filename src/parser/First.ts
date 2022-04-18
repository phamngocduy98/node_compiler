import {arrayChanged, arrayExclude, arrayUnion} from '../utils/arrayUtils';
import {IFirstFollowDict} from './IFirstFollowDict';
import {NonTerminal, Terminal, Symbol, Terminals, NonTerminals, IGrammar} from '../Grammar';

export function calculateFirst(grammar: IGrammar) {
	let FIRST: IFirstFollowDict = {};
	for (let a of Terminals) {
		FIRST[a] = [a];
	}
	for (let A of NonTerminals) {
		FIRST[A] = [];
	}
	let changing = true;
	while (changing) {
		changing = false;
		for (let A of Object.keys(grammar) as (keyof typeof grammar)[]) {
			for (let i = 0; i < grammar[A].length; i++) {
				// for each rule A -> ... (B)
				let B = grammar[A][i];
				// console.log(`\n## ${A} => ${B}`);

				let ii = 0;
				let rhs: Symbol[] = [];
				rhs = arrayExclude(FIRST[B[0]], Terminal.EPSILON);
				// console.log(`rhs = FIRST[B0] = FIRST[${B[0]}] - e = `, rhs);

				while (FIRST[B[ii]].includes(Terminal.EPSILON) && ii < B.length - 1) {
					rhs = arrayUnion(rhs, arrayExclude(FIRST[B[ii + 1]], Terminal.EPSILON));
					// console.log(`rhs = FIRST[B${ii + 1}] - e =`, rhs);
					ii++;
				}

				if (ii == B.length - 1 && FIRST[B[ii]].includes(Terminal.EPSILON)) {
					rhs = arrayUnion(rhs, [Terminal.EPSILON]);
					// console.log(`rhs = rhs - e =`, rhs);
				}
				const newFirstA = arrayUnion(FIRST[A], rhs);
				changing = changing || arrayChanged(FIRST[A], newFirstA);
				// console.log(`FIRST[${A}] = FIRST[${A}] U rhs = [${FIRST[A]}] U [${rhs}] = [${newFirstA}]`);
				FIRST[A] = newFirstA;
			}
		}
	}
	return FIRST;
}
