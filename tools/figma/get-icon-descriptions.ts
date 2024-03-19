import {ImageType, type Node} from 'figma-api';

const REGION_CODE_REGEXP = /_([a-z]{2})_/;
const SIZE_REGEXP = /_([0-9]{2})/;
const INTL_REGION_CODES = new Intl.DisplayNames(['en', 'ru'], {type: 'region'});

export type ExportFormat = 'png' | 'svg';

export type IconDescription = {
    componentId: string;
    name: string;
    exportFormat: ExportFormat;
};

export const getIconDescriptions = (components: Node<'COMPONENT'>[], availableSizes: number[]): IconDescription[] => {
    return components
        .filter((component) => {
            // the component must have export settings
            if (component.exportSettings === undefined || component.exportSettings.length === 0) {
                return false;
            }
            // the component should not have a regional code
            if (componentNameHasRegionCode(component.name)) {
                return false;
            }
            // the component must be of allowed size and square
            if (!componentAvailableSize(component.name, availableSizes)) {
                return false;
            }
            const {height, width} = component.absoluteBoundingBox;
            return height === width;
        })
        .map<IconDescription>((component) => {
            const isPng = component.exportSettings.every(({format}) => format === ImageType.PNG);
            const exportFormat = isPng ? 'png' : 'svg';
            return {componentId: component.id, name: component.name, exportFormat};
        });
};

const componentNameHasRegionCode = (componentName: string): boolean => {
    const regionMatch = REGION_CODE_REGEXP.exec(componentName);
    if (regionMatch === null) {
        return false;
    }
    const [, regionCode] = regionMatch;
    const uppercaseCode = regionCode.toUpperCase();
    return INTL_REGION_CODES.of(uppercaseCode) !== uppercaseCode;
};

const componentAvailableSize = (componentName: string, availableSizes: number[]): boolean => {
    const sizeMatch = SIZE_REGEXP.exec(componentName);
    if (sizeMatch === null) {
        return false;
    }
    const [, rawSize] = sizeMatch;
    const size = rawSize ? Number(rawSize) : undefined;
    return availableSizes.includes(size as number);
};
