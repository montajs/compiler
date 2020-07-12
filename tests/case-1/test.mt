{ extends('base', title = 'extends', test = foo) }

{ block('body'):
	<p>foo = { foo }</p>
	{ component('hello', name = 'foo') }
	<p>yo waddup { name | lower() }</p>
	<p>{ message | truncate(length = 40) | upper() }</p>

	{ items | each():
		<p>{ $index }: { $item }</p>
	:empty:
		<p>No items</p>
	}

	{ items | each():
		<p>{ $index }: { $item: yes :else: no }</p>
	}
}
