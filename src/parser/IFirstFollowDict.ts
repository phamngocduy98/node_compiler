import {NonTerminal, Symbol} from '../Grammar';

export type IFirstFollowDict = {
	[a: string]: Symbol[];
};

export type FirstPlus = {
	[A in NonTerminal]: Symbol[][];
};
