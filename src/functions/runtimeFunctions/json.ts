import { MontaFunctionContext } from '../functions';

export function json({ input, params, context } : MontaFunctionContext) : string {
	if (input === undefined) {
		return '';
	}

	let object = context.getValue(input);
	if (object == undefined) {
		return '';
	}

	let pretty = params.get('pretty') ?? false;

	if (pretty) {
		return JSON.stringify(object, undefined, 2);
	} else {
		return JSON.stringify(object);
	}
}
