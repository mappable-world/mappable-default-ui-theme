import fs from 'fs/promises';
import path from 'path';
import {IconDescriptionWithData} from './get-image-files';

export const BASE_DIR = path.join(__dirname, '../../');
export const ICONS_PATH = path.join(BASE_DIR, 'static/icons');

export type LocalIconDescription = {
    name: string;
    data: Buffer;
};

export const getLocalIcons = async (): Promise<LocalIconDescription[]> => {
    console.info('Getting static resources dir');
    const currentFilenames = await fs.readdir(ICONS_PATH);
    const descriptions: LocalIconDescription[] = await Promise.all(
        currentFilenames.map(async (filename) => {
            const fileExtension = path.parse(filename).ext.slice(1);
            if (fileExtension !== 'svg' && fileExtension !== 'png') {
                throw new Error('Unknown file extension.');
            }
            const cleanFilename = path.parse(filename).name;
            const data = await fs.readFile(path.join(ICONS_PATH, filename));
            return {
                name: cleanFilename,
                data,
                exportFormat: fileExtension
            };
        })
    );
    return descriptions;
};

export const updateLocalFiles = async (icons: IconDescriptionWithData[]) => {
    await Promise.all(
        icons.map((icon) => {
            const filePath = path.join(ICONS_PATH, `${icon.name}.svg`);
            return fs.writeFile(filePath, icon.data, 'utf-8');
        })
    );
};

export const deleteLocalFiles = async (iconsToDelete: LocalIconDescription[]) => {
    await Promise.all(
        iconsToDelete.map((icon) => {
            const filePath = path.join(ICONS_PATH, `${icon.name}.svg`);
            return fs.rm(filePath);
        })
    );
};
