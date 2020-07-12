import { MontaFunctionContext } from '../functions';
import { RenderFn } from '../../Template';

export async function conditionalIf({ input, blocks, context } : MontaFunctionContext) : Promise<RenderFn[]> {
	if (input === undefined) {
		return [];
	}

	let value = context.getValue(input);

	if (value) {
		return blocks.get('default');
	} else {
		return blocks.get('else');
	}
}
