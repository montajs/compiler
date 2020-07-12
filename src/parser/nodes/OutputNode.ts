import { ParseContext } from '../ParseContext';
import { RenderFn } from '../../Template';
import { Node } from '../Node';
import { Logger } from '../../utils/Logger';

/**
 * A node containing a value that should be printed to the output in plain text
 */
export class OutputNode extends Node {
	/** Value of the node */
	public readonly value : any;

	public constructor(value : any) {
		super();

		this.value = value;
	}

	public async createRenderFunction(parseContext : ParseContext) : Promise<RenderFn> {
		let type = typeof this.value;

		if (type === 'string' || type === 'number' || type === 'boolean') {
			Logger.info('CRF OutputNode');
			let value = this.value.toString();
			return () => value;
		}

		if (this.value instanceof Node) {
			Logger.group('CRF OutputNode');
			let functions = await this.value.createRenderFunction(parseContext);
			Logger.groupEnd();
			return functions;
		}

		Logger.info('CRF OutputNode');
		let value = JSON.stringify(this.value, undefined, 2);
		return () => value;
	}
}
