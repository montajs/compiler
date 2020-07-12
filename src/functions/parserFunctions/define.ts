import { MontaParserFunctionContext } from '../functions';
import { Logger } from '../../utils/Logger';
import { RenderFn } from '../../Template';
import { Value } from '../../utils/Value';

/**
 * Defines a block
 */
export async function define({ input, blocks, context } : MontaParserFunctionContext) : Promise<RenderFn[]> {
	if (input === undefined) {
		throw new Error('Invalid input for `define`');
	}

	let blockName = context.getValue(input) as string;
	if (blockName === undefined) {
		throw new Error('Invalid input for `define`');
	}

	Logger.group('DEFINE');
	Logger.info('| name: %s', blockName);

	let nodes = new Value<RenderFn[]>(blocks.get('default'));
	context.setData('define', blockName, nodes);

	Logger.groupEnd();

	return [() => nodes.get()];
}
