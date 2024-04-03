import {existsSync} from 'fs';
import fs from 'fs/promises';
import path from 'path';
import {prettierFormat} from '../utils/prettier-format';
import {DOCS_FILE_PATH, STATIC_ICONS_PATH} from './paths';

const WARNING = `<!-- Don't edit manually. Generated by script: ./tools/icons/generate-docs.ts -->`;
const TITLE = '# List of supported icons';
const TABLE_HEADER = `
| Name  | Normal Size | Small Size |
| --- | --- | --- |
`;

export const generateIconsDocsList = async (iconNames: string[]) => {
    let content = `${WARNING}\n\n${TITLE}\n\n${TABLE_HEADER}`;
    content += iconNames
        .map((name) => {
            const normalFileName = `${name}_24.svg`;
            const smallFileName = `${name}_14.svg`;

            const normalAbsolutePath = path.join(STATIC_ICONS_PATH, normalFileName);
            const smallAbsolutePath = path.join(STATIC_ICONS_PATH, smallFileName);

            const normalRelativePath = `../static/icons/${normalFileName}`;
            const smallRelativePath = `../static/icons/${smallFileName}`;

            const normalIcon = existsSync(normalAbsolutePath) ? `![${name}](${normalRelativePath})` : `none`;
            const smallIcon = existsSync(smallAbsolutePath) ? `![${name}](${smallRelativePath})` : `none`;

            return `| ${name} | ${normalIcon} | ${smallIcon} |`;
        })
        .join('\n');
    const formattedContent = await prettierFormat(content, 'markdown');
    await fs.writeFile(path.join(DOCS_FILE_PATH, 'icons.md'), formattedContent);
};
