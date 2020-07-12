import MultiMap from '@woubuc/multimap';

import { block } from './parserFunctions/block';
import { define } from './parserFunctions/define';
import { include } from './parserFunctions/include';
import { component } from './parserFunctions/component';
import { capitalise } from './runtimeFunctions/capitalise';
import { lowercase } from './runtimeFunctions/lowercase';
import { uppercase } from './runtimeFunctions/uppercase';
import { forEach } from './runtimeFunctions/forEach';
import { truncate } from './runtimeFunctions/truncate';
import { conditionalIf } from './runtimeFunctions/if';
import { attr } from './parserFunctions/attr';
import { RenderContext } from '../RenderContext';
import { Token } from '../parser/Token';
import { Node } from '../parser/Node';
import { ParseContext } from '../parser/ParseContext';
import { RenderFn } from '../Template';
import { extend } from './parserFunctions/extend';

export interface MontaFunctionContext {
	input ? : any;
	params : Map<string, Token>;
	blocks : MultiMap<string, RenderFn>;
	context : RenderContext;
}

export interface MontaParserFunctionContext {
	input ?: any;
	params : Map<string, Token>;
	blocks : MultiMap<string, RenderFn>;
	context : ParseContext;
}

export type MontaFunction = (data : MontaFunctionContext) => any | Promise<any>;
export type MontaParserFunction = (data : MontaParserFunctionContext) => Node[] | RenderFn[] | Promise<Node[] | RenderFn[]>;

export const runtimeFunctions = new Map<string, MontaFunction>();
export const parserFunctions = new Map<string, MontaParserFunction>();

export function registerFunction(name : string, fn : MontaFunction) : void {
	runtimeFunctions.set(name, fn);
}

export function registerParserFunction(name : string, fn : MontaParserFunction) : void {
	parserFunctions.set(name, fn);
}

registerFunction('if', conditionalIf);
registerFunction('each', forEach);
registerFunction('foreach', forEach);


registerFunction('capitalise', capitalise);
registerFunction('lower', lowercase);
registerFunction('lowercase', lowercase);
registerFunction('upper', uppercase);
registerFunction('uppercase', uppercase);
registerFunction('truncate', truncate);


registerParserFunction('define', define);
registerParserFunction('block', block);

registerParserFunction('extend', extend);
registerParserFunction('extends', extend);
registerParserFunction('include', include);
registerParserFunction('component', component);
registerParserFunction('attr', attr);


