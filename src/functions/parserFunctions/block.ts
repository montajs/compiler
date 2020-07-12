import { MontaParserFunctionContext } from '../functions';
import { Node } from '../../parser/Node';
import { Value } from '../../utils/Value';
import { RenderFn } from '../../Template';

/**
 * Fills a block that is defined elsewhere
 */
export async function block({ input, blocks, context } : MontaParserFunctionContext) : Promise<Node[]> {
	if (input === undefined) {
		throw new Error('Invalid input for `block`');
	}

	let blockName = context.getValue(input) as string;
	if (blockName === undefined) {
		throw new Error('Invalid input for `block`');
	}

	let node = context.getData<Value<RenderFn[]>>('define', blockName);

	if (node === undefined) {
		throw new Error('Undefined block: ' + blockName);
	}

	node.set(blocks.get('default'));

	// The contents of the block will be displayed wherever it is defined, so here
	// we simply output an empty array.
	return [];
}
