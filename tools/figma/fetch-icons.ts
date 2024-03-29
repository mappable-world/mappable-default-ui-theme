import {Api as FigmaApi} from 'figma-api';
import {getComponents} from './get-components';
import {getIconDescriptions} from './get-icon-descriptions';
import {IconDescriptionWithLink, getImageLinks} from './get-image-links';

/** The name of the canvas in the file from which the icons will be loaded */
const CANVAS_NAME = 'glyphs';
const AVAILABLE_SIZES = [14, 24];

export async function fetchFigmaIcons(): Promise<IconDescriptionWithLink[]> {
    const personalAccessToken: string | undefined = process.env.FIGMA_API_TOKEN;
    const fileId: string | undefined = process.env.FIGMA_FILE_ID;

    if (!personalAccessToken) {
        throw new Error('No Figma access token found in environment variable FIGMA_API_TOKEN');
    }
    if (!fileId) {
        throw new Error('No Figma file id found in environment variable FIGMA_FILE_ID');
    }

    const api = new FigmaApi({personalAccessToken});
    const components = await getComponents({fileId, canvasName: CANVAS_NAME}, api);
    const iconDescriptions = getIconDescriptions(components, AVAILABLE_SIZES);
    const imageLinks = await getImageLinks(iconDescriptions, fileId, api);
    return imageLinks;
}
