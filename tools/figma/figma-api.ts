import {Api as FigmaApi} from 'figma-api';
import {getComponents} from './get-components';
import {getIconDescriptions} from './get-icon-descriptions';

/** The name of the canvas in the file from which the icons will be loaded */
const CANVAS_NAME = 'glyphs';
const AVAILABLE_SIZES = [14, 24];

export async function fetchFigmaIcons() {
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
    console.info('Success get components');
    // components.forEach((c) => console.log(c.name));
    const iconDescriptions = getIconDescriptions(components, AVAILABLE_SIZES);
    console.info('Success get icon descriptions');
    iconDescriptions.forEach((i) => console.log(i.name));

    // const images = await getImages(iconDescriptions, fileId, api);
    // console.info('Success load icon images');
    // console.log(localeMatchimages);
}