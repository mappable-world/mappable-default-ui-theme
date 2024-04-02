import fs from 'fs/promises';
import path from 'path';
import {prettierFormat} from '../utils/prettier-format';
import {SRC_ICONS_PATH} from './paths';

export const generateIconsTypes = async (iconNames: string[]) => {
    const type = 'IconName';
    const content = `
/** Don't edit manually. Generated by script: ./tools/icons/generate-types.ts */
export type ${type} =${iconNames.map((name) => `| '${name}'`).join('\n')};
`;
    const formattedContent = await prettierFormat(content, 'typescript');
    await fs.writeFile(path.join(SRC_ICONS_PATH, 'icon-name.ts'), formattedContent);
};
