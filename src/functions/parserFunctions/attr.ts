import { MontaParserFunctionContext } from '../functions';
import { RenderFn } from '../../Template';
import { Token } from '../../parser/Token';
import { TokenType } from '../../parser/TokenType';
import { RenderContext } from '../../RenderContext';

export function attr({ input, params, context } : MontaParserFunctionContext) : RenderFn[] {
	if (input === undefined) {
		return [];
	}

	let varName = context.getValue(input);

	if (varName === undefined) {
		throw new Error('Invalid input for attr: ' + input.value);
	}

	let name = varName.toString();
	let value = context.getData<Token>('attr', name);

	let required = Boolean(context.getValue(params.get('required')) ?? false);
	if (required && value === undefined) {
		throw new Error('Undefined attr: ' + input.value);
	}

	if (value === undefined) {
		return [];
	}

	let type = context.getValue(params.get('type'))?.toString();
	if (type !== undefined) {
		if (value.type === TokenType.Literal && typeof value.value !== type) {
			throw new Error('Invalid attr type for ' + input.value + ', expected ' + type + ' got ' + typeof value);
		}
	}

	if (value.type === TokenType.Literal) {
		return [assignAttributeLiteral.bind(null, name, value.value)];
	}

	return [validateAttribute.bind(null, name, value, required, type)];
}

function assignAttributeLiteral(name : string, value : any, renderContext : RenderContext) : string[] {
	renderContext.setVariable(name, value);
	return [];
}

function validateAttribute(name : string, token : Token, required : boolean, type : string | undefined, renderContext : RenderContext) : string[] {
	let value = renderContext.getValue(token);

	if (required && value === undefined) {
		throw new Error('Undefined attr: ' + name);
	}

	if (type !== undefined && typeof value !== type) {
		throw new Error('Invalid attr type for ' + name + ', expected ' + type + ' got ' + typeof value);
	}

	renderContext.setVariable(name, renderContext.getValue(token));
	return [];
}
