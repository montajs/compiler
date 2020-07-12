import { ParseContext } from '../ParseContext';
import { RenderFn } from '../../Template';
import { Node } from '../Node';
import { RenderContext } from '../../RenderContext';
import { Logger } from '../../utils/Logger';

/**
 * A node containing an expression that needs to be evaluated
 */
export class ExpressionNode extends Node {
	/** The members of this expression */
	public members : Node[] = [];

	public async createRenderFunction(parseContext : ParseContext) : Promise<RenderFn> {
		Logger.info('CRF ExpressionNode');
		Logger.info('| members: %d', this.members.length);

		if (this.members.length === 0) {
			return () => '';
		}

		if (this.members.length === 1) {
			Logger.group();
			let functions = await this.members[0].createRenderFunction(parseContext);
			Logger.groupEnd();

			return functions;
		}

		Logger.group();
		let members : RenderFn[] = [];
		for (let member of this.members) {
			members.push(await member.createRenderFunction(parseContext));
		}
		Logger.groupEnd();

		return renderExpressionNode.bind(null, members);
	}
}

async function renderExpressionNode(members : RenderFn[], context : RenderContext) {
	Logger.group('RENDER ExpressionNode');
	Logger.info('| members: %d', members.length);

	let value : any = await members[0](context);
	for (let i = 1; i < members.length; i++) {
		value = await members[i](context, value);
	}

	Logger.groupEnd();
	return value;
}
