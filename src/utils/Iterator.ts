/**
 * Iterates over an array of values
 */
export class Iterator<T> {

	private readonly source : T[];
	private cursor : number = 0;

	/**
	 * Create an iterator
	 *
	 * @param source - The source data
	 */
	public constructor(source : T[]) {
		this.source = source;
	}

	/**
	 * Checks if the source data has remaining entries left
	 */
	public hasNext() : boolean {
		return this.source.length > this.cursor;
	}

	/**
	 * Returns the next entry and advances the cursor
	 *
	 * @throws if the iterator is empty (the cursor has reached the end)
	 */
	public next() : T {
		if (this.cursor === this.source.length) {
			throw new Error('Unexpected end of input');
		}

		let next = this.source[this.cursor];
		this.cursor++;

		return next;
	}

	/**
	 * Advances the cursor without returning characters
	 *
	 * @param count - Number of characters to skip
	 */
	public skip(count : number = 1) : void {
		for (let i = 0; i < count; i++) {
			this.next();
		}
	}

	/**
	 * Returns the next entry without advancing the cursor
	 *
	 * @param offset - Number of entries to step ahead of the next entry
	 */
	public peek(offset : number = 0) : T | undefined {
		if (this.cursor + offset >= this.source.length || this.cursor + offset < 0) {
			return;
		}

		return this.source[this.cursor + offset];
	}

	/**
	 * Like regular peek(), but throws if the next entry doesn't exist (same as next())
	 */
	public requirePeek(offset : number = 0) : T {
		let peek = this.peek(offset);
		if (peek === undefined) {
			throw new Error('Unexpected end of file');
		}

		return peek;
	}

	/**
	 * Like peek, but in the opposite direction
	 */
	public peekBack(offset : number = 1) : T | undefined {
		return this.peek(-offset);
	}

	/**
	 * Checks if the next entries in the iterator match the given data
	 *
	 * @param matcher - Data to match
	 *
	 * @returns True if the next entries match
	 */
	public peekMatch(matcher : T[] | T) : boolean {
		if (!Array.isArray(matcher)) matcher = [matcher];

		for (let [i, element] of matcher.entries()) {
			let peek = this.peek(i);

			if (peek == undefined || peek !== element) {
				return false;
			}
		}

		return true;
	}
}
