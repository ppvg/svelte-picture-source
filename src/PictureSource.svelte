<script>
	/* This component is not supposed to end up in your runtime. Normally, the
	preprocessor would replace it with a native <source>, converting/resizing the
	file referenced by the custom `original` prop to generate the files in
	`srcset`. */
	export let original
	console.error(
		`Error: <PictureSource original="${original}" ... /> was not converted by the svelte-picture-source preprocessor. Please check your build process.`
	)

	/* If this does end up in your runtime, as a fallback, we render a native
	`<source>` with all of its native attributes. Note that the files referenced
	by `srcset` may not exist. */
	export let media
	export let sizes
	export let srcset
	export let type
</script>

<source {media} {sizes} {srcset} {type} />
