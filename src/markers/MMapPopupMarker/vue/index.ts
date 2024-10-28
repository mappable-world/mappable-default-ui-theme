import {MMapFeatureProps, MMapMarkerEventHandler} from '@mappable-world/mappable-types';
import {CustomVuefyFn, CustomVuefyOptions} from '@mappable-world/mappable-types/modules/vuefy';
import type TVue from '@vue/runtime-core';
import {MMapPopupContentProps, MMapPopupMarker, MMapPopupMarkerProps, MMapPopupPositionProps} from '../';
import {defaultProps} from '../props';

export const MMapPopupMarkerVuefyOptions: CustomVuefyOptions<MMapPopupMarker> = {
    props: {
        coordinates: {type: Object, required: true},
        source: String,
        zIndex: {type: Number, default: undefined},
        properties: Object,
        id: String,
        disableRoundCoordinates: {type: Boolean, default: undefined},
        hideOutsideViewport: {type: [Object, Boolean], default: undefined},
        draggable: {type: Boolean, default: undefined},
        mapFollowsOnDrag: {type: [Boolean, Object]},
        onDragStart: Function as TVue.PropType<MMapMarkerEventHandler>,
        onDragEnd: Function as TVue.PropType<MMapMarkerEventHandler>,
        onDragMove: Function as TVue.PropType<MMapMarkerEventHandler>,
        blockEvents: {type: Boolean, default: undefined},
        blockBehaviors: {type: Boolean, default: undefined},
        onDoubleClick: Function as TVue.PropType<MMapFeatureProps['onDoubleClick']>,
        onClick: Function as TVue.PropType<MMapFeatureProps['onClick']>,
        onFastClick: Function as TVue.PropType<MMapFeatureProps['onFastClick']>,
        content: {type: [Function, String] as TVue.PropType<MMapPopupContentProps>, required: true},
        position: {type: String as TVue.PropType<MMapPopupPositionProps>, default: defaultProps.position},
        offset: {type: Number, default: defaultProps.offset},
        show: {type: Boolean, default: defaultProps.show},
        onClose: {type: Function as TVue.PropType<MMapPopupMarkerProps['onClose']>},
        onOpen: {type: Function as TVue.PropType<MMapPopupMarkerProps['onOpen']>}
    }
};

type MMapPopupMarkerSlots = {
    content: void;
};

export const MMapPopupMarkerVuefyOverride: CustomVuefyFn<MMapPopupMarker> = (MMapPopupMarkerI, props, {vuefy, Vue}) => {
    const MMapPopupMarkerV = vuefy.entity(MMapPopupMarkerI);
    const {content, ...overridedProps} = props;
    return Vue.defineComponent({
        name: 'MMapPopupMarker',
        props: overridedProps,
        slots: Object as TVue.SlotsType<MMapPopupMarkerSlots>,
        setup(props, {slots, expose}) {
            const content: TVue.Ref<TVue.VNodeChild | null> = Vue.ref(null);
            const popupHTMLElement = document.createElement('mappable');

            const markerRef = Vue.ref<{entity: MMapPopupMarker} | null>(null);
            const markerEntity = Vue.computed(() => markerRef.value?.entity);

            const popup = Vue.computed<MMapPopupMarkerProps['content']>(() => {
                content.value = slots.content?.();
                return () => popupHTMLElement;
            });
            expose({entity: markerEntity});
            return () =>
                Vue.h(
                    MMapPopupMarkerV,
                    {
                        ...props,
                        content: popup.value,
                        ref: markerRef
                    },
                    () => Vue.h(Vue.Teleport, {to: popupHTMLElement}, [content.value])
                );
        }
    });
};
