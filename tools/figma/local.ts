import fs from 'fs/promises';
import path from 'path';
import {ExportFormat} from './get-icon-descriptions';
import {IconDescriptionWithData} from './get-image-files';

const BASE_DIR = path.join(__dirname, '../../');
const ICONS_PATH = path.join(BASE_DIR, 'static/icons');
const TYPES_PATH = path.join(BASE_DIR, 'src/icons/types');

export type FileDescription = {
    name: string;
    data: Buffer;
    exportFormat: ExportFormat;
};

export const getFiles = async (): Promise<FileDescription[]> => {
    console.info('Getting static resources dir');
    const currentFilenames = await fs.readdir(ICONS_PATH);
    const descriptions: FileDescription[] = await Promise.all(
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
    console.info(`${descriptions.length} current icons files fetched`);
    return descriptions;
};

export const updateLocalFiles = async (icons: IconDescriptionWithData[]) => {
    await Promise.all(
        icons.map((icon) => {
            const filePath = path.join(ICONS_PATH, `${icon.name}.${icon.exportFormat}`);
            return fs.writeFile(filePath, icon.data, icon.exportFormat === 'svg' ? 'utf-8' : null);
        })
    );
};
