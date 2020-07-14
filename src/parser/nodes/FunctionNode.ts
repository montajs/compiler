import { Token } from '../Token';
import MultiMap from '@woubuc/multimap';
import { ParseContext } from '../ParseContext';
import { RenderFn, RenderFnOutput } from '../../Template';
import { MontaFunction, parserFunctions, runtimeFunctions } from '../../functions/functions';
import { Node } from '../Node';
import { RenderContext } from '../../RenderContext';
import { Logger } from '../../utils/Logger';

/**
 * A node containing a function that needs to be executed
 */
export class FunctionNode extends Node {
	/** Name of the function */
	public readonly keyword : Token;

	/** Function input, if it has its own input */
	public input ? : Token;

	/** Function parameters */
	public params = new Map<string, Token>();

	/** Blocks belonging to this function */
	public blocks = new MultiMap<string, Node>();

	public constructor(keyword : Token) {
		super();

		this.keyword = keyword;
	}

	public async createRenderFunction(parseContext : ParseContext) : Promise<RenderFn> {
		Logger.group('CRF FunctionNode');
		Logger.info('| name: %s()', this.keyword.value);
		Logger.info('| input:', this.input ?? '<none>');
		for (let [k, v] of this.params.entries()) {
			Logger.info('| param:', k, '=', v);
		}

		Logger.info('| blocks: [%s]', [...this.blocks.keys()].join(', '));

		let blocks = new MultiMap<string, RenderFn>();
		if (this.blocks.flatSize > 0) {
			Logger.info('Creating render functions for blocks...');
			Logger.group();
			for (let [blockName, blockNodes] of this.blocks.entries()) {
				blocks.delete(blockName);
				for (let node of blockNodes) {
					blocks.push(blockName, await node.createRenderFunction(parseContext));
				}
			}
			Logger.groupEnd();
		}

		let functionName = this.keyword.value.toString();
		let parserFunction = parserFunctions.get(functionName);

		if (parserFunction !== undefined) {
			Logger.info('| type: parser');
			Logger.info('| function: %s()', parserFunction.name);
			Logger.group('FUNC %s', functionName);
			let result = await parserFunction({
				context: parseContext,
				input: this.input,
				params: this.params,
				blocks,
			});
			Logger.groupEnd();

			let functions : RenderFn[] = [];

			for (let item of result) {
				if (item instanceof Node) {
					functions.push(await item.createRenderFunction(parseContext));
				} else {
					functions.push(item);
				}
			}

			Logger.groupEnd();
			return (renderContext) => renderContext.render(functions);
		}

		Logger.info('| type: runtime');
		let runtimeFunction = runtimeFunctions.get(functionName);

		if (runtimeFunction === undefined) {
			throw new Error(`Call to unregistered function: ${ functionName }`);
		}

		Logger.groupEnd();
		return renderFunctionNode.bind(undefined, runtimeFunction, functionName, {
			input: this.input,
			params: this.params,
			blocks,
		});
	}
}

async function renderFunctionNode(
	fn : MontaFunction,
	name : string,
	options : { input ? : Token, params : Map<string, Token>, blocks : MultiMap<string, RenderFn> },
	renderContext : RenderContext,
	input : any,
) : Promise<RenderFnOutput> {
	Logger.group('RENDER FunctionNode');
	Logger.info('| name: %s()', name);
	Logger.info('| function: %s()', fn.name);

	Logger.group('FUNC %s', name);
	let result = await fn({
		context: renderContext,
		input: options.input ?? input,
		params: options.params,
		blocks: options.blocks,
	});
	Logger.groupEnd();

	let rendered : string;
	if (Array.isArray(result)) {
		rendered = await renderContext.render(result);
	} else {
		rendered = await renderContext.render([result]);
	}

	Logger.groupEnd();

	return rendered;
}
