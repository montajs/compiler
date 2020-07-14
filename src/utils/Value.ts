export class Value<T> {

	private value : T;

	public constructor(initialValue : T) {
		this.value = initialValue;
	}

	public set(value : T) : void {
		this.value = value;
	}

	public get() : T {
		return this.value;
	}
}
