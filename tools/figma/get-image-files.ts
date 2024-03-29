import got from 'got';
import {IconDescription} from './get-icon-descriptions';
import {IconDescriptionWithLink} from './get-image-links';

const MAX_RETRIES = 20;
/** Our designer marks these icons with this color that do not need to be worked on yet. */
const ERROR_COLOR_REGEXP = /fill="#C90D0D"/;
/** Default icon color from Figma */
const FILL_COLOR_REGEXP = /fill="black"/g;

export type IconDescriptionWithData = IconDescription & {
    data: Buffer;
};

export const downloadAndTransform = async (icons: IconDescriptionWithLink[]): Promise<IconDescriptionWithData[]> => {
    const iconsWithData = await getImageFiles(icons);
    return iconsWithData
        .filter((icon) => (icon.exportFormat !== 'svg' ? true : !icon.data.toString().match(ERROR_COLOR_REGEXP)))
        .map((icon) =>
            icon.exportFormat !== 'svg'
                ? icon
                : {...icon, data: Buffer.from(icon.data.toString().replace(FILL_COLOR_REGEXP, 'fill="currentColor"'))}
        );
};

const getImageFiles = async (icons: IconDescriptionWithLink[]): Promise<IconDescriptionWithData[]> => {
    return Promise.all(
        icons.map(async (icon) => {
            try {
                const file = await fetchFile(icon.link);
                return {...file, name: icon.name, exportFormat: icon.exportFormat, componentId: icon.componentId};
            } catch (e) {
                e.message = `${icon.name}: ${e.message}`;
                throw e;
            }
        })
    );
};

const fetchFile = async (url: string) => {
    const response = await got<Buffer>(url, {timeout: 60 * 1000, retry: MAX_RETRIES});
    if (!response.body) {
        throw new Error('No response body.');
    }
    return {data: response.body};
};
