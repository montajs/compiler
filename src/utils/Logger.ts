import { options } from '../options';

export class Logger {
	public static info(...parameters : any[]) : void {
		if (options.debug) {
			console.log(...parameters);
		}
	}

	public static warn(...parameters : any[]) : void {
		console.warn(...parameters); // Always log warnings
	}

	public static error(...parameters : any[]) : void {
		console.error(...parameters); // Always log errors
	}

	public static group(...parameters : any[]) : void {
		if (options.debug) {
			console.group(...parameters);
		}
	}

	public static groupEnd() : void {
		if (options.debug) {
			console.groupEnd();
		}
	}
}
