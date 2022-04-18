import {arrayChanged, arrayExclude, arrayUnion} from '../utils/arrayUtils';
import {IFirstFollowDict} from './IFirstFollowDict';
import {NonTerminal, Terminal, Symbol, Terminals, NonTerminals, IGrammar} from '../Grammar';

export function calculateFollow(grammar: IGrammar, FIRST: IFirstFollowDict) {
	let FOLLOW: IFirstFollowDict = {};
	for (let A of NonTerminals) {
		FOLLOW[A] = [];
	}
	FOLLOW[NonTerminal.Program] = [Terminal.EOF];
	let changing = true;
	while (changing) {
		changing = false;
		for (let A of Object.keys(grammar) as (keyof typeof grammar)[]) {
			for (let i = 0; i < grammar[A].length; i++) {
				// for each rule A -> ... (B)
				let B = grammar[A][i];

				let TRAILER = FOLLOW[A];
				for (let i = B.length - 1; i >= 0; i--) {
					if (NonTerminals.includes(B[i])) {
						const newFollowBi = arrayUnion(FOLLOW[B[i]], TRAILER);
						changing = arrayChanged(FOLLOW[B[i]], newFollowBi);
						FOLLOW[B[i]] = newFollowBi;

						if (FIRST[B[i]].includes(Terminal.EPSILON)) {
							TRAILER = arrayUnion(TRAILER, arrayExclude(FIRST[B[i]], Terminal.EPSILON));
						} else {
							TRAILER = FIRST[B[i]];
						}
					} else {
						TRAILER = FIRST[B[i]];
					}
				}
			}
		}
	}
	return FOLLOW;
}
