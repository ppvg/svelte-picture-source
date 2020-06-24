# svelte-picture-source

## What is this?

This is a [svelte](https://svelte.dev/) component and [preprocessor](https://svelte.dev/docs#svelte_preprocess). You use the `<PictureSource />` component as you normally would a `<source />`, with one small addition: the `original` attribute. The preprocessor takes the file references by `original` and converts and resizes it to whatever you specify in `srcset`.

```svelte
<picture>
  <PictureSource
    original="puppy.jpg"
    srcset="_/puppy_large 800w, _/puppy_small 400w" />
  <img src="puppy.jpg" alt="Adorbable pupper" />
</picture>
```

Inspired by [matyunya/svelte-image](https://github.com/matyunya/svelte-image), but at a slightly lower abstraction level.

## To do

- [ ] write documentation
- [ ] add better integration tests
- [ ] add function to generate inline [sqip](https://github.com/axe312ger/sqip)-style placeholder images
- [ ] setup automation (ci, renovate, changelog, et cetera)

## Copyright and license

Copyright 2020 Peter-Paul van Gemerden. Released under the [MIT license](https://github.com/ppvg/svelte-picture-source/blob/main/LICENSE).
