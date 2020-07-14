import { SourceIterator } from '../utils/SourceIterator';
import { Token } from './Token';
import { TokenType } from './TokenType';
import { createSectionIterator, Section } from './Section';

const KEYWORD_START = /[$A-Z_a-z]/;
const KEYWORD_MIDDLE = /[\w$]/;
const NUMBER_START = /\d/;
const NUMBER_MIDDLE = /[\d._]/;

const STRING_START_CHARS = new Set([`'`, `"`]);

const SINGLE_CHAR_TOKENS : Readonly<Record<string, TokenType>> = {
	'(': TokenType.BraceOpen,
	')': TokenType.BraceClose,
	'|': TokenType.Pipe,
	',': TokenType.Comma,
	'=': TokenType.Assignment,
	'>': TokenType.Operator,
	'<': TokenType.Operator,
};

const OPERATOR_TOKENS = ['==', '===', '!=', '!==', '<=', '>='];

export function tokenise(section : Section) : Token[] {
	let source = createSectionIterator(section);
	let tokens : Token[] = [];

	while (source.hasNext()) {
		source.skipWhitespace();

		if (!source.hasNext()) {
			return tokens;
		}

		if (source.peekMatch('true') || source.peekMatch('false')) {
			let booleanLiteralToken = getBooleanLiteral(source);
			if (booleanLiteralToken !== false) {
				tokens.push(booleanLiteralToken);
				continue;
			}
		}

		let next = source.next();

		if (STRING_START_CHARS.has(next)) {
			tokens.push(getStringLiteral(source, next));
			continue;
		}

		if (NUMBER_START.test(next)) {
			tokens.push(getNumberLiteral(source, next));
			continue;
		}

		if (KEYWORD_START.test(next)) {
			tokens.push(getKeyword(source, next));
			continue;
		}

		if (Object.prototype.hasOwnProperty.call(SINGLE_CHAR_TOKENS, next)) {
			tokens.push({
				type: SINGLE_CHAR_TOKENS[next],
				value: next,
				line: source.line,
				col: source.col,
			});
			continue;
		}

		for (let tokenValue of OPERATOR_TOKENS) {
			if (next === tokenValue.charAt(0) && source.peekMatch(tokenValue.slice(1))) {
				tokens.push({
					type: TokenType.Operator,
					value: tokenValue,
					line: source.line,
					col: source.col,
				});
				source.skip(tokenValue.length - 1);
				continue;
			}
		}

		throw new Error(`Unexpected character at ${ source.line }:${ source.col }: ${ next }`);
	}

	return tokens;
}

function getStringLiteral(source : SourceIterator, quote : string) : Token {
	let { line, col } = source;

	let value = '';

	while (source.hasNext()) {
		let next = source.next();

		if (next === quote && source.peekBack() !== '\\') {
			return {
				type: TokenType.Literal,
				value,
				line,
				col,
			};
		}

		value += next;
	}

	throw new Error(`Unexpected end of string, expected: ${ quote }`);
}

function getNumberLiteral(source : SourceIterator, start : string) : Token {
	let { line, col } = source;

	let value = start;

	while (source.hasNext()) {
		let peek = source.peek();

		if (peek === undefined) {
			throw new Error('Unexpected end of input');
		}

		let isNumberLiteral = NUMBER_MIDDLE.test(peek);

		if (!isNumberLiteral) {
			break;
		}

		value += peek;
		source.skip();
	}

	value = value.replace(/_/g, '');

	let parsedValue : number;
	if (value.includes('.')) {
		parsedValue = Number.parseFloat(value);
	} else {
		parsedValue = Number.parseInt(value, 10);
	}

	return {
		type: TokenType.Literal,
		value: parsedValue,
		line,
		col,
	};
}

function getBooleanLiteral(source : SourceIterator) : Token | false {
	let { line, col } = source;

	if (source.peekMatch('true')) {
		let peek = source.peek(4);

		if (peek !== undefined && KEYWORD_MIDDLE.test(peek)) {
			return false;
		}

		source.skip(4);

		return {
			type: TokenType.Literal,
			value: true,
			line,
			col,
		};
	}

	if (source.peekMatch('false')) {
		let peek = source.peek(5);

		if (peek !== undefined && KEYWORD_MIDDLE.test(peek)) {
			return false;
		}

		source.skip(5);

		return {
			type: TokenType.Literal,
			value: false,
			line,
			col,
		};
	}

	return false;
}

function getKeyword(source : SourceIterator, start : string) : Token {
	let { line, col } = source;

	let value = start;

	while (source.hasNext()) {
		let peek = source.peek();

		if (peek === undefined) {
			throw new Error('Unexpected end of input');
		}

		let isValidKeyword = KEYWORD_MIDDLE.test(peek);

		if (!isValidKeyword) {
			break;
		}

		value += peek;
		source.skip();
	}

	return {
		type: TokenType.Keyword,
		value,
		line,
		col,
	};
}
