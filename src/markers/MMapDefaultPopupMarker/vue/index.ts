import {MMapFeatureProps, MMapMarkerEventHandler} from '@mappable-world/mappable-types';
import {CustomVuefyOptions} from '@mappable-world/mappable-types/modules/vuefy';
import type TVue from '@vue/runtime-core';
import {MMapDefaultPopupMarker, MMapDefaultPopupMarkerProps} from '../';

export const MMapDefaultPopupMarkerVuefyOptions: CustomVuefyOptions<MMapDefaultPopupMarker> = {
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
        position: {type: String as TVue.PropType<MMapDefaultPopupMarkerProps['position']>},
        offset: {type: Number, default: 0},
        show: {type: Boolean, default: true},
        onClose: {type: Function as TVue.PropType<MMapDefaultPopupMarkerProps['onClose']>},
        onOpen: {type: Function as TVue.PropType<MMapDefaultPopupMarkerProps['onOpen']>},
        title: {type: String},
        description: {type: String},
        action: {type: String},
        onAction: {type: Function as TVue.PropType<MMapDefaultPopupMarkerProps['onAction']>}
    }
};
