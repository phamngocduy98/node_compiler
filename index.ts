import {parser} from './src/parser';
import {calculateFirst} from './src/parser/First';
import {calculateFollow} from './src/parser/Follow';
import {Grammar, IGrammar, NonTerminal, Terminal} from './src/Grammar';
import {scanner} from './src/scanner';

console.log('Compiler running ...');

//@ts-ignore
const _grammar: IGrammar = {
	[NonTerminal.Statement]: [[NonTerminal.Assignment], [Terminal.EOF]],
	[NonTerminal.Assignment]: [[Terminal.EXPONENT, NonTerminal.Statement, NonTerminal.Program], [Terminal.EPSILON]],
	[NonTerminal.Program]: [[Terminal.INT, NonTerminal.Statement]],
};

(async () => {
	const tokens = await scanner('program.txt');
	// console.log(tokens);
	parser(Grammar, tokens);
})();
