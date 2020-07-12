import { options } from '../options';

export class Logger {
	public static info(...parameters : any[]) {
		if (options.debug) {
			console.log(...parameters);
		}
	}

	public static warn(...parameters : any[]) {
		console.warn(...parameters); // Always log warnings
	}

	public static error(...parameters : any[]) {
		console.error(...parameters); // Always log errors
	}

	public static group(...parameters : any[]) {
		if (options.debug) {
			console.group(...parameters);
		}
	}

	public static groupEnd() {
		if (options.debug) {
			console.groupEnd();
		}
	}
}
