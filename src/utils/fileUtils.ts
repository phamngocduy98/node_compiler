import {readFile} from 'fs/promises';
import fs from 'fs';
import {TokenPosition} from '../scanners/IToken';

export const EOF = null;
export class TempBuffer {
	public buffer: string = '';
	constructor(buffer?: string) {
		this.buffer = buffer ?? '';
	}
	clear() {
		this.buffer = '';
	}
}
export type NextCharFunc = (buff?: TempBuffer) => string | null;

export async function readFileCharByChar(fileName: string): Promise<NextCharFunc> {
	const readable = fs.createReadStream(fileName, {
		encoding: 'utf8',
		fd: undefined,
	});
	return new Promise((rs, rj) => {
		readable.on('readable', function () {
			rs(buff => {
				const chunk = readable.read(1);
				if (buff) buff.buffer += chunk;
				return chunk;
			});
		});
	});
}

export function nextCharBuff(nextChar: NextCharFunc, pos: TokenPosition, _buff?: TempBuffer): NextCharFunc {
	return buff => {
		let chunk;
		if (_buff && _buff.buffer.length > 0) {
			chunk = _buff.buffer[0];
			_buff.buffer = _buff.buffer.slice(1);
		} else {
			chunk = nextChar();
			pos.col++;
		}
		if (buff) buff.buffer += chunk;
		return chunk;
	};
}

// export async function readFileWordByWord(fileName: string) {
//   const fileContent = (await readFile(fileName)).toString();
//   const words = fileContent
//     .replace(/[\t|\r|\n]/g, " ")
//     .split(" ")
//     .filter((w) => w.length > 0);
//   return words;
// }
