import {differenceBy, intersectionBy} from 'lodash';
import {fetchFigmaIcons} from './fetch-icons';
import {deleteLocalFiles, getLocalIcons, updateLocalFiles} from './local';
import {downloadAndTransform} from './get-image-files';

export const updateIcons = async () => {
    const [localIcons, figmaIcons] = await Promise.all([getLocalIcons(), fetchFigmaIcons()]);

    const iconsWithData = await downloadAndTransform(figmaIcons);
    await updateLocalFiles(iconsWithData);

    const existingLocalIcons = intersectionBy(localIcons, iconsWithData, (d) => d.name);
    const iconsToDelete = differenceBy(localIcons, existingLocalIcons, (d) => d.name);
    await deleteLocalFiles(iconsToDelete);

    return iconsWithData;
};
