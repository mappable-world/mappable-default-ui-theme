module.exports = {
    ...require('@mappable-world/mappable-cli/jest.config'),
    transform: {
        '^.+\\.svg$': '<rootDir>/tests/utils/svgTransform.js'
    }
};
