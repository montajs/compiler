import { configure, render } from '../../src';

beforeEach(() => {
	configure({
		templateRoot: __dirname,
	});
});

test('true / true / true', async () => {
	let rendered = render('implicit-if', { one: true, two: true, three: true });
	await expect(rendered).resolves.toMatchSnapshot();
});

test('false / true / true', async () => {
	let rendered = render('implicit-if', { one: false, two: true, three: true });
	await expect(rendered).resolves.toMatchSnapshot();
});

test('true / false / true', async () => {
	let rendered = render('implicit-if', { one: true, two: false, three: true });
	await expect(rendered).resolves.toMatchSnapshot();
});

test('true / true / false', async () => {
	let rendered = render('implicit-if', { one: true, two: true, three: false });
	await expect(rendered).resolves.toMatchSnapshot();
});

test('false / false / true', async () => {
	let rendered = render('implicit-if', { one: false, two: false, three: true });
	await expect(rendered).resolves.toMatchSnapshot();
});

test('true / false / false', async () => {
	let rendered = render('implicit-if', { one: true, two: false, three: false });
	await expect(rendered).resolves.toMatchSnapshot();
});

test('false / true / false', async () => {
	let rendered = render('implicit-if', { one: false, two: true, three: false });
	await expect(rendered).resolves.toMatchSnapshot();
});

test('false / false / false', async () => {
	let rendered = render('implicit-if', { one: false, two: false, three: false });
	await expect(rendered).resolves.toMatchSnapshot();
});
