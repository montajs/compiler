import { MontaFunctionContext } from '../functions';

export function lowercase({ input, context } : MontaFunctionContext) : string {
	if (input === undefined) {
		return '';
	}

	let string : string = context.getValue(input);
	if (string == undefined) {
		return '';
	}

	return string.toLowerCase();
}
