import {Api as FigmaApi} from 'figma-api';
import {GetImageResult} from 'figma-api/lib/api-types';
import {ExportFormat, IconDescription} from './get-icon-descriptions';
import {makeChunks} from '../make-chunks';

const IMAGE_SCALE = 1;
const ICONS_PER_CHUNK = 100;

export type IconDescriptionWithLink = IconDescription & {
    link: string;
};
type SeparatedIcons = {
    [key in ExportFormat]: IconDescription[];
};

export const getImageLinks = async (
    descriptions: IconDescription[],
    fileId: string,
    api: FigmaApi
): Promise<IconDescriptionWithLink[]> => {
    const chunks = separateIntoChunks(descriptions);
    const linkChunks = await Promise.all(
        chunks.map((chunk) =>
            api.getImage(fileId, {
                ids: chunk.map((icon) => icon.componentId).join(','),
                scale: IMAGE_SCALE,
                format: chunk[0].exportFormat
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

const separateIntoChunks = (descriptions: IconDescription[]): IconDescription[][] => {
    const separatedIcons = descriptions.reduce<SeparatedIcons>(
        (result, icon) => {
            result[icon.exportFormat].push(icon);
            return result;
        },
        {svg: [], png: []}
    );
    return [...makeChunks(separatedIcons.svg, ICONS_PER_CHUNK), ...makeChunks(separatedIcons.png, ICONS_PER_CHUNK)];
};
