import { scan } from './scan';
import { parseSection } from './parse';
import { OutputNode } from './nodes/OutputNode';
import { ExpressionNode } from './nodes/ExpressionNode';
import { ComparisonNode } from './nodes/ComparisonNode';
import { VariableNode } from './nodes/VariableNode';
import { FunctionNode } from './nodes/FunctionNode';

test('parse plain text', () => {
	let nodes = parseSection(scan('foo')[0]);
	expect(nodes).toHaveLength(1);
	expect(nodes[0]).toBeInstanceOf(OutputNode);
});

test('parse keyword', () => {
	let nodes = parseSection(scan('{ foo }')[0]);
	expect(nodes).toHaveLength(1);
	expect(nodes[0]).toBeInstanceOf(ExpressionNode);

	let expressionNode = nodes[0] as ExpressionNode;
	expect(expressionNode.members).toHaveLength(1);
	expect(expressionNode.members[0]).toBeInstanceOf(VariableNode);
});

test('parse comparison', () => {
	let nodes = parseSection(scan('{ foo === 1 }')[0]);
	expect(nodes).toHaveLength(1);
	expect(nodes[0]).toBeInstanceOf(ExpressionNode);

	let expressionNode = nodes[0] as ExpressionNode;
	expect(expressionNode.members).toHaveLength(1);
	expect(expressionNode.members[0]).toBeInstanceOf(ComparisonNode);

	let comparisonNode = expressionNode.members[0] as ComparisonNode;
	expect(comparisonNode.left).toBeInstanceOf(VariableNode);
	expect(comparisonNode.right).toBeInstanceOf(OutputNode);
	expect(comparisonNode.operator).toHaveProperty('value', '===');
});

describe('parse implicit if', () => {
	test('from variable', () => {
		let nodes = parseSection(scan('{ foo: yes :else: no }')[0]);
		expect(nodes).toHaveLength(1);
		expect(nodes[0]).toBeInstanceOf(ExpressionNode);

		let expressionNode = nodes[0] as ExpressionNode;
		expect(expressionNode.members).toHaveLength(2);
		expect(expressionNode.members[0]).toBeInstanceOf(VariableNode);
		expect(expressionNode.members[1]).toBeInstanceOf(FunctionNode);

		let functionNode = expressionNode.members[1] as FunctionNode;
		expect(functionNode.input).toBeUndefined();
		expect(functionNode.keyword).toHaveProperty('value', 'if');
		expect(functionNode.blocks.has('default')).toBeTruthy();
	});

	test('from comparison', () => {
		let nodes = parseSection(scan('{ foo > 1: yes :else: no }')[0]);
		expect(nodes).toHaveLength(1);
		expect(nodes[0]).toBeInstanceOf(ExpressionNode);

		let expressionNode = nodes[0] as ExpressionNode;
		expect(expressionNode.members).toHaveLength(2);
		expect(expressionNode.members[0]).toBeInstanceOf(ComparisonNode);
		expect(expressionNode.members[1]).toBeInstanceOf(FunctionNode);
	});
});
