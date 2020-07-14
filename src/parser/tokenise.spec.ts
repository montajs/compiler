import { tokenise } from './tokenise';
import { scan } from './scan';
import { TokenType } from './TokenType';

test('tokenise single keyword', () => {
	let sections = scan('{ foo }');
	let tokens = tokenise(sections[0]);

	expect(tokens).toHaveLength(1);
	expect(tokens[0]).toHaveProperty('type', TokenType.Keyword);
	expect(tokens[0]).toHaveProperty('value', 'foo');
});

test('tokenise literal', () => {
	let sections = scan(`{ 'foo' }{ 1 }{ true }`);
	expect(tokenise(sections[0])[0]).toHaveProperty('type', TokenType.Literal);
	expect(tokenise(sections[1])[0]).toHaveProperty('type', TokenType.Literal);
	expect(tokenise(sections[2])[0]).toHaveProperty('type', TokenType.Literal);
});

test('tokenise function', () => {
	let tokens = tokenise(scan('{ foo(bar, baz = 1) }')[0]);

	expect(tokens).toHaveLength(8);
	expect(tokens[0]).toHaveProperty('type', TokenType.Keyword);
	expect(tokens[1]).toHaveProperty('type', TokenType.BraceOpen);
	expect(tokens[2]).toHaveProperty('type', TokenType.Keyword);
	expect(tokens[3]).toHaveProperty('type', TokenType.Comma);
	expect(tokens[4]).toHaveProperty('type', TokenType.Keyword);
	expect(tokens[5]).toHaveProperty('type', TokenType.Assignment);
	expect(tokens[6]).toHaveProperty('type', TokenType.Literal);
	expect(tokens[7]).toHaveProperty('type', TokenType.BraceClose);
});

test('tokenise single pipe', () => {
	let tokens = tokenise(scan('{ foo | bar() }')[0]);

	expect(tokens).toHaveLength(5);
	expect(tokens[0]).toHaveProperty('type', TokenType.Keyword);
	expect(tokens[1]).toHaveProperty('type', TokenType.Pipe);
	expect(tokens[2]).toHaveProperty('type', TokenType.Keyword);
	expect(tokens[3]).toHaveProperty('type', TokenType.BraceOpen);
	expect(tokens[4]).toHaveProperty('type', TokenType.BraceClose);
});

test('tokenise multiple pipe', () => {
	let tokens = tokenise(scan('{ foo | bar() | baz() }')[0]);

	expect(tokens).toHaveLength(9);
	expect(tokens[0]).toHaveProperty('type', TokenType.Keyword);
	expect(tokens[1]).toHaveProperty('type', TokenType.Pipe);
	expect(tokens[2]).toHaveProperty('type', TokenType.Keyword);
	expect(tokens[3]).toHaveProperty('type', TokenType.BraceOpen);
	expect(tokens[4]).toHaveProperty('type', TokenType.BraceClose);
	expect(tokens[5]).toHaveProperty('type', TokenType.Pipe);
	expect(tokens[6]).toHaveProperty('type', TokenType.Keyword);
	expect(tokens[7]).toHaveProperty('type', TokenType.BraceOpen);
	expect(tokens[8]).toHaveProperty('type', TokenType.BraceClose);
});

describe('tokenise comparisons', () => {
	test('==', () => {
		let tokens = tokenise(scan('{ foo == 1 }')[0]);

		expect(tokens).toHaveLength(3);
		expect(tokens[1]).toHaveProperty('type', TokenType.Operator);
		expect(tokens[1]).toHaveProperty('value', '==');
	});
	test('===', () => {
		let tokens = tokenise(scan('{ foo === 1 }')[0]);

		expect(tokens).toHaveLength(3);
		expect(tokens[1]).toHaveProperty('type', TokenType.Operator);
		expect(tokens[1]).toHaveProperty('value', '===');
	});
	test('!=', () => {
		let tokens = tokenise(scan('{ foo != 1 }')[0]);

		expect(tokens).toHaveLength(3);
		expect(tokens[1]).toHaveProperty('type', TokenType.Operator);
		expect(tokens[1]).toHaveProperty('value', '!=');
	});
	test('!==', () => {
		let tokens = tokenise(scan('{ foo !== 1 }')[0]);

		expect(tokens).toHaveLength(3);
		expect(tokens[1]).toHaveProperty('type', TokenType.Operator);
		expect(tokens[1]).toHaveProperty('value', '!==');
	});
	test('<', () => {
		let tokens = tokenise(scan('{ foo < 1 }')[0]);

		expect(tokens).toHaveLength(3);
		expect(tokens[1]).toHaveProperty('type', TokenType.Operator);
		expect(tokens[1]).toHaveProperty('value', '<');
	});
	test('<=', () => {
		let tokens = tokenise(scan('{ foo <= 1 }')[0]);

		expect(tokens).toHaveLength(3);
		expect(tokens[1]).toHaveProperty('type', TokenType.Operator);
		expect(tokens[1]).toHaveProperty('value', '<=');
	});
	test('>', () => {
		let tokens = tokenise(scan('{ foo > 1 }')[0]);

		expect(tokens).toHaveLength(3);
		expect(tokens[1]).toHaveProperty('type', TokenType.Operator);
		expect(tokens[1]).toHaveProperty('value', '>');
	});
	test('<=', () => {
		let tokens = tokenise(scan('{ foo >= 1 }')[0]);

		expect(tokens).toHaveLength(3);
		expect(tokens[1]).toHaveProperty('type', TokenType.Operator);
		expect(tokens[1]).toHaveProperty('value', '>=');
	});
});
