import got from 'got';
import {IconDescription, IconDescriptionWithLink} from './fetch-icons';

/** Maximum number of retries when loading an icon */
const MAX_RETRIES = 20;
/** Our designer marks these icons with this color that do not need to be worked on yet. */
const ERROR_COLOR_REGEXP = /fill="#C90D0D"/;
/** Default icon color from Figma */
const FILL_COLOR_REGEXP = /fill="black"/g;

export type IconDescriptionWithData = IconDescription & {
    data: Buffer;
};

/**
 * Downloads icons from Figma using the link from the description and transforms them
 * @param icons - Array of objects with icon descriptions
 * @returns Array of objects with icon descriptions and transformed downloaded data
 */
export const downloadAndTransform = async (icons: IconDescriptionWithLink[]): Promise<IconDescriptionWithData[]> => {
    const iconsWithData = await getImageFiles(icons);
    return iconsWithData
        .filter((icon) => !icon.data.toString().match(ERROR_COLOR_REGEXP))
        .map((icon) => ({
            ...icon,
            data: Buffer.from(icon.data.toString().replace(FILL_COLOR_REGEXP, 'fill="currentColor"'))
        }));
};

/**
 * Downloads icons from Figma using the link from the description
 * @param icons - Array of objects with icon descriptions
 * @returns Array of objects with icon descriptions and downloaded data
 */
const getImageFiles = async (icons: IconDescriptionWithLink[]): Promise<IconDescriptionWithData[]> => {
    return Promise.all(
        icons.map(async (icon) => {
            try {
                const file = await fetchFile(icon.link);
                return {...file, name: icon.name, componentId: icon.componentId};
            } catch (e) {
                e.message = `${icon.name}: ${e.message}`;
                throw e;
            }
        })
    );
};

/**
 * Download the file from the specified URL
 * @param url - URL where the file is located
 * @returns Downloaded data as a buffer
 */
const fetchFile = async (url: string) => {
    const response = await got<Buffer>(url, {timeout: 60 * 1000, retry: MAX_RETRIES});
    if (!response.body) {
        throw new Error('No response body.');
    }
    return {data: response.body};
};
