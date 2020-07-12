import { MontaFunctionContext } from '../functions';
import { RenderFn } from '../../Template';

export async function forEach({ input, blocks, context } : MontaFunctionContext) : Promise<string[] | RenderFn[]> {
	if (input === undefined) {
		return [];
	}

	if (!Array.isArray(input)) {
		return [];
	}

	if (input.length === 0) {
		return blocks.get('empty');
	}

	let content = blocks.get('default');
	return Promise.all(input.flatMap((item, index) => {
		let childContext = context.createChildContext();
		childContext.setVariable('$index', index);
		childContext.setVariable('$item', item);

		return childContext.render(content);
	}));
}
