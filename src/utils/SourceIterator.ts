import { Iterator } from './Iterator';

export class SourceIterator extends Iterator<string> {

	public line : number;
	public col : number;

	public constructor(source : string);
	public constructor(source : string, line : number, col : number);
	public constructor(source : string, line : number = 1, col : number = 1) {
		super(source.split(''));

		this.line = line;
		this.col = col;
	}

	public next() : string {
		let next = super.next();

		if (next === '\n') {
			this.line++;
			this.col = 1;
		} else {
			this.col++;
		}

		return next;
	}

	public peekMatch(matcher : string) : boolean {
		if (matcher.length === 1) {
			return this.peek() === matcher;
		}

		return super.peekMatch(matcher.split(''));
	}

	public skipWhitespace() : void {
		while (this.hasNext()) {
			let peek = this.peek()!;

			if (/\s/.test(peek)) {
				this.skip();
			} else {
				return;
			}
		}
	}
}
