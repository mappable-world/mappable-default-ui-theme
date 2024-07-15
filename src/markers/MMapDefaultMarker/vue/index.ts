import {MMapFeatureProps, MMapMarkerEventHandler} from '@mappable-world/mappable-types';
import {CustomVuefyFn, CustomVuefyOptions} from '@mappable-world/mappable-types/modules/vuefy';
import type TVue from '@vue/runtime-core';
import {MMapDefaultMarker, MMapDefaultMarkerProps, MarkerColorProps, MarkerPopupProps, MarkerSizeProps} from '../';
import {IconName} from '../../../icons';

export const MMapDefaultMarkerVuefyOptions: CustomVuefyOptions<MMapDefaultMarker> = {
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
        iconName: {type: String as TVue.PropType<IconName>},
        color: {type: [Object, String] as TVue.PropType<MarkerColorProps>, default: 'darkgray'},
        size: {type: String as TVue.PropType<MarkerSizeProps>, default: 'small'},
        title: {type: String},
        subtitle: {type: String},
        staticHint: {type: Boolean, default: true},
        popup: {type: Object as TVue.PropType<MarkerPopupProps>}
    }
};

type MMapDefaultMarkerSlots = {
    popupContent: void;
};

export const MMapDefaultMarkerVuefyOverride: CustomVuefyFn<MMapDefaultMarker> = (
    MMapDefaultMarkerI,
    props,
    {vuefy, Vue}
) => {
    const MMapDefaultMarkerV = vuefy.entity(MMapDefaultMarkerI);

    return Vue.defineComponent({
        name: 'MMapDefaultMarker',
        props,
        slots: Object as TVue.SlotsType<MMapDefaultMarkerSlots>,
        setup(props, {slots, expose}) {
            const content: TVue.Ref<TVue.VNodeChild | null> = Vue.ref(null);
            const popupHTMLElement = document.createElement('mappable');

            const markerRef = Vue.ref<{entity: MMapDefaultMarker} | null>(null);
            const markerEntity = Vue.computed(() => markerRef.value?.entity);

            const popupContent = Vue.computed<MMapDefaultMarkerProps['popup']['content']>(() => {
                if (slots.popupContent === undefined) {
                    return undefined;
                }
                content.value = slots.popupContent();
                return () => popupHTMLElement;
            });
            expose({entity: markerEntity});
            return () =>
                Vue.h(
                    MMapDefaultMarkerV,
                    {
                        ...props,
                        popup: {...props.popup, content: popupContent.value},
                        ref: markerRef
                    },
                    () => Vue.h(Vue.Teleport, {to: popupHTMLElement}, [content.value])
                );
        }
    });
};
