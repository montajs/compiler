export interface MontaOptions {
	/**
	 * Directory containing the Monta templates
	 *
	 * When rendering a template file with a relative path, it will be looked up
	 * in this directory. Relative paths will be resolved from the current
	 * working directory.
	 *
	 * @default ./views
	 */
	templateRoot : string;

	/**
	 * Set to false to disable caching templates
	 *
	 * @default process.env.NODE_ENV !== 'development'
	 */
	cache : boolean;

	/**
	 * Maximum number of templates to keep in cache
	 *
	 * Whenever a Monta template file is rendered, the parsed template is cached
	 * to speed up subsequent rendering. This may consume several megabytes of
	 * working memory, depending on the number of templates. Set this value to
	 * limit the number of templates in the cache.
	 *
	 * It is recommended to keep this set to the default value of Infinity, unless
	 * you experience memory problems.
	 *
	 * @default Infinity
	 */
	cacheLimit : number;

	/**
	 * Set to true to enable debug logging
	 *
	 * Do not use in production, this option logs a lot of unnecessary detail.
	 *
	 * @default false
	 */
	debug : boolean;
}
