import { MontaParserFunctionContext } from '../functions';
import { parse } from '../../parser';
import { RenderFn } from '../../Template';
import { Logger } from '../../utils/Logger';

export async function include({ input, context, params } : MontaParserFunctionContext) : Promise<RenderFn[]> {
	if (input === undefined) {
		throw new Error('Invalid input value for `include`');
	}

	let filename = context.getValue(input) as string;
	if (filename === undefined) {
		throw new Error('Invalid input value for `include`');
	}

	let childContext = context.createChildContext(filename);

	Logger.info('| filename: %s', filename);
	Logger.info('| resolved filename: %s', childContext.file);

	for (let [key, value] of params.entries()) {
		Logger.info('| attr:', key, '=', value);
		childContext.setData('attr', key, value);
	}

	let node = await parse(childContext);

	return [node];
}
