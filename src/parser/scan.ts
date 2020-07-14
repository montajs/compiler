import MultiMap from '@woubuc/multimap';

import { SourceIterator } from '../utils/SourceIterator';
import { Section } from './Section';
import { Logger } from '../utils/Logger';

/**
 * Goes through template source code and creates a section tree to separate code from literal template content
 *
 * @param code - The source code
 *
 * @returns The scanned section tree
 */
export function scan(code : string) : Section[] {
	let source = new SourceIterator(code);

	let sections : Section[] = [];

	while (source.hasNext()) {
		sections.push(...scanPlainTextSection(source).get('default'));
	}

	return sections;
}


/**
 * Scans a plain text section and returns the found sections for each function block
 *
 * @param source  - The code source
 * @param isBlock - Set to true if parsing plain text inside a block
 */
function scanPlainTextSection(source : SourceIterator, isBlock : boolean = false) : MultiMap<string, Section> {
	let sections = new MultiMap<string, Section>();

	let currentSection = newSection(source);
	let currentBlockName = 'default';

	while (source.hasNext()) {
		let next = source.next();

		let escaped = false;
		if (next === '\\' && (
			source.peekMatch('{') ||
			source.peekMatch('\\') ||
			(isBlock && source.peekMatch('}')) ||
			(isBlock && source.peekMatch(':'))
		)) {
			escaped = true;
			next = source.next();
		}

		// Start of a code section
		if (next === '{' && !escaped) {
			if (currentSection.content.length > 0) {
				sections.push(currentBlockName, currentSection);
			}

			sections.push(currentBlockName, scanCodeSection(source));
			currentSection = newSection(source);
			continue;
		}

		// End of a function block (when in a block)
		if (isBlock && next === '}' && !escaped) {
			if (currentSection.content.length > 0) {
				sections.push(currentBlockName, currentSection);
			}

			return sections;
		}

		// New block name (when in a block)
		if (isBlock && next === ':' && !escaped) {
			let { name, isValid } = getBlockName(source);

			if (isValid) {
				if (currentSection.content.length > 0) {
					sections.push(currentBlockName, currentSection);
				}

				currentSection = newSection(source);
				currentBlockName = name;
			} else {
				currentSection.content += name;
			}

			continue;
		}

		currentSection.content += next;
	}

	if (currentSection.content.length > 0) {
		sections.push(currentBlockName, currentSection);
	}

	return sections;
}

/**
 * Scans a code section until the end and returns the section
 *
 * @param source - The code source
 */
function scanCodeSection(source : SourceIterator) : Section {
	let currentSection = newSection(source, true);
	let indentLevel = 1;

	while (source.hasNext()) {
		let next = source.next();

		// End of the code section
		if (next === '}') {
			indentLevel--;

			if (indentLevel === 0) {
				return currentSection;
			}
		}

		// Start of a block
		if (next === ':') {
			currentSection.children = scanPlainTextSection(source, true);
			return currentSection;
		}

		currentSection.content += next;
	}

	throw new Error(`Unexpected end of file (code section started at ${ currentSection.col }:${ currentSection.line })`);
}

/**
 * Gets the name of a block in plain text
 *
 * @param source - The code source
 *
 * @returns name    - The found name
 * @returns isValid - True if this is a valid block name
 */
function getBlockName(source : SourceIterator) : { name : string, isValid : boolean } {
	let name = '';

	while (source.hasNext()) {
		let char = source.next();

		// End of the name
		if (char === ':' && name.length > 0) {
			return { name, isValid: true };
		}

		// A block name can only contain letters, otherwise it's not a valid name
		if (!/[a-z]/i.test(char)) {
			return { name: name + char, isValid: false };
		}

		name += char;
	}

	return { name, isValid: false };
}


let sectionIndex = -1;

/**
 * Creates a new section at the current position of the source iterator
 *
 * @param source - The code source
 * @param isCode - True if this is a code section
 */
function newSection(source : SourceIterator, isCode : boolean = false) : Section {
	let index = ++sectionIndex;

	Logger.info('SEC %d: %s (%d:%d)', index, isCode ? 'code' : 'plain text', source.line, source.col);
	return {
		isCode,
		index,
		content: '',
		line: source.line,
		col: source.col,
		children: new MultiMap(),
	};
}
