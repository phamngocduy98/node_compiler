import {Token} from './scanners/IToken';
import {Grammar, IGrammar, NonTerminal, NonTerminals, Symbol, Terminal, Terminals} from './Grammar';
import {IFirstFollowDict} from './parser/IFirstFollowDict';
import {calculateFirst} from './parser/First';
import {calculateFollow} from './parser/Follow';
import {calculateFirstPlus} from './parser/FirstPlus';
import {buildLL1Table} from './parser/LL1Table';

class ParserNode {
	constructor(public symbol: Symbol, public children: ParserNode[] = []) {}
}

class StackBlock {
	constructor(public stack: (null | ParserNode[])[] = []) {}
	pushBlock(block: ParserNode[]) {
		if (block.length === 0) return;
		this.stack.push(block);
	}
	popBlock() {
		return this.stack.pop();
	}
	private _clearTop() {
		while (this.stack.length > 0 && this.stack.at(-1)?.length === 0) {
			this.stack.pop();
		}
	}
	top() {
		this._clearTop();
		if (this.stack.length == 0) return null;
		const tail = this.stack.at(-1);
		if (tail == null) return null;
		return tail.at(-1);
	}
	pop() {
		this._clearTop();
		if (this.stack.length == 0) return null;
		const tail = this.stack.at(-1);
		if (tail == null) return null;
		const v = tail.pop();
		if (tail.length === 0) this.popBlock();
		return v;
	}
	copy() {
		return new StackBlock([...this.stack]);
	}
	toString() {
		return this.stack.map(st => st?.map(it => it.symbol));
	}
}

export async function parser(grammar: IGrammar = Grammar, words: Token[]) {
	const FIRST = calculateFirst(grammar);
	const FOLLOW = calculateFollow(grammar, FIRST);
	// console.log('FIRST', FIRST);
	// console.log('FOLLOW', FOLLOW);
	const FIRSTPLUS = calculateFirstPlus(grammar, FIRST, FOLLOW);
	const ll1Table = buildLL1Table(grammar, FIRSTPLUS);
	// const ll1Table = buildLL1Table(grammar, FIRST);
	// console.log('LL1Table', ll1Table);

	let root = new ParserNode(NonTerminal.Program);
	let parseOK = false;
	let loop = 0;
	let notMatchWord: Token | undefined;
	let notMatchSymbol: Symbol | undefined;

	function backtrack(wi: number, stack: StackBlock, focus: ParserNode | null, follow: Symbol[]) {
		if (wi >= words.length || focus == null) {
			if (wi >= words.length && focus == null) {
				// console.log('Parser OK');
				parseOK = true;
			} else {
				notMatchWord = words[wi];
				notMatchSymbol = focus?.symbol;
			}
			return;
		}
		const word = words[wi];
		// console.log(`\nword[${wi}]`, word);
		// console.log('focus', focus, focus.symbol === word.type);
		// console.log('stack', stack.toString());
		if (parseOK) return;
		// prevent infinitive loop:
		// if (++loop > 1000) return;

		if (NonTerminals.includes(focus.symbol)) {
			// A -> B1B2B3 (focus.symbol -> B)
			const rules = ll1Table[focus.symbol]![word.type];
			if (rules == null || rules.length === 0) {
				// console.log('No more rule');
				notMatchWord = word;
				notMatchSymbol = focus.symbol;
				stack.popBlock();
				return false;
			}
			for (let B of rules) {
				const newStack = stack.copy();
				// A (focus) => B1B2... (B)

				// B1..Bn as children of focus
				focus.children = B.map(Bi => new ParserNode(Bi));
				// push(Bn, ... B2)
				newStack.pushBlock([...focus.children].reverse().slice(0, -1));

				// focus = B1
				const newFocus = focus.children[0];
				backtrack(wi, newStack, newFocus, FOLLOW[focus.symbol]);
			}
		} else {
			// is ternimal
			// console.log('Terminal');
			if (focus.symbol === Terminal.EPSILON) {
				// for (let sym of follow) {
				// 	backtrack(wi, stack.copy(), new ParserNode(sym), []);
				// }
				// return;
				// console.log('MATCH', word.toString());
				const focus = stack.pop() ?? null;
				backtrack(wi, stack, focus, focus ? FOLLOW[focus.symbol] : []);
			} else if (focus.symbol === word.type) {
				// console.log('MATCH', word.toString());
				const focus = stack.pop() ?? null;
				backtrack(wi + 1, stack, focus, focus ? FOLLOW[focus.symbol] : []);
			} else {
				// console.log('NOT MATCH', focus.symbol, word.toString());
				notMatchWord = word;
				notMatchSymbol = focus.symbol;
				return false;
			}
		}
	}

	backtrack(0, new StackBlock([null]), root, []);

	if (parseOK) {
		console.log('Parser OK');
		// console.log('Parse Tree', JSON.stringify(root));
	} else {
		console.log(
			`Parser error ${notMatchWord?.posString()} unexpected word "${notMatchWord}", expect symbol "${notMatchSymbol} (FIRST=${
				FIRST[notMatchSymbol!]
			})" `,
		);
	}

	// LL1 table
	//
	// let ii = 0;
	// let word = words[ii];
	// let stack = [Terminal.EOF, NonTerminal.Program];
	// let focus = stack[1];
	// while (true) {
	// 	word = words[ii];
	// 	console.log('\nFOCUS = ', focus, 'word = ', word);
	// 	if (focus == Terminal.EOF && word.type == Terminal.EOF) {
	// 		console.log('Parser completed');
	// 		return;
	// 	} else if (Terminals.includes(focus) || focus === Terminal.EOF) {
	// 		if (focus === word.type) {
	// 			console.log('MATCH', focus, word);
	// 			stack.pop();
	// 			ii++;
	// 		} else {
	// 			console.log('Parser error, stack top = ', stack.pop());
	// 			return;
	// 		}
	// 	} else {
	// 		// focus is nonterminal
	// 		// A(focus) => B1B2B3 (ll1Table[focus][word])
	// 		const B = ll1Table[focus]![word.type];
	// 		console.log(`FOCUS is nonterminal: ${focus} => `, B);
	// 		if (B != null && B.length > 0) {
	// 			stack.pop();
	// 			for (let i = B.length - 1; i >= 0; i--) {
	// 				if (B[i] != Terminal.EPSILON) {
	// 					stack.push(B[i]);
	// 				}
	// 			}
	// 		} else {
	// 			console.log('Parser error, expanding', focus);
	// 			return;
	// 		}
	// 	}
	// 	focus = stack[stack.length - 1];
	// }

	// backtrack
	//
	// let root = new ParserNode(NonTerminal.Program);
	// let focus: ParserNode | null = root;
	// let stack: (ParserNode | null)[] = [null];
	// let ii = 0;
	// let word = words[ii];

	// let loop = 0;
	// while (true) {
	// 	console.log('\nword', word);
	// 	console.log('focus', focus);
	// 	console.log('stack', stack);
	// 	if (++loop === 20) return;
	// 	if (focus != null && NonTerminals.includes(focus.symbol)) {
	// 		// A -> B1B2B3 (focus.symbol -> B)
	// 		const rules = ll1Table[focus.symbol]![word.type];
	// 		if (rules == null) {
	// 			console.log('error');
	// 			return;
	// 		}
	// 		console.log('rules = ', rules);
	// 		for (let B of rules) {
	// 			// A (focus) => B1B2... (B)

	// 			// B1..Bn as children of focus
	// 			focus.children = B.map(Bi => new ParserNode(Bi));
	// 			// push(Bn, ... B2)
	// 			stack.push(...[...focus.children].reverse().slice(0, -1));

	// 			console.log('focus(new)', focus);

	// 			// focus = B1
	// 		}
	// 		focus = focus.children[0];
	// 	} else if (focus != null && focus.symbol === word.type) {
	// 		// is ternimal, match
	// 		console.log('MATCH');
	// 		word = words[++ii];
	// 		focus = stack.pop() ?? null;
	// 	}
	// 	// else if (focus != null && focus.symbol !== word.type) {
	// 	// 	// is ternimal, NOT match
	// 	// 	console.log('NOT MATCH');
	// 	// 	focus = stack.pop() ?? null;
	// 	// }
	// 	else if (word.type === Terminal.EOF && focus == null) {
	// 		console.log('Parser completed.');
	// 		return;
	// 	}
	// }
}
