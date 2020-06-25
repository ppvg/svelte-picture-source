jest.mock('fs', () => ({
	promises: {
		mkdir: jest.fn(() => Promise.resolve()),
		readFile: jest.fn(() => Promise.resolve('INPUT DATA')),
		writeFile: jest.fn(() => Promise.resolve()),
	},
}))

jest.mock('sharp', () => {
	const sharp = jest.fn()
	const resize = jest.fn()
	const toFormat = jest.fn()
	const toBuffer = jest.fn(() => Promise.resolve('CONVERTED DATA'))
	const chain = { resize, toFormat, toBuffer }
	sharp.mockReturnValue(chain)
	resize.mockReturnValue(chain)
	toFormat.mockReturnValue(chain)
	return sharp
})

const { mkdir, readFile, writeFile } = require('fs').promises
const sharp = require('sharp')
const { resize, toFormat, toBuffer } = sharp()

const imageConverter = require('./imageConverter')

afterEach(jest.clearAllMocks)

test('convert image (copy)', async () => {
	const { convert, done } = imageConverter({ staticDir: 'some/testdir/' })
	convert({ input: '/path/to/testfile.jpg', output: '_/converted/image.jpg', width: undefined })
	await done()

	expect(mkdir).toHaveBeenCalledWith('some/testdir/_/converted', { recursive: true })
	expect(readFile).toHaveBeenCalledWith('some/testdir/path/to/testfile.jpg')
	expect(writeFile).toHaveBeenCalledWith('some/testdir/_/converted/image.jpg', 'INPUT DATA')
})

test('convert image (resize)', async () => {
	const { convert, done } = imageConverter({ staticDir: 'some/testdir/' })
	convert({ input: '/path/to/testfile.jpg', output: '_/converted/image.jpg', width: 222 })
	await done()

	expect(mkdir).toHaveBeenCalledWith('some/testdir/_/converted', { recursive: true })
	expect(readFile).toHaveBeenCalledWith('some/testdir/path/to/testfile.jpg')
	expect(writeFile).toHaveBeenCalledWith('some/testdir/_/converted/image.jpg', 'CONVERTED DATA')
	expect(resize).toHaveBeenCalledWith({ width: 222 })
	expect(toFormat).not.toHaveBeenCalled()
})

test('convert image (change format)', async () => {
	const { convert, done } = imageConverter({ staticDir: 'some/testdir/' })
	convert({ input: '/path/to/testfile.jpg', output: '_/converted/image.webp', width: undefined })
	await done()

	expect(mkdir).toHaveBeenCalledWith('some/testdir/_/converted', { recursive: true })
	expect(readFile).toHaveBeenCalledWith('some/testdir/path/to/testfile.jpg')
	expect(writeFile).toHaveBeenCalledWith('some/testdir/_/converted/image.webp', 'CONVERTED DATA')
	expect(resize).not.toHaveBeenCalled()
	expect(toFormat).toHaveBeenCalledWith('webp')
})

test('convert image (resize and change format)', async () => {
	const { convert, done } = imageConverter({ staticDir: 'some/testdir/' })
	convert({ input: '/path/to/testfile.jpg', output: '_/converted/image.png', width: 333 })
	await done()

	expect(mkdir).toHaveBeenCalledWith('some/testdir/_/converted', { recursive: true })
	expect(readFile).toHaveBeenCalledWith('some/testdir/path/to/testfile.jpg')
	expect(writeFile).toHaveBeenCalledWith('some/testdir/_/converted/image.png', 'CONVERTED DATA')
	expect(resize).toHaveBeenCalledWith({ width: 333 })
	expect(toFormat).toHaveBeenCalledWith('png')
})

test('convert same image (deduplicate)', async () => {
	const { convert, done } = imageConverter({ staticDir: 'static' })
	convert({ input: 'one.jpg', output: '_/one.jpg', width: undefined })
	convert({ input: 'other.jpg', output: '_/other.jpg', width: undefined })
	convert({ input: 'one.jpg', output: '_/one.jpg', width: undefined })
	convert({ input: 'other.jpg', output: '_/other.jpg', width: undefined })
	convert({ input: 'other.jpg', output: '_/other.jpg', width: undefined })
	await done()

	expect(mkdir).toHaveBeenCalledTimes(2)
	expect(readFile).toHaveBeenCalledTimes(2)
	expect(writeFile).toHaveBeenCalledTimes(2)
	expect(readFile).toHaveBeenNthCalledWith(1, 'static/one.jpg')
	expect(readFile).toHaveBeenNthCalledWith(2, 'static/other.jpg')
})

test('convert same image (throw when input or width different)', () => {
	const { convert } = imageConverter({ staticDir: 'static' })
	convert({ input: 'source.jpg', output: '_/same.jpg', width: undefined })
	convert({ input: 'source.jpg', output: '_/same.jpg', width: undefined })
	convert({ input: 'source.jpg', output: '_/different.jpg', width: 222 })
	expect(()=>{
		convert({ input: 'source.jpg', output: '_/same.jpg', width: 222 })
	}).toThrow(/^Conflict for output "_\/same.jpg"/)
})
