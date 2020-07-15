import { configure, render } from '../../src';

// TODO separate this single test file into multiple focused tests
test('render test file', async () => {
	configure({
		templateRoot: __dirname,
	});

	let output = render('test.mt', {
		foo: 'bar',
		name: 'world',
		message: 'this is a rather long message that we can use to test the built-in truncate function',
		items: ['a', 'b', false],
	});

	expect(output).toBeInstanceOf(Promise);

	await expect(output).resolves.toBeTruthy();
	await expect(output).resolves.toMatchSnapshot();
});
