# @mappable-world/mappable-default-ui-theme package

---

Mappable JS API package

[![npm version](https://badge.fury.io/js/%40mappable-world%2Fmappable-default-ui-theme.svg)](https://badge.fury.io/js/%40mappable-world%2Fmappable-default-ui-theme)
[![npm](https://img.shields.io/npm/dm/@mappable-world/mappable-default-ui-theme.svg)](https://www.npmjs.com/package/@mappable-world/mappable-default-ui-theme)
[![Build Status](https://github.com/mappable-world/mappable-default-ui-theme/workflows/Run%20tests/badge.svg)](https://github.com/mappable-world/@mappable-world/mappable-default-ui-theme/actions/workflows/tests.yml)

## How use

The package is located in the `dist` folder:

- `dist/types` TypeScript types
- `dist/esm` es6 modules for direct connection in your project
- `dist/index.js` Mappable JS Module

Recommended use `@mappable-world/mappable-default-ui-theme` as usual npm package.

### Usage with npm

Install `@mappable-world/mappable-default-ui-theme` package from npm:

```sh
npm install @mappable-world/mappable-default-ui-theme
```

The JS API is loaded dynamically, so the package must be used after the main JS API has loaded:

```js
await mappable.ready; // waiting for the main JS API to load.

// ...

const {MMapDefaultMarker} = await import('@mappable-world/mappable-default-ui-theme');

// ...

map.addChild(new MMapDefaultMarker(props));
```

You also need to import css styles into your project:

```css
/* index.css */
@import '@mappable-world/mappable-default-ui-theme/dist/esm/index.css';
```

### Usage without npm

You can use CDN with module loading handler in JS API on your page.

By default `mappable.import` can load self modules.
Just use `mappable.registerCdn` and `mappable.import`:

```js
// register in `mappable.import` which CDN to take the package from
mappable.import.registerCdn(
  'https://cdn.jsdelivr.net/npm/{package}',
  '@mappable-world/mappable-default-ui-theme@latest'
);

// ...

// import package from CDN
const pkg = await mappable.import('@mappable-world/mappable-default-ui-theme');
```

## More about working with the package

Read more about working with the package in the [documentation](https://mappable-world.github.io/mappable-default-ui-theme/).
