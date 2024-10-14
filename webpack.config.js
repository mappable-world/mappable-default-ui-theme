const path = require('path');

const ESM_BUILD = process.env.ESM_BUILD === 'true';

module.exports = (args, env, dir = process.cwd()) => {
    const coreWebpackModule = require('@mappable-world/mappable-cli/webpack.config')(args, env, dir);
    if (ESM_BUILD) {
        coreWebpackModule.experiments = {
            outputModule: true
        };
        coreWebpackModule.entry = {
            index: {
                import: './src/index.ts',
                library: {
                    type: 'module'
                }
            }
        };
        coreWebpackModule.output.path = path.resolve(dir, 'dist/esm');
    }
    return coreWebpackModule;
};
