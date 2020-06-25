jest.mock('./imageConverter')

const preprocessor = require('./preprocessor')
const imageConverter = require('./imageConverter')

const convert = jest.fn()
const done = jest.fn()
imageConverter.mockReturnValue({ convert, done })

afterEach(jest.clearAllMocks)

test('PictureSource', async () => {
	const { markup } = preprocessor({ staticDir: 'test_static' })
	const result = await markup({
		content: `<script>
	import { PictureSource } from 'svelte-picture-source'
</script>
<picture>
	<PictureSource
		original="something.jpg"
		type="image/webp"
		srcset="_/something-1000.webp 1000w,
		_/something-small.webp 400w" />
	<PictureSource
		original="something.jpg"
		srcset="_/something-1000.jpg 1000w,
		_/something-small.jpg 400w" />
	<img src="something.jpg" alt="Something" />
</picture>`,
	})

	expect(result).toEqual({
		code: `<script>
	
</script>
<picture>
	<source
		
		type="image/webp"
		srcset="_/something-1000.webp 1000w,
		_/something-small.webp 400w" />
	<source
		
		srcset="_/something-1000.jpg 1000w,
		_/something-small.jpg 400w" />
	<img src="something.jpg" alt="Something" />
</picture>`,
	})

	expect(imageConverter).toHaveBeenCalledWith({ staticDir: 'test_static' })
	expect(convert).toHaveBeenCalledTimes(4)
	expect(convert).toHaveBeenNthCalledWith(1, {
		input: 'something.jpg',
		output: '_/something-1000.webp',
		width: 1000,
	})
	expect(convert).toHaveBeenNthCalledWith(2, {
		input: 'something.jpg',
		output: '_/something-small.webp',
		width: 400,
	})
	expect(convert).toHaveBeenNthCalledWith(3, {
		input: 'something.jpg',
		output: '_/something-1000.jpg',
		width: 1000,
	})
	expect(convert).toHaveBeenNthCalledWith(4, {
		input: 'something.jpg',
		output: '_/something-small.jpg',
		width: 400,
	})
})

test('PictureSource (renamed import)', async () => {
	const { markup } = preprocessor()
	const result = await markup({
		content: `<script>
	import { PictureSource as Src } from 'svelte-picture-source'
</script>
<picture>
	<Src original="/image.jpg" srcset="/image-1000w.jpg 1000w, /image-400w.jpg 400w" />
	<img src="/image.jpg" />
</picture>`,
	})

	expect(result).toEqual({
		code: `<script>
	
</script>
<picture>
	<source  srcset="/image-1000w.jpg 1000w, /image-400w.jpg 400w" />
	<img src="/image.jpg" />
</picture>`,
	})
})
