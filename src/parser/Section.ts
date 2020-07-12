import MultiMap from '@woubuc/multimap';
import { SourceIterator } from '../utils/SourceIterator';

/**
 * A section in the source code
 */
export interface Section {
	/** True if this is code, false if plain text */
	isCode : boolean;

	/** Unique sequential section index in the document, starting at 0 for the first section in the document */
	index : number;

	/** Line number */
	line : number;

	/** Column number */
	col : number;


	/** Content of the section */
	content : string;

	/**
	 * Section children, grouped by block name
	 *
	 * Only code sections (`isCode == true`) can contain children.
	 */
	children : MultiMap<string, Section>;
}

/**
 * Creates a new source iterator for the contents of the given section
 *
 * @param section - The section to iterate over
 */
export function createSectionIterator(section : Section) : SourceIterator {
	return new SourceIterator(section.content, section.line, section.col);
}
