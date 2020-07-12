import { MontaParserFunctionContext } from '../functions';
import { RenderFn } from '../../Template';
import { include } from './include';

export async function extend(context : MontaParserFunctionContext) : Promise<RenderFn[]> {
	if (!context.input.value.startsWith('.')) {
		context.input.value = 'layouts/' + context.input.value;
	}

	return include(context);
}
