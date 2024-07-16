import {BaseRouteResponse, LngLat, MMapLocationRequest, RouteOptions} from '@mappable-world/mappable-types';
import {MMapRouteControlProps, WaypointsArray} from '../../src';
import {
    FROM_POINT_STYLE,
    LOCATION,
    MARGIN,
    PREVIEW_POINT_STYLE,
    TO_POINT_STYLE,
    TRUCK_PARAMS,
    computeBoundsForPoints,
    getStroke
} from '../common';

window.map = null;

main();
async function main() {
    const [mappableVue] = await Promise.all([mappable.import('@mappable-world/mappable-vuefy'), mappable.ready]);
    const vuefy = mappableVue.vuefy.bindTo(Vue);

    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls, MMapFeature} = vuefy.module(mappable);

    const {MMapRouteControl, MMapDefaultMarker} = vuefy.module(
        await mappable.import('@mappable-world/mappable-default-ui-theme')
    );

    const app = Vue.createApp({
        components: {
            MMap,
            MMapDefaultSchemeLayer,
            MMapDefaultFeaturesLayer,
            MMapControls,
            MMapFeature,
            MMapRouteControl,
            MMapDefaultMarker
        },
        setup() {
            const location = Vue.ref<MMapLocationRequest>(LOCATION);
            const routeType = Vue.ref<RouteOptions['type']>('driving');
            const routeResult = Vue.shallowRef<BaseRouteResponse>();
            const showFeature = Vue.ref(false);
            const fromCoords = Vue.ref<LngLat | undefined>();
            const toCoords = Vue.ref<LngLat | undefined>();
            const previewCoords = Vue.ref<LngLat | undefined>();
            const waypoints = Vue.ref<[LngLat, LngLat]>([LOCATION.center, null]);

            const refMap = (ref: any) => {
                window.map = ref?.entity;
            };
            const onRouteResult = (result: BaseRouteResponse, type: RouteOptions['type']) => {
                routeType.value = type;
                routeResult.value = result;
                showFeature.value = true;
                const bounds = computeBoundsForPoints(result.toRoute().geometry.coordinates);
                location.value = {bounds, duration: 500};
            };
            const onUpdateWaypoints = (waypoints: WaypointsArray) => {
                const [from, to] = waypoints;
                fromCoords.value = from?.geometry?.coordinates;
                toCoords.value = to?.geometry?.coordinates;

                if (!from && !to) {
                    showFeature.value = false;
                }
                previewCoords.value = undefined;
            };
            const onBuildRouteError = () => {
                showFeature.value = false;
            };
            const onMouseMoveOnMap: MMapRouteControlProps['onMouseMoveOnMap'] = (coordinates, index, lastCall) => {
                previewCoords.value = lastCall ? undefined : coordinates;
            };
            const onDragEndHandler = (coordinates: LngLat, type: 'from' | 'to') => {
                if (type === 'from') {
                    waypoints.value = [coordinates, toCoords.value];
                } else {
                    waypoints.value = [fromCoords.value, coordinates];
                }
            };
            const features = Vue.computed(() => {
                if (!routeResult) {
                    return null;
                }
                if (routeType.value !== 'transit') {
                    const {geometry} = routeResult.value.toRoute();
                    return [
                        {
                            geometry,
                            style: {stroke: getStroke(routeType.value), simplificationRate: 0}
                        }
                    ];
                }
                return routeResult.value.toSteps().map((step) => ({
                    geometry: step.geometry,
                    style: {
                        stroke: getStroke(step.properties.mode as RouteOptions['type']),
                        simplificationRate: 0
                    }
                }));
            });

            return {
                LOCATION,
                MARGIN,
                FROM_POINT_STYLE,
                PREVIEW_POINT_STYLE,
                TO_POINT_STYLE,
                TRUCK_PARAMS,
                location,
                routeType,
                routeResult,
                showFeature,
                fromCoords,
                toCoords,
                previewCoords,
                waypoints,
                features,
                onRouteResult,
                onUpdateWaypoints,
                onBuildRouteError,
                onMouseMoveOnMap,
                onDragEndHandler,
                refMap
            };
        },
        template: `
            <MMap :location="location" :margin="MARGIN" :ref="refMap">
                <MMapDefaultSchemeLayer />
                <MMapDefaultFeaturesLayer />
                <MMapControls position="top left">
                    <MMapRouteControl 
                        :truckParameters="TRUCK_PARAMS"
                        :waypoints="waypoints"
                        :onRouteResult="onRouteResult"
                        :onUpdateWaypoints="onUpdateWaypoints"
                        :onBuildRouteError="onBuildRouteError"
                        :onMouseMoveOnMap="onMouseMoveOnMap" />
                </MMapControls>
                <template v-if="showFeature">
                    <MMapFeature v-for="feature in features"
                        :geometry="feature.geometry"
                        :style="feature.style" />
                </template>
                <MMapDefaultMarker 
                    v-if="fromCoords !== undefined"
                    :coordinates="fromCoords" 
                    draggable
                    :onDragEnd="(coordinates) => onDragEndHandler(coordinates, 'from')"
                    v-bind="FROM_POINT_STYLE" />
                <MMapDefaultMarker 
                    v-if="toCoords !== undefined"
                    :coordinates="toCoords" 
                    draggable
                    :onDragEnd="(coordinates) => onDragEndHandler(coordinates, 'to')"
                    v-bind="TO_POINT_STYLE" />
                <MMapDefaultMarker 
                    v-if="previewCoords !== undefined"
                    :coordinates="previewCoords" v-bind="PREVIEW_POINT_STYLE" />
                
            </MMap>`
    });
    app.mount('#app');
}
