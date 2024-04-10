mappable.import.loaders.unshift(async (pkg) => {
    if (!pkg.startsWith('@mappable-world/mappable-default-ui-theme')) {
        return;
    }

    if (location.href.includes('localhost')) {
        await mappable.import.script(`/dist/index.js`);
    } else {
        await mappable.import.script(`https://unpkg.com/${pkg}/dist/index.js`);
    }
    // @ts-ignore
    return window['@mappable-world/mappable-default-ui-theme'];
});

const BOUNDS = [
    [54.58311, 25.9985],
    [56.30248, 24.47889]
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LOCATION = {bounds: BOUNDS};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ENABLED_BEHAVIORS = ['drag', 'scrollZoom', 'dblClick', 'mouseTilt', 'mouseRotate'];