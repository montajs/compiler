export function isPrimitive(value : any) : boolean {
	switch (typeof value) {
		case 'string':
		case 'number':
		case 'boolean':
			return true;
	}

	return false;
}
