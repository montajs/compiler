import { Token } from '../Token';
import { ParseContext } from '../ParseContext';
import { RenderFn, RenderFnOutput } from '../../Template';
import { RenderContext } from '../../RenderContext';
import { Node } from '../Node';
import { Logger } from '../../utils/Logger';

export class ComparisonNode extends Node {
	/** Comparison operator */
	public operator : Token;

	/** The left side of the comparison */
	public left : Node;

	/** The right side of the comparison */
	public right : Node;

	public constructor(left : Node, operator : Token, right : Node) {
		super();

		this.operator = operator;
		this.left = left;
		this.right = right;
	}

	public async createRenderFunction(parseContext : ParseContext) : Promise<RenderFn> {
		Logger.group('CRF ComparisonNode');
		Logger.info('| operator: %s', this.operator.value);

		let left = await this.left.createRenderFunction(parseContext);
		let right = await this.right.createRenderFunction(parseContext);

		Logger.groupEnd();

		switch (this.operator.value) {
			case '==':
				return renderComparisonNode.bind(undefined, left, right, (a, b) => a == b);
			case '===':
				return renderComparisonNode.bind(undefined, left, right, (a, b) => a === b);
			case '!=':
				return renderComparisonNode.bind(undefined, left, right, (a, b) => a != b);
			case '!==':
				return renderComparisonNode.bind(undefined, left, right, (a, b) => a !== b);
			case '>':
				return renderComparisonNode.bind(undefined, left, right, (a, b) => a > b);
			case '<':
				return renderComparisonNode.bind(undefined, left, right, (a, b) => a < b);
			case '>=':
				return renderComparisonNode.bind(undefined, left, right, (a, b) => a >= b);
			case '<=':
				return renderComparisonNode.bind(undefined, left, right, (a, b) => a <= b);
		}

		throw new Error(`Invalid comparison operator: ${ this.operator.value.toString() }`);
	}
}

function renderComparisonNode(left : RenderFn, right : RenderFn, comparer : (a : any, b : any) => boolean, renderContext : RenderContext) : RenderFnOutput {
	Logger.group('RENDER ComparisonNode');
	let result = comparer(left(renderContext), right(renderContext));
	Logger.groupEnd();

	return result;
}
