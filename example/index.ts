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
