declare module '@mappable-world/mappable-types/import' {
    interface Import {
        (pkg: '@mappable-world/mappable-default-ui-theme'): Promise<typeof import('./index')>;
    }
}

export {};
