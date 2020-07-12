import { Node} from '../parser/Node';
import { GroupNode } from '../parser/nodes/GroupNode';
import { OutputNode } from '../parser/nodes/OutputNode';
import { ExpressionNode } from '../parser/nodes/ExpressionNode';
import { ComparisonNode } from '../parser/nodes/ComparisonNode';
import { FunctionNode } from '../parser/nodes/FunctionNode';

type ArrayOrPromise<T> = T | T[] | Promise<T> | Promise<T[]>;

export async function walkFunctionNodes<N extends Node>(node : N, onFunction : (fn : FunctionNode) => ArrayOrPromise<any>) : Promise<Node> {

	if (node instanceof GroupNode) {
		node.children = await Promise.all(node.children.map(n => walkFunctionNodes(n, onFunction)));
		return node;
	}

	if (node instanceof ExpressionNode) {
		node.members = await Promise.all(node.members.map(n => walkFunctionNodes(n, onFunction)));
		return node;
	}

	if (node instanceof ComparisonNode) {
		node.left = await walkFunctionNodes(node.left, onFunction);
		node.right = await walkFunctionNodes(node.right, onFunction);
		return node;
	}

	if (node instanceof FunctionNode) {
		for (let [block, nodes] of node.blocks.entries()) {
			node.blocks.set(block, await Promise.all(nodes.map(n => walkFunctionNodes(n, onFunction))));
		}

		let functionOutput = await onFunction(node);

		if (!Array.isArray(functionOutput)) {
			functionOutput = [functionOutput];
		}

		let items = functionOutput as any[];
		let nodes = await Promise.all(items.map(item => {
			if (item === node) {
				return item;
			}

			if (item instanceof Node) {
				return walkFunctionNodes(item, onFunction);
			}

			return new OutputNode(item);
		}));

		if (nodes.length === 1) {
			return nodes[0];
		}

		let group = new GroupNode();
		group.children = nodes;

		return group;
	}

	return node;
}
