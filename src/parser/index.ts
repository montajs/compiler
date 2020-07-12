import { readFile } from 'fs-extra';

import { ParseContext } from './ParseContext';
import { scan } from './scan';
import { parseSection } from './parse';
import { GroupNode } from './nodes/GroupNode';
import { RenderFn } from '../Template';
import { Logger } from '../utils/Logger';

/**
 * Parses the source code from a given parser context
 *
 * @param parseContext - The parser context
 */
export async function parse(parseContext : ParseContext) : Promise<RenderFn> {
	Logger.group('READ');
	Logger.info('| filename: %s', parseContext.file);
	let code = await readFile(parseContext.file, 'utf-8');
	Logger.info('| length: %d', code.length);
	Logger.groupEnd();

	Logger.group('SCAN');
	let sections = scan(code);
	Logger.groupEnd();

	Logger.group('PARSE');
	Logger.info('| sections: %d', sections.length);
	let rootNode = new GroupNode();

	for (let section of sections) {
		rootNode.children.push(...parseSection(section));
	}
	Logger.groupEnd();

	Logger.group('PREPARE');
	let functions = await rootNode.createRenderFunction(parseContext);
	Logger.groupEnd();

	return functions;
}
