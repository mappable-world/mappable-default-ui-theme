import {CustomVuefyOptions} from '@mappable-world/mappable-types/modules/vuefy';
import {TruckParameters} from '@mappable-world/mappable-types/imperative/route';
import {LngLat} from '@mappable-world/mappable-types';
import {MMapRouteControl, MMapRouteControlProps, AvailableTypes} from '..';
import type TVue from '@vue/runtime-core';

export const MMapRouteControlVuefyOptions: CustomVuefyOptions<MMapRouteControl> = {
    props: {
        geolocationTextInput: String,
        clearFieldsText: String,
        changeOrderText: String,
        availableTypes: Array as TVue.PropType<AvailableTypes[]>,
        truckParameters: Object as TVue.PropType<TruckParameters>,
        waypoints: Array as unknown as TVue.PropType<[LngLat | null, LngLat | null]>,
        waypointsPlaceholders: Array as unknown as TVue.PropType<[string, string]>,
        search: Function as TVue.PropType<MMapRouteControlProps['search']>,
        suggest: Function as TVue.PropType<MMapRouteControlProps['suggest']>,
        route: Function as TVue.PropType<MMapRouteControlProps['route']>,
        onMouseMoveOnMap: Function as TVue.PropType<MMapRouteControlProps['onMouseMoveOnMap']>,
        onUpdateWaypoints: Function as TVue.PropType<MMapRouteControlProps['onUpdateWaypoints']>,
        onRouteResult: Function as TVue.PropType<MMapRouteControlProps['onRouteResult']>,
        onBuildRouteError: Function as TVue.PropType<MMapRouteControlProps['onBuildRouteError']>
    }
};
