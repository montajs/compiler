import { scan } from './scan';
import { parseSection } from './parse';
import { OutputNode } from './nodes/OutputNode';
import { ExpressionNode } from './nodes/ExpressionNode';

test('parse plain text', () => {
	let nodes = parseSection(scan('foo')[0]);

	expect(nodes).toHaveLength(1);
	expect(nodes[0]).toBeInstanceOf(OutputNode);
});

test('parse keyword', () => {
	let nodes = parseSection(scan('{ foo }')[0]);

	expect(nodes).toHaveLength(1);
	expect(nodes[0]).toBeInstanceOf(ExpressionNode);
});
