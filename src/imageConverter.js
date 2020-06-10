const { join, basename, dirname, extname } = require('path')
const { readFile, writeFile, mkdir } = require('fs').promises
const sharp = require('sharp')

module.exports = ({ staticDir }) => {
	const conversions = new Map()

	const convert = (convertable) => {
		const { input, output, width } = convertable
		const inputFilename = join(staticDir, input)
		const outputFilename = join(staticDir, output)
		const existing = conversions.get(outputFilename)
		if (existing) {
			if (isConflict(existing, convertable)) {
				throw new ConflictError(existing, convertable)
			}
			return
		}
		const promise = convertImage(inputFilename, outputFilename, width)
		conversions.set(outputFilename, { input, width, promise })
	}

	const done = () =>
		Promise.all(Array.from(conversions.values()).map(({ promise }) => promise))

	return { convert, done }
}

async function convertImage(source, target, width) {
	const sourceData = readFile(source)
	await mkdir(dirname(target), { recursive: true })
	let targetData = sourceData
	const targetFormat = getFormat(target)
	const formatChanged = targetFormat !== getFormat(source)
	if (width || formatChanged) {
		targetData = sharp(await sourceData)
		if (width) targetData = targetData.resize({ width })
		if (formatChanged) targetData = targetData.toFormat(targetFormat)
		targetData = targetData.toBuffer()
	}
	await writeFile(target, await targetData)
}

function isConflict(existing, convertable) {
	return (
		existing.input !== convertable.input || existing.width !== convertable.width
	)
}

class ConflictError extends Error {
	constructor(existing, convertable) {
		const have = formatConflict(existing)
		const got = formatConflict(convertable)
		super(
			`Conflict for output "${convertable.output}": got ${got} but already have ${have}.`
		)
		this.name = this.constructor.name
		Error.captureStackTrace(this, this.constructor)
	}
}

function formatConflict({ input, width }) {
	return width ? `"${input}" at ${width}w` : `"${input}"`
}

function getFormat(filename) {
	const format = extname(filename).slice(1).toLowerCase()
	if (format === 'jpeg' || format === 'jpg') {
		return 'jpg'
	}
	if (format === 'png' || format === 'webp') {
		return format
	}
	throw new Error(`Unsupported format: "${basename(filename)}"`)
}
