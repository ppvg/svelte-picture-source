<script context="module">
	/* This component is not supposed to end up in your runtime. */
	console.error(
		'The svelte-picture-source preprocessor did not run. Please check your build process.'
	)
</script>

<script>
	/* If this does end up in your runtime, as a fallback, we render a native
	`<source>` with all of its native attributes. Note that, because the
	preprocessor didn't run, the files referenced by `srcset` may not exist. */
	export let original
	export let srcset
	export let media = undefined
	export let sizes = undefined
	export let type = undefined
	// silence "unused export property" compiler error
	$: original
</script>

<source {media} {sizes} {srcset} {type} />
