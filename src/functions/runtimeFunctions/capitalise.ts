import { MontaFunctionContext } from '../functions';

export function capitalise({ input, context } : MontaFunctionContext) : string {
	if (input === undefined) {
		return '';
	}

	let string : string = context.getValue(input);
	if (string == undefined) {
		return '';
	}

	return string
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}
