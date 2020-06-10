const parseSrcset = require('./parseSrcset')

test.each([
	['a.jpg', [{ url: 'a.jpg' }]],
	['a.jpg', [{ url: 'a.jpg' }]],
	['a.jpg 100w', [{ url: 'a.jpg', width: 100 }]],
	['a.jpg 2x', [{ url: 'a.jpg', density: 2 }]],
	['a.jpg 3.7e-2x', [{ url: 'a.jpg', density: 0.037 }]],
	['a,100,200.jpg 100w', [{ url: 'a,100,200.jpg', width: 100 }]],
	['a.jpg,b.jpg', [{ url: 'a.jpg,b.jpg' }]],
	['a.jpg 100w, b.jpg', [{ url: 'a.jpg', width: 100 }, { url: 'b.jpg' }]],
	['a.jpg 100w, b.jpg', [{ url: 'a.jpg', width: 100 }, { url: 'b.jpg' }]],
	[
		'a.jpg 100w, b.jpg 200w',
		[
			{ url: 'a.jpg', width: 100 },
			{ url: 'b.jpg', width: 200 },
		],
	],
	[
		'a.jpg 100w, b.jpg 200w',
		[
			{ url: 'a.jpg', width: 100 },
			{ url: 'b.jpg', width: 200 },
		],
	],
	[
		'a.jpg 100w, b.jpg 200w, c.jpg',
		[
			{ url: 'a.jpg', width: 100 },
			{ url: 'b.jpg', width: 200 },
			{ url: 'c.jpg' },
		],
	],
	[
		'   a.jpg  100w, \n  b.jpg  \n ',
		[{ url: 'a.jpg', width: 100 }, { url: 'b.jpg' }],
	],
])('%j → %j', (input, expected) => {
	expect(parseSrcset(input)).toEqual(expected)
})

test.each([['a.jpg invalid'], ['a.jpg 100W'], ['a.jpg 1.5w'], [', a.jpg']])(
	'SyntaxError: "%s"',
	(input) => {
		expect(() => parseSrcset(input)).toThrow(SyntaxError)
	}
)
