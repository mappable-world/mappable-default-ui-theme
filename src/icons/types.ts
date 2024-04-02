import {IconName} from './icon-name';
import {IconSize} from './icon-size';

export type Icons = {
    [key in IconName]: {
        [key in IconSize]: string | null;
    };
};
