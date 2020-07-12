import path from 'path';

import { MontaOptions } from './MontaOptions';

export let options : MontaOptions = {
	templateRoot: process.cwd(),

	cache: process.env.NODE_ENV !== 'development',
	cacheLimit: Infinity,

	debug: false,
};

export function configure(config : Partial<MontaOptions>) : void {
	if (config.templateRoot !== undefined) {
		options.templateRoot = path.resolve(config.templateRoot);
	}

	if (config.cache !== undefined) {
		options.cache = Boolean(config.cache);
	}

	if (config.cacheLimit !== undefined && Number.isInteger(config.cacheLimit)) {
		options.cacheLimit = config.cacheLimit;
	}

	if (config.debug !== undefined) {
		options.debug = Boolean(config.debug);
	}
}
