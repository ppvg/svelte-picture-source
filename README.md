# svelte-picture-source

This is a [svelte](https://svelte.dev/) component and image optimization [preprocessor](https://svelte.dev/docs#svelte_preprocess). Use the `<PictureSource />` component as you normally would a `<source />`, with one small addition: the `original` attribute. The preprocessor takes the file referenced by `original` and converts and resizes it (using [sharp](https://github.com/lovell/sharp)) to whatever you specify in `srcset`.

```svelte
<picture>
  <PictureSource
    original="puppy.jpg"
    srcset="_/puppy-large.jpg 800w, _/puppy-small.jpg 400w" />
  <img src="puppy.jpg" alt="Adorbable pupper" />
</picture>
```

## When (not) to use

Use this when you're working with static images (i.e. no dynamic filenames) and you want full control over the `<picture>`'s `<source>`s.

If your images are static but you want more convenience instead of control, consider using [svelte-image](https://github.com/matyunya/svelte-image) (which inspired this package). If you have dynamic content, consider using something like [Cloudinary](https://cloudinary.com/).

## How to use

```sh
$ npm install -D svelte-picture-source
```
or
```sh
$ yarn add -D svelte-picture-source
```

### Setup the preprocessor

#### Rollup
```js
import pictureSource from 'svelte-picture-source'
```
```diff
   plugins: [
     svelte({
       dev: !production,
+      preprocess: pictureSource({ staticDir: 'public' }),
     }),
```

#### Webpack
```js
const pictureSource = require('svelte-picture-source')
```
```diff
   {
     test: /\.svelte$/,
       use: {
         loader: 'svelte-loader',
         options: {
           emitCss: true,
           hotReload: true,
+          preprocess: pictureSource({ staticDir: 'public' }),
        },
      },
   },
```

### Render the `<PictureSource>` component

```svelte
<script>
  import { PictureSource } from 'svelte-picture-source'
</script>

<style>
  img {
    width: 100%;
  }
</style>

<picture>
  <PictureSource
    type="image/webp"
    original="puppy.jpg"
    srcset="_/puppy-large.webp 800w, _/puppy-small.webp 400w" />
  <PictureSource
    original="puppy.jpg"
    srcset="_/puppy-large.jpg 800w, _/puppy-small.jpg 400w" />
  <img src="puppy.jpg" alt="Adorbable pupper" />
</picture>
```

The component gets replaced with a native `<source>`, so all of the native attributes are supports and things like [art direction](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Art_direction) are also possible:

```svelte
<picture>
  <PictureSource
    original="vase-narrow.jpg"
    media="(max-width: 699px)"
    srcset="_/vase-narrow-800.jpg 800w, _/vase-narrow-400.jpg 400w" />
  <PictureSource
    original="vase-wide.jpg"
    media="(min-width: 700px)"
    srcset="_/vase-wide-1400.jpg 1400w, _/vase-wide-700.jpg 700w" />
  <img src="vase-wide.jpg" alt="Art-directed vase" />
</picture>
```

## To Do

- [x] write documentation
- [ ] write more documentation
- [ ] add integration tests
- [ ] add function to generate inline [sqip](https://github.com/axe312ger/sqip)-style placeholder images
- [ ] setup automation (ci, renovate, changelog, et cetera)

Up for discussion: support for the density descriptor (e.g. `2x`) and more
control over the sharp conversion (more [resize options](https://sharp.pixelplumbing.com/api-resize), [image operations](https://sharp.pixelplumbing.com/api-operation), [colour manipulation](https://sharp.pixelplumbing.com/api-colour), et cetera).

## Copyright and license

Copyright 2020 Peter-Paul van Gemerden. Released under the [MIT license](https://github.com/ppvg/svelte-picture-source/blob/main/LICENSE).
