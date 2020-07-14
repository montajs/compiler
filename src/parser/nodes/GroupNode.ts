import { ParseContext } from '../ParseContext';
import { RenderFn, RenderFnOutput } from '../../Template';
import { Node } from '../Node';
import { RenderContext } from '../../RenderContext';
import { Logger } from '../../utils/Logger';

/**
 * A node combining a set of nodes
 */
export class GroupNode extends Node {
	public children : (RenderFn | Node)[];

	public constructor(children : (RenderFn | Node)[] = []) {
		super();

		this.children = children;
	}

	public async createRenderFunction(parseContext : ParseContext) : Promise<RenderFn> {
		Logger.group('CRF GroupNode');
		Logger.info('| children: %d', this.children.length);

		let children : RenderFn[] = [];

		for (let child of this.children) {
			if (child instanceof Node) {
				children.push(await child.createRenderFunction(parseContext));
			} else {
				children.push(child);
			}
		}

		Logger.groupEnd();
		return renderGroupNode.bind(undefined, children);
	}
}


async function renderGroupNode(renderFunctions : RenderFn[], renderContext : RenderContext) : Promise<RenderFnOutput[]> {
	Logger.group('RENDER GroupNode');
	let children = await Promise.all(renderFunctions.map(fn => fn(renderContext)));
	Logger.groupEnd();

	return children.flat();
}
