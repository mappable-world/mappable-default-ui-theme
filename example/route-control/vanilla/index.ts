import type {BaseRouteResponse, LngLat, MMapFeature, RouteOptions, Stroke} from '@mappable-world/mappable-types';
import type {MMapDefaultMarker} from '../../src';
import {
    FROM_POINT_STYLE,
    LOCATION,
    PREVIEW_POINT_STYLE,
    TO_POINT_STYLE,
    TRUCK_PARAMS,
    computeBoundsForPoints,
    getStroke
} from '../common';

window.map = null;

main();
async function main() {
    await mappable.ready;
    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls} = mappable;

    const {MMapRouteControl, MMapDefaultMarker} = await mappable.import('@mappable-world/mappable-default-ui-theme');

    map = new MMap(document.getElementById('app'), {location: LOCATION, margin: [20, 20, 20, 20]}, [
        new MMapDefaultSchemeLayer({}),
        new MMapDefaultFeaturesLayer({})
    ]);

    const fromPoint: MMapDefaultMarker = new MMapDefaultMarker({
        coordinates: map.center as LngLat,
        ...FROM_POINT_STYLE
    });
    const toPoint: MMapDefaultMarker = new MMapDefaultMarker({
        coordinates: map.center as LngLat,
        ...TO_POINT_STYLE
    });
    let previewPoint: MMapDefaultMarker = new MMapDefaultMarker({
        coordinates: map.center as LngLat,
        ...PREVIEW_POINT_STYLE
    });

    let featuresOnMap: MMapFeature[] = [];

    map.addChild(
        new MMapControls({position: 'top left'}).addChild(
            new MMapRouteControl({
                truckParameters: TRUCK_PARAMS,
                waypoints: [map.center as LngLat, null],
                onBuildRouteError() {
                    featuresOnMap.forEach((f) => map.removeChild(f));
                    featuresOnMap = [];
                },
                onRouteResult(result, type) {
                    featuresOnMap.forEach((f) => map.removeChild(f));
                    featuresOnMap = getFeatures(result, type);
                    featuresOnMap.forEach((f) => map.addChild(f));

                    const bounds = computeBoundsForPoints(result.toRoute().geometry.coordinates);
                    map.update({location: {bounds, duration: 500}});
                },
                onUpdateWaypoints(waypoints) {
                    const [from, to] = waypoints;
                    if (from) {
                        const {coordinates} = from.geometry;
                        fromPoint.update({coordinates});
                        map.addChild(fromPoint);
                    } else {
                        map.removeChild(fromPoint);
                    }

                    if (to) {
                        const {coordinates} = to.geometry;
                        toPoint.update({coordinates});
                        map.addChild(toPoint);
                    } else {
                        map.removeChild(toPoint);
                    }
                    if (!to && !from) {
                        featuresOnMap.forEach((f) => map.removeChild(f));
                        featuresOnMap = [];
                    }
                },
                onMouseMoveOnMap(coordinates, index, lastCall) {
                    if (!lastCall) {
                        previewPoint.update({coordinates});

                        if (!map.children.includes(previewPoint)) {
                            map.addChild(previewPoint);
                        }
                    } else {
                        map.removeChild(previewPoint);
                    }
                }
            })
        )
    );

    const getFeatures = (result: BaseRouteResponse, type: RouteOptions['type']): MMapFeature[] => {
        if (type !== 'transit') {
            const {geometry} = result.toRoute();
            return [new mappable.MMapFeature({geometry, style: {stroke: getStroke(type), simplificationRate: 0}})];
        }
        return result.toSteps().map(
            (step) =>
                new mappable.MMapFeature({
                    geometry: step.geometry,
                    style: {stroke: getStroke(step.properties.mode as RouteOptions['type']), simplificationRate: 0}
                })
        );
    };
}
