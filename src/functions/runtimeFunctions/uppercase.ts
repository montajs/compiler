import { MontaFunctionContext } from '../functions';

export function uppercase({ input, context } : MontaFunctionContext) : string {
	if (input === undefined) {
		return '';
	}

	let string : string = context.getValue(input);
	if (string == undefined) {
		return '';
	}

	return string.toUpperCase();
}
