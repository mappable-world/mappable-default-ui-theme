import {Api as FigmaApi} from 'figma-api';
import {GetImageResult} from 'figma-api/lib/api-types';
import {makeChunks} from '../utils/make-chunks';
import {IconDescription} from './get-icon-descriptions';

const IMAGE_SCALE = 1;
const ICONS_PER_CHUNK = 100;

export type IconDescriptionWithLink = IconDescription & {
    componentId: string;
    link: string;
};

export const getImageLinks = async (
    descriptions: IconDescription[],
    fileId: string,
    api: FigmaApi
): Promise<IconDescriptionWithLink[]> => {
    const chunks = makeChunks(descriptions, ICONS_PER_CHUNK);
    const linkChunks = await Promise.all(
        chunks.map((chunk) =>
            api.getImage(fileId, {
                ids: chunk.map((icon) => icon.componentId).join(','),
                scale: IMAGE_SCALE,
                format: 'svg'
            })
        )
    );
    const links = linkChunks.reduce<GetImageResult>(
        (memo, chunk) => {
            if (chunk.err) {
                memo.err = chunk.err;
            }
            if (chunk.images) {
                memo.images = {...memo.images, ...chunk.images};
            }
            return memo;
        },
        {images: {}}
    );

    if (links.err) {
        throw new Error(`Error while loading links: ${links.err}`);
    }

    return descriptions.reduce<IconDescriptionWithLink[]>((descriptionsWithLink, description) => {
        const link = links.images[description.componentId];
        if (link) {
            return descriptionsWithLink.concat({...description, link});
        }
        return descriptionsWithLink;
    }, []);
};
