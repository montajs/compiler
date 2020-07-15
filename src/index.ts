import { Template } from './Template';

export { registerParserFunction, registerFunction } from './functions/functions';
export { configure } from './options';
export { parse } from './parser';
export { Template } from './Template';

export async function render(filename : string, data : Record<string, any> = {}) : Promise<string> {
	let template = await Template.create(filename);
	return template.render(data);
}
