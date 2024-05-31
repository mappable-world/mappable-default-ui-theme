import type {BaseRouteResponse, LngLat, MMapFeature, RouteOptions, Stroke} from '@mappable-world/mappable-types';
import type {MMapDefaultMarker} from '../../src';
import {LOCATION, TRUCK_PARAMS, computeBoundsForPoints} from '../common';

window.map = null;

main();
async function main() {
    await mappable.ready;
    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls} = mappable;

    const {MMapRouteControl, MMapDefaultMarker} = await mappable.import('@mappable-world/mappable-default-ui-theme');

    map = new MMap(document.getElementById('app'), {location: LOCATION, margin: [20, 20, 20, 20]});

    map.addChild(new MMapDefaultSchemeLayer({}));
    map.addChild(new MMapDefaultFeaturesLayer({}));

    const fromPoint: MMapDefaultMarker = new MMapDefaultMarker({
        coordinates: map.center as LngLat,
        size: 'normal',
        color: {day: '#2E4CE5', night: '#D6FD63'},
        iconName: 'fallback'
    });
    const toPoint: MMapDefaultMarker = new MMapDefaultMarker({
        coordinates: map.center as LngLat,
        size: 'normal',
        color: {day: '#313133', night: '#C8D2E6'},
        iconName: 'fallback'
    });
    let previewPoint: MMapDefaultMarker;

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
                        const {name} = from.properties;
                        fromPoint.update({coordinates, title: name});
                        if (!map.children.includes(fromPoint)) {
                            map.addChild(fromPoint);
                        }
                    } else {
                        if (map.children.includes(fromPoint)) {
                            map.removeChild(fromPoint);
                        }
                    }

                    if (to) {
                        const {coordinates} = to.geometry;
                        const {name} = to.properties;
                        toPoint.update({coordinates, title: name});
                        if (!map.children.includes(toPoint)) {
                            map.addChild(toPoint);
                        }
                    } else {
                        if (map.children.includes(toPoint)) {
                            map.removeChild(toPoint);
                        }
                    }
                },
                onMouseMoveOnMap(coordinates, index, lastCall) {
                    if (!previewPoint) {
                        previewPoint = new MMapDefaultMarker({
                            coordinates,
                            size: 'normal',
                            color: {day: '#2E4CE580', night: '#D6FD6380'},
                            iconName: 'fallback'
                        });
                    }

                    if (!lastCall) {
                        previewPoint.update({coordinates});

                        if (!map.children.includes(previewPoint)) {
                            map.addChild(previewPoint);
                        }
                    } else {
                        map.removeChild(previewPoint);
                        previewPoint = undefined;
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
    const getStroke = (type: RouteOptions['type']): Stroke => {
        if (type === 'walking') {
            return [
                {width: 4, color: '#7D90F0', dash: [4, 8]},
                {width: 8, color: '#ffffff'}
            ];
        }
        return [
            {width: 6, color: '#34D9AD'},
            {width: 8, color: '#050D3366'}
        ];
    };
}
