import { MontaParserFunctionContext } from '../functions';
import { RenderFn } from '../../Template';
import { include } from './include';
import { Token } from '../../parser/Token';

export async function component(context : MontaParserFunctionContext) : Promise<RenderFn[]> {
	let token = context?.input as Token;

	if (token === undefined) {
		throw new Error(`Invalid input for 'component'`);
	}

	if (!token.value.toString().startsWith('.')) {
		token.value = `components/${ token.value.toString() }`;
		context.input = token;
	}

	return include(context);
}
