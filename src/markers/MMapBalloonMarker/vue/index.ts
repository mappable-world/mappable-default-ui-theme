import {MMapFeatureProps, MMapMarkerEventHandler} from '@mappable-world/mappable-types';
import {CustomVuefyOptions} from '@mappable-world/mappable-types/modules/vuefy';
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
