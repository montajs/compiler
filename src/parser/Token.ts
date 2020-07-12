import { TokenType } from './TokenType';

export interface Token {
	/** The type of this token */
	type : TokenType;

	/** The token value */
	value : string | number | boolean;

	/** Line number of the token */
	line : number;

	/** Column number of the token */
	col : number;
}


export function isTokenType(token : Token, ...types : TokenType[]) : boolean {
	for (let type of types) {
		if (token.type === type) {
			return true;
		}
	}

	return false;
}
