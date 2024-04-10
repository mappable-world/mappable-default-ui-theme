import {EasingFunctionDescription} from '@mappable-world/mappable-types';
import type {CustomVuefyOptions} from '@mappable-world/mappable-types/modules/vuefy';
import type TVue from '@vue/runtime-core';
import {MMapRotateControl} from '..';

export const MMapRotateControlVuefyOptions: CustomVuefyOptions<MMapRotateControl> = {
    props: {
        easing: [Function, String, Object] as TVue.PropType<EasingFunctionDescription>,
        duration: Number
    }
};
