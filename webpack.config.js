const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const ESM_BUILD = process.env.ESM_BUILD === 'true';

/**
 * `style-loader` injects css styles directly into the DOM.
 * In the ESM build, all styles are assembled into a separate file (`index.css`),
 * so styles do not need to be injected directly into the DOM
 */
const replaceStyleLoaderToCssExtract = (moduleRules) => {
    moduleRules.forEach((loaderRule) => {
        if (!loaderRule.use) {
            return;
        }
        loaderRule.use.forEach((loader, index) => {
            if (loader === 'style-loader') {
                loaderRule.use[index] = MiniCssExtractPlugin.loader;
            }
        });
    });
};

module.exports = (args, env, dir = process.cwd()) => {
    const coreWebpackModule = require('@mappable-world/mappable-cli/webpack.config')(args, env, dir);

    if (ESM_BUILD) {
        coreWebpackModule.experiments = {outputModule: true};
        coreWebpackModule.entry = {index: {import: './src/index.ts', library: {type: 'module'}}};
        coreWebpackModule.output.path = path.resolve(dir, 'dist/esm');
        coreWebpackModule.plugins = [new MiniCssExtractPlugin()];
        replaceStyleLoaderToCssExtract(coreWebpackModule.module.rules);
    }

    return coreWebpackModule;
};
