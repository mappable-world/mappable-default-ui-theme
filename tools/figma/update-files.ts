import {differenceBy, intersectionBy} from 'lodash';
import {fetchFigmaIcons} from '../figma/fetch-icons';
import {getFiles, updateLocalFiles} from '../figma/local';
import {downloadAndTransform} from './get-image-files';

export const updateFiles = async () => {
    const localIcons = await getFiles();

    const figmaIcons = await fetchFigmaIcons();

    const existingLocalIcons = intersectionBy(localIcons, figmaIcons, (d) => d.name);
    const iconsToDelete = differenceBy(localIcons, existingLocalIcons, (d) => d.name);

    const iconsWithData = await downloadAndTransform(figmaIcons);

    await updateLocalFiles(iconsWithData);
};
