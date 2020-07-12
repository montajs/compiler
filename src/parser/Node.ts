import { ParseContext } from './ParseContext';
import { RenderFn } from '../Template';
import { Logger } from '../utils/Logger';

export abstract class Node {
	public constructor() {
		Logger.info('NODE %s', this.constructor.name);
	}

	public abstract createRenderFunction(parseContext : ParseContext, input ? : any) : RenderFn | Promise<RenderFn>;
}
