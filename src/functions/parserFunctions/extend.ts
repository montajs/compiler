import { MontaParserFunctionContext } from '../functions';
import { RenderFn } from '../../Template';
import { include } from './include';
import { Token } from '../../parser/Token';

export async function extend(context : MontaParserFunctionContext) : Promise<RenderFn[]> {
	let token = context?.input as Token;

	if (token === undefined) {
		throw new Error(`Invalid input for 'extend'`);
	}

	if (!token.value.toString().startsWith('.')) {
		token.value = `layouts/${ token.value.toString() }`;
		context.input = token;
	}

	return include(context);
}
