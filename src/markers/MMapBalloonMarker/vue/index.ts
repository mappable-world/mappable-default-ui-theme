import {MMapFeatureProps, MMapMarkerEventHandler} from '@mappable-world/mappable-types';
import {CustomVuefyFn, CustomVuefyOptions} from '@mappable-world/mappable-types/modules/vuefy';
import type TVue from '@vue/runtime-core';
import {MMapBalloonContentProps, MMapBalloonMarker, MMapBalloonMarkerProps, MMapBalloonPositionProps} from '../';

export const MMapBalloonMarkerVuefyOptions: CustomVuefyOptions<MMapBalloonMarker> = {
    props: {
        coordinates: {type: Object, required: true},
        source: String,
        zIndex: {type: Number, default: 0},
        properties: Object,
        id: String,
        disableRoundCoordinates: {type: Boolean, default: undefined},
        hideOutsideViewport: {type: [Object, Boolean], default: false},
        draggable: {type: Boolean, default: false},
        mapFollowsOnDrag: {type: [Boolean, Object]},
        onDragStart: Function as TVue.PropType<MMapMarkerEventHandler>,
        onDragEnd: Function as TVue.PropType<MMapMarkerEventHandler>,
        onDragMove: Function as TVue.PropType<MMapMarkerEventHandler>,
        blockEvents: {type: Boolean, default: undefined},
        blockBehaviors: {type: Boolean, default: undefined},
        onDoubleClick: Function as TVue.PropType<MMapFeatureProps['onDoubleClick']>,
        onClick: Function as TVue.PropType<MMapFeatureProps['onClick']>,
        onFastClick: Function as TVue.PropType<MMapFeatureProps['onFastClick']>,
        content: {type: Function as TVue.PropType<MMapBalloonContentProps>, required: true},
        position: {type: String as TVue.PropType<MMapBalloonPositionProps>},
        offset: {type: Number, default: 0},
        show: {type: Boolean, default: true},
        onClose: {type: Function as TVue.PropType<MMapBalloonMarkerProps['onClose']>},
        onOpen: {type: Function as TVue.PropType<MMapBalloonMarkerProps['onOpen']>}
    }
};

type MMapBalloonMarkerSlots = {
    content: void;
};

export const MMapBalloonMarkerVuefyOverride: CustomVuefyFn<MMapBalloonMarker> = (
    MMapBalloonMarkerI,
    props,
    {vuefy, Vue}
) => {
    const MMapBalloonMarkerV = vuefy.entity(MMapBalloonMarkerI);
    const {content, ...overridedProps} = props;
    return Vue.defineComponent({
        name: 'MMapBalloonMarker',
        props: overridedProps,
        slots: Object as TVue.SlotsType<MMapBalloonMarkerSlots>,
        setup(props, {slots, expose}) {
            const content: TVue.Ref<TVue.VNodeChild | null> = Vue.ref(null);
            const popupHTMLElement = document.createElement('mappable');

            const markerRef = Vue.ref<{entity: MMapBalloonMarker} | null>(null);
            const markerEntity = Vue.computed(() => markerRef.value?.entity);

            const balloon = Vue.computed<MMapBalloonMarkerProps['content']>(() => {
                content.value = slots.content?.();
                return () => popupHTMLElement;
            });
            expose({entity: markerEntity});
            return () =>
                Vue.h(
                    MMapBalloonMarkerV,
                    {
                        ...props,
                        content: balloon.value,
                        ref: markerRef
                    },
                    () => Vue.h(Vue.Teleport, {to: popupHTMLElement}, [content.value])
                );
        }
    });
};
