import { configure, render } from '../../src';

beforeEach(() => {
	configure({
		templateRoot: __dirname,
	});
});

test('base', async () => {
	let rendered = await render('extends-base');
	expect(rendered).toMatchSnapshot();
});

test('nested', async () => {
	let rendered = await render('extends-nested');
	expect(rendered).toMatchSnapshot();
});

test('default block', async () => {
	let rendered = await render('extends-default-block');
	expect(rendered).toMatchSnapshot();
});

test('empty block', async () => {
	let rendered = await render('extends-empty-block');
	expect(rendered).toMatchSnapshot();
});

test('relative', async () => {
	let rendered = await render('extends-relative');
	expect(rendered).toMatchSnapshot();
});
