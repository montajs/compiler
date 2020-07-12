import { scan } from './scan';

test('scan single section', () => {
	let sections = scan('foo');

	expect(sections).toHaveLength(1);
	expect(typeof sections[0]).toBe('object');

	expect(sections[0]).toHaveProperty('isCode', false);
	expect(sections[0]).toHaveProperty('line', 1);
	expect(sections[0]).toHaveProperty('col', 1);
	expect(sections[0]).toHaveProperty('content', 'foo');
});

test('scan single code section', () => {
	let sections = scan('{ foo }');

	expect(sections).toHaveLength(1);
	expect(typeof sections[0]).toBe('object');

	expect(sections[0]).toHaveProperty('isCode', true);
	expect(sections[0]).toHaveProperty('line', 1);
	expect(sections[0]).toHaveProperty('col', 2);
	expect(sections[0]).toHaveProperty('content', ' foo ');
});

test('scan multiple sections', () => {
	let sections = scan('foo { bar } baz');

	expect(sections).toHaveLength(3);
	expect(typeof sections[0]).toBe('object');
	expect(typeof sections[1]).toBe('object');
	expect(typeof sections[2]).toBe('object');

	expect(sections[0]).toHaveProperty('isCode', false);
	expect(sections[0]).toHaveProperty('line', 1);
	expect(sections[0]).toHaveProperty('col', 1);
	expect(sections[0]).toHaveProperty('content', 'foo ');

	expect(sections[1]).toHaveProperty('isCode', true);
	expect(sections[1]).toHaveProperty('line', 1);
	expect(sections[1]).toHaveProperty('col', 6);
	expect(sections[1]).toHaveProperty('content', ' bar ');

	expect(sections[2]).toHaveProperty('isCode', false);
	expect(sections[2]).toHaveProperty('line', 1);
	expect(sections[2]).toHaveProperty('col', 12);
	expect(sections[2]).toHaveProperty('content', ' baz');
});

test('do not scan empty sections', () => {
	let sections = scan('');

	expect(sections).toHaveLength(0);
});

test('scan nested sections', () => {
	let sections = scan('{ foo: bar }');

	expect(sections).toHaveLength(1);

	expect(sections[0].children.has('default')).toBeTruthy();
	expect(sections[0].children.get('default')).toHaveLength(1);
});
