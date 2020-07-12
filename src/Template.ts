import { RenderContext } from './RenderContext';
import { ParseContext } from './parser/ParseContext';
import { parse } from './parser';

export type RenderFnOutput = string | number | boolean | RenderFn;
export type RenderFn = (context : RenderContext, input ? : any) => RenderFnOutput | RenderFnOutput[] | Promise<RenderFnOutput> | Promise<RenderFnOutput[]>;

export class Template {

	public static async create(filename : string) : Promise<Template> {
		let parseContext = new ParseContext(filename);
		let renderFn = await parse(parseContext);

		return new Template(parseContext, renderFn);
	}

	/** Source file of this template */
	public get file() : string {
		return this.parseContext.file;
	}

	private readonly parseContext : ParseContext;

	/** The root node of the template */
	private readonly renderFn : RenderFn;

	public constructor(parseContext : ParseContext, renderFn : RenderFn) {
		this.parseContext = parseContext;
		this.renderFn = renderFn;
	}

	/**
	 * Renders the template to a string
	 *
	 * @param data - The data to replace
	 */
	public async render(data : Record<string, any>) : Promise<string> {
		let renderContext = new RenderContext(this.file, data);
		return renderContext.render([this.renderFn]);
	}
}
