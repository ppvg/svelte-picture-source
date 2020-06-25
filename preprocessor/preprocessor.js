const { parse, walk } = require('svelte/compiler')
const MagicString = require('magic-string')
const pkg = require('../package.json')
const imageConverter = require('./imageConverter')
const parseSrcset = require('./parseSrcset')

const defaultOptions = { staticDir: 'static/' }

module.exports = (options) => {
	const { convert, done } = imageConverter({ ...defaultOptions, ...options })

	return {
		markup: async ({ content }) => {
			const { imports, sources } = parseSource(content)
			for (const source of sources) {
				for (const candidate of source.srcset.candidates) {
					convert({
						input: source.original.value,
						output: candidate.url,
						width: candidate.width,
					})
				}
			}
			await done()
			const code = transformCode({ content, imports, sources })
			return { code }
		},
	}
}

function parseSource(content) {
	const ast = parse(content)
	const imports = []
	const sources = []
	const locals = {}

	walk(ast.instance && ast.instance.content, {
		enter: function (node) {
			if (node.type === 'ImportDeclaration' && node.source.value === pkg.name) {
				imports.push(node)
				for (const { imported, local } of node.specifiers) {
					locals[local.name] = imported.name
				}
			}
		},
	})

	walk(ast, {
		enter: function (node) {
			if (isSource(locals, node)) {
				const original = getTextAttribute(node, 'original')
				const srcset = getTextAttribute(node, 'srcset')
				srcset.candidates = parseSrcset(srcset.value)
				sources.push({ node, original, srcset })
			}
		},
	})

	return { imports, sources }
}

function isSource(locals, node) {
	return (
		node.type === 'InlineComponent' && locals[node.name] === 'PictureSource'
	)
}

function getTextAttribute(node, name) {
	const attribute = node.attributes.find((attribute) => attribute.name === name)
	if (!attribute) {
		throw new Error(`Missing ${name} attribute`)
	}
	const value = attribute.value[0]
	if (value.type !== 'Text') {
		throw new Error(`Dynamic ${name} attribute is not supported`)
	}
	if (!value.data) {
		throw new Error(`Empty ${name} attribute`)
	}
	return { attribute, value: value.data }
}

function transformCode({ content, imports, sources }) {
	const code = new MagicString(content)
	removeImports(code, imports)
	replacePictureSources(code, sources)
	return code.toString()
}

function removeImports(content, imports) {
	for (const node of imports) {
		content.overwrite(node.start, node.end, '')
	}
}

function replacePictureSources(content, sources) {
	for (const { node, original } of sources) {
		// change tag to <source/>
		const start = node.start + 1
		const end = start + node.name.length
		content.overwrite(start, end, 'source')
		// remove `original` prop
		content.overwrite(original.attribute.start, original.attribute.end, '')
	}
}

function debug(...args) {
	console.log(...args.map((arg) => JSON.stringify(arg, null, 2)))
}
