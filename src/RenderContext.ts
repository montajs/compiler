import { TokenType } from './parser/TokenType';
import { Token } from './parser/Token';
import { RenderFn } from './Template';

export type Renderable = string | number | boolean | Record<string, any> | undefined | RenderFn;

export class RenderContext {

	/** Full path to the file that is currently being parsed */
	public file : string;

	private parent ? : RenderContext;
	private root : RenderContext;

	private variables : Record<string, any>;
	private data = new Map<string, any>();

	public constructor(file : string, variables : Record<string, any> = {}) {
		this.file = file;
		this.variables = variables;

		this.root = this;
	}

	public getData<T>(namespace : string, key : string) : T | undefined {
		return this.data.get(`${ namespace }:${ key }`);
	}

	public setData<T>(namespace : string, key : string, value : T) : void {
		this.data.set(`${ namespace }:${ key }`, value);
	}

	public getVariable(path : string) : any | undefined {
		if (path === '.' || path === 'this') {
			return this.variables;
		}

		let data : any = this.variables;

		let keys = path.split('.');

		if (keys[0] === 'this' || keys[0] === '') {
			keys.shift();
		}

		let scopeChanged = false;

		if (keys[0] === '$parent') {
			if (!this.parent) throw new Error('Current scope has no parent scope');

			scopeChanged = true;
			data = this.parent.data;
			keys.shift();
		}

		if (keys[0] === '$root') {
			scopeChanged = true;
			data = this.root.data;
			keys.shift();
		}

		if (!scopeChanged && typeof this.data !== 'object') {
			throw new Error(`Cannot get property '${ path }' of primitive value '${ this.data }'`);
		}

		while (keys.length > 0) {
			let key = keys.shift() as string;

			if (data === undefined) {
				break;
			}

			data = data[key];
		}

		if (data === undefined) {
			return this.parent?.getVariable(path);
		}

		return data;
	}

	public setVariable(key : string, value : any) : void {
		this.variables[key] = value; // TODO handle '.' paths
	}

	public getValue(ident : Token | undefined) : any | undefined {
		if (ident === undefined) {
			throw new Error('undefined ident');
		}

		let type = typeof ident;
		if (type === 'string' || type === 'number' || type === 'boolean') {
			return ident;
		}

		if (ident.type === TokenType.Literal) {
			return ident.value;
		}

		return this.getVariable(ident.value.toString());
	}

	public createChildContext(file ? : string) : RenderContext {
		let context = new RenderContext(file ?? this.file, this.variables);
		context.data = this.data;
		context.parent = this;
		return context;
	}

	public async render(render : Renderable[]) : Promise<string> {
		let rendered : Renderable[] = render;
		let isValid = false;

		while (!isValid) {
			isValid = true;

			rendered = await Promise.all(rendered.flat().map(child => {
				let type = typeof child;

				if (type === 'string') {
					return child;
				}

				if (child instanceof Function) {
					isValid = false;
					return child(this);
				}

				if (child === undefined) {
					return 'undefined';
				}

				if (type === 'number') {
					return child.toString();
				}

				if (type === 'boolean') {
					return child ? 'true' : 'false';
				}

				if (type === 'object') {
					return JSON.stringify(child, undefined, 2);
				}

				throw new Error('Not renderable: ' + child);
			}));
		}

		return rendered.join('');
	}
}
