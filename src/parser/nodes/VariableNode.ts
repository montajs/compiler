import { Token } from '../Token';
import { RenderFn } from '../../Template';
import { Node } from '../Node';
import { RenderContext } from '../../RenderContext';
import { OutputNode } from './OutputNode';
import { ParseContext } from '../ParseContext';
import { Logger } from '../../utils/Logger';

/**
 * A node containing a single variable that needs to be evaluated
 */
export class VariableNode extends Node {
	/** Value of the node */
	public readonly keyword : Token;

	public constructor(keyword : Token) {
		super();

		this.keyword = keyword;
	}

	public async createRenderFunction(parseContext : ParseContext) : Promise<RenderFn> {
		Logger.group('CRF VariableNode');

		let ident = parseContext.getValue(this.keyword);

		if (ident === undefined) {
			Logger.info('| type: runtime');
			Logger.info('| ident: %s', this.keyword.value);
			Logger.groupEnd();

			return renderVariableNode.bind(null, this.keyword);
		}

		Logger.info('| type: parse');
		Logger.info('| ident: %s', ident);

		let functions = await new OutputNode(ident).createRenderFunction(parseContext);
		Logger.groupEnd();
		return functions;
	}
}

function renderVariableNode(keyword : Token, renderContext : RenderContext) {
	return renderContext.getValue(keyword);
}
