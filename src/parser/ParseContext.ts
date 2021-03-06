import { Token } from './Token';
import { TokenType } from './TokenType';
import path from "path";
import { options } from '../options';

export class ParseContext {

	/** Full path to the file that is currently being parsed */
	public file : string;

	private data = new Map<string, any>();
	private variables = new Map<string, any>();

	private parent ?: ParseContext;

	public constructor(file : string, parentFile : string = '') {
		this.file = parentFile;
		this.file = this.resolveFilename(file);
	}

	public getData<T>(namespace : string, key : string) : T | undefined {
		return this.data.get(`${ namespace }:${ key }`) as T;
	}

	public setData<T>(namespace : string, key : string, value : T) : void {
		this.data.set(`${ namespace }:${ key }`, value);
	}

	public getVariable<T>(key : string) : T | undefined {
		let value = this.variables.get(key);

		if (value === undefined && this.parent !== undefined) {
			return this.parent.getVariable(key);
		}

		return value as T;
	}

	public setVariable<T>(key : string, value : T) : void {
		this.variables.set(key, value);
	}

	public getValue(ident : Token | undefined) : string | number | boolean | undefined {
		if (ident === undefined) {
			return;
		}

		if (ident.type === TokenType.Literal) {
			return ident.value;
		}

		return this.getVariable(ident.value.toString());
	}

	public createChildContext(file : string) : ParseContext {
		let context = new ParseContext(file, this.file);
		context.parent = this;
		context.data = this.data;
		return context;
	}

	public resolveFilename(filename : string) : string {
		if (!filename.endsWith('.mt')) {
			filename += '.mt';
		}

		if (filename.startsWith('./')) {
			if (this.file.length === 0) {
				return path.resolve(process.cwd(), filename);
			}

			return path.resolve(path.dirname(this.file), filename);
		}

		return path.resolve(options.templateRoot, filename);
	}
}
