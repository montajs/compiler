import { MontaParserFunctionContext } from '../functions';
import { RenderFn } from '../../Template';
import { include } from './include';

export async function component(context : MontaParserFunctionContext) : Promise<RenderFn[]> {
	if (!context.input.value.startsWith('.')) {
		context.input.value = 'components/' + context.input.value;
	}

	return include(context);
}
