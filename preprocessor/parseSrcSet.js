// See https://html.spec.whatwg.org/multipage/images.html#srcset-attributes
// This is pretty janky and inefficient. TODO: refactor to manual parser.
const whitespace = /[\t\n\f\r ]+/ // TAB, LF, FF, CR, or SPACE
const separator = /,[\t\n\f\r ]+/
const width = /^\d+w$/
const density = /^-?(\d+|\d*\.\d+)([eE][+-]?\d+)?x$/
module.exports = (input) =>
	input.split(separator).map((entry) => {
		const [url, descriptor] = entry.trim().split(whitespace)
		if (!url) {
			throw new SyntaxError('empty candidate')
		}
		if (!descriptor) {
			return { url }
		}
		if (width.test(descriptor)) {
			return { url, width: Number(descriptor.slice(0, -1)) }
		}
		if (density.test(descriptor)) {
			return { url, density: Number(descriptor.slice(0, -1)) }
		}
		throw new SyntaxError(`invalid descriptor "${descriptor}"`)
	})
