import MultiMap from '@woubuc/multimap';

import { Section } from './Section';
import { Node } from './Node';
import { tokenise } from './tokenise';
import { Iterator } from '../utils/Iterator';
import { TokenType } from './TokenType';
import { isTokenType, Token } from './Token';
import { OutputNode } from './nodes/OutputNode';
import { ExpressionNode } from './nodes/ExpressionNode';
import { VariableNode } from './nodes/VariableNode';
import { FunctionNode } from './nodes/FunctionNode';

/**
 * Parses a section and returns a template-ready node
 *
 * @param section - The section to parse
 */
export function parseSection(section : Section) : Node[] {
	// Ignore empty nodes
	if (section.content.length === 0) {
		return [];
	}

	// Plain text nodes don't need to be processed
	if (!section.isCode) {
		return [new OutputNode(section.content)];
	}

	// Ignore empty code sections
	if (section.content.trim().length === 0) {
		return [];
	}

	let tokens = new Iterator(tokenise(section));

	let node = new ExpressionNode();

	let parsingFirstToken = true;

	while (tokens.hasNext()) {
		if (!parsingFirstToken) {
			let next = tokens.next();

			if (next.type !== TokenType.Pipe) {
				throw new Error(`Unexpected token at ${ next.line }:${ next.col }. Expected '|', found: ${ next.value }`);
			}

			if (!tokens.hasNext()) {
				throw new Error(`Unexpected end of code section at line ${ next.line }, expected ')'`);
			}
		}

		parsingFirstToken = false;
		let next = tokens.next()!;
		let peek = tokens.peek();

		if (!isTokenType(next, TokenType.Literal, TokenType.Keyword)) {
			throw new Error(`Unexpected token at ${ next.line }:${ next.col }. Expected value or keyword, found: ${ next.value }`);
		}

		if (peek === undefined) {
			if (section.children.get('default').length > 0) {
				let functionNode = new FunctionNode({
					type: TokenType.Keyword,
					value: 'if',
					line: next.line,
					col: next.col,
				});

				functionNode.input = next;
				functionNode.blocks = parseBlocks(section);

				node.members.push(functionNode);
			} else if (next.type === TokenType.Literal) {
				node.members.push(new OutputNode(next));
			} else if (next.type === TokenType.Keyword) {
				node.members.push(new VariableNode(next));
			}

			break;
		}

		if (peek.type === TokenType.BraceOpen) {
			tokens.skip();
			let { hasOwnInput, functionNode } = parseFunctionNode(tokens, next);

			if (hasOwnInput) {
				node.members = [];
			}

			if (!tokens.hasNext()) {
				functionNode.blocks = parseBlocks(section);
			}

			node.members.push(functionNode);
			continue;
		}

		if (next.type === TokenType.Literal) {
			node.members.push(new OutputNode(next));
			continue;
		}

		if (next.type === TokenType.Keyword) {
			node.members.push(new VariableNode(next));
			continue;
		}

		throw new Error(`Unexpected token in expression: ${ next.value }`);
	}

	return [node];
}

function parseBlocks(section : Section) : MultiMap<string, Node> {
	let blocks = new MultiMap<string, Node>();

	for (let [blockName, childSection] of section.children.flatEntries()) {
		blocks.push(blockName, ...parseSection(childSection));
	}

	return blocks;
}

function parseFunctionNode(tokens : Iterator<Token>, keyword : Token) : { hasOwnInput : boolean, functionNode : FunctionNode } {
	let functionNode = new FunctionNode(keyword);

	let hasOwnInput = false;

	let peek = tokens.peek();
	if (peek !== undefined && peek.type === TokenType.BraceClose) {
		tokens.skip();
		return { hasOwnInput, functionNode };
	}

	let parsingFirstParameter = true;

	while (tokens.hasNext()) {
		if (!parsingFirstParameter) {
			let next = tokens.next();

			if (next.type === TokenType.BraceClose) {
				break;
			}

			if (next.type !== TokenType.Comma) {
				throw new Error(`Unexpected token '${ next.value }' at ${ next.line }:${ next.col }, expected ','`);
			}

			if (!tokens.hasNext()) {
				throw new Error(`Unexpected end of code section at line ${ next.line }, expected ')'`);
			}
		}

		let parameterName = tokens.next();

		if (parsingFirstParameter && parameterName.type === TokenType.Literal) {
			parsingFirstParameter = false;
			hasOwnInput = true;
			functionNode.input = parameterName;
			continue;
		}

		let peek = tokens.peek();

		if (peek !== undefined && peek.type === TokenType.BraceClose) {
			parsingFirstParameter = false;
			hasOwnInput = true;
			functionNode.input = parameterName;
			break;
		}

		let parameterValue = tokens.peek(1);

		if (peek === undefined || parameterValue === undefined) {
			throw new Error(`Unexpected end of code section at line ${ parameterName.line }`);
		}

		if (parsingFirstParameter && peek.type === TokenType.Comma) {
			parsingFirstParameter = false;
			hasOwnInput = true;
			functionNode.input = parameterName;
			continue;
		}

		if (peek.type !== TokenType.Assignment) {
			throw new Error(`Unexpected token '${ peek.value }' at ${ peek.line }:${ peek.col }, expected '='`);
		}

		if (!isTokenType(parameterValue, TokenType.Literal, TokenType.Keyword)) {
			throw new Error(`Unexpected token '${ peek.value }' at ${ peek.line }:${ peek.col }, expected literal or variable name`);
		}

		functionNode.params.set(parameterName.value.toString(), parameterValue);
		tokens.skip(2);
		parsingFirstParameter = false;
	}

	return { hasOwnInput, functionNode };
}
