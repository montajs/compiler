import { MontaFunctionContext } from '../functions';

export function truncate({ input, context, params } : MontaFunctionContext) : string {
	if (input === undefined) {
		return '';
	}

	let string : string = context.getValue(input);
	if (string == undefined) {
		return '';
	}

	let length = params.get('length');
	if (length === undefined) {
		return string;
	}

	let max = context.getValue(length);
	if (string.length > max) {
		return string.slice(0, max - 3) + '...';
	}

	return string;
}
