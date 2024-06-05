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

Recommended use `@mappable-world/mappable-default-ui-theme` as usual npm package:

```sh
npm install @mappable-world/mappable-default-ui-theme
```

and dynamic import

```js
await mappable.ready;

// ...

const {MMapZoomControl} = await import('@mappable-world/mappable-default-ui-theme');

// ...

map.addChild(new MMapDefaultMarker(props));
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
