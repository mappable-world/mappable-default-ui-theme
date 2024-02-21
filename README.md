# @mappable-world/mappable-default-ui-theme package

---

Mappable JS API package

[![npm version](https://badge.fury.io/js/%40mappable-world%2Fmappable-default-ui-theme.svg)](https://badge.fury.io/js/%40mappable-world%2Fmappable-default-ui-theme)
[![npm](https://img.shields.io/npm/dm/@mappable-world/mappable-default-ui-theme.svg)](https://www.npmjs.com/package/@mappable-world/mappable-default-ui-theme)
[![Build Status](https://github.com/mappable-world/@mappable-world/mappable-default-ui-theme/workflows/Run%20tests/badge.svg)](https://github.com/mappable-world/@mappable-world/mappable-default-ui-theme/actions/workflows/tests.yml)

## How use

The package is located in the `dist` folder:

- `dist/types` TypeScript types
- `dist/esm` es6 modules for direct connection in your project
- `dist/index.js` Mappable JS Module

Recommended use `MMapButtonExample` as usual npm package:

```sh
npm i @mappable-world/mappable-default-ui-theme
```

and dynamic import

```js
await mappable.ready;

// ...

const {MMapButtonExample} = await import('@mappable-world/mappable-default-ui-theme');

// ...

map.addChild(new MMapButtonExample(props));
```

### Usage without npm

You can use CDN with module loading handler in JS API on your page.

Just use `mappable.import`:

```js
const pkg = await mappable.import('@mappable-world/mappable-default-ui-theme');
```

By default `mappable.import` can load self modules.
If you want also load your package, should add `loader`:

```js
// Add loader at start loaders array
mappable.import.loaders.unshift(async (pkg) => {
    // Process only your package
    if (!pkg.includes('@mappable-world/mappable-default-ui-theme')) return;

    // Load script directly. You can use another CDN
    await mappable.import.script(`https://unpkg.com/${pkg}/dist/index.js`);

    // Return result object
    return window['@mappable-world/mappable-default-ui-theme'];
});
```
