import fs from 'fs/promises';
import path from 'path';
import {prettierFormat} from '../utils/prettier-format';
import {FetchedColors} from './fetch-colors';
import {SRC_ICONS_PATH} from './paths';

/** Human-readable names for colors. They are selected manually */
const colorNames = ['darkgray', 'pink', 'seawave', 'orchid', 'steelblue', 'bluebell', 'ceil', 'green', 'darksalmon'];

export const generateColorsFile = async (fetchedColors: FetchedColors) => {
    const colorsObjectValues = fetchedColors.colors.map(({day, night}, i) => {
        return `${colorNames[i]}:{day:'${day}',night:'${night}'},`;
    });
    const content = `
    /** Don't edit manually only color names. Generated by script: ./tools/icons/generate-colors.ts */
    export const iconColors = {
        ${colorsObjectValues.join('\n')}
    } as const;
    export const glyphColors = {day:'${fetchedColors.glyphDay}',night:'${fetchedColors.glyphNight}'} as const;
    export type IconColor = keyof typeof iconColors`;

    const formattedContent = await prettierFormat(content, 'typescript');
    await fs.writeFile(path.join(SRC_ICONS_PATH, 'icon-colors.ts'), formattedContent);
};
