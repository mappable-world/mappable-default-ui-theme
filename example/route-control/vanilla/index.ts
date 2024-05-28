import {LOCATION} from '../common';
import type {MMapDefaultMarker} from '../../src';
import {MMapFeature} from '@mappable-world/mappable-types';

window.map = null;

main();
async function main() {
    await mappable.ready;
    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls, MMapFeature} = mappable;

    const {MMapRouteControl, MMapDefaultMarker} = await mappable.import('@mappable-world/mappable-default-ui-theme');

    map = new MMap(document.getElementById('app'), {location: LOCATION});

    map.addChild(new MMapDefaultSchemeLayer({}));
    map.addChild(new MMapDefaultFeaturesLayer({}));

    let fromPoint: MMapDefaultMarker;
    let toPoint: MMapDefaultMarker;
    let routeFeature: MMapFeature;

    map.addChild(
        new MMapControls({position: 'top left'}).addChild(
            new MMapRouteControl({
                onRouteResult(result) {
                    const {geometry} = result.toRoute();
                    if (routeFeature) {
                        routeFeature.update({geometry});
                    } else {
                        routeFeature = new MMapFeature({
                            geometry,
                            style: {
                                simplificationRate: 0,
                                stroke: [
                                    {width: 6, color: '#34D9AD'},
                                    {width: 8, color: '#050D3366'}
                                ]
                            }
                        });
                        map.addChild(routeFeature);
                    }
                },
                onUpdateWaypoints(waypoints) {
                    const [from, to] = waypoints;
                    if (from) {
                        const {coordinates} = from.geometry;
                        const {name} = from.properties;
                        if (fromPoint) fromPoint.update({coordinates});
                        else {
                            fromPoint = new MMapDefaultMarker({
                                coordinates,
                                title: name,
                                size: 'normal',
                                color: {day: '#2E4CE5', night: '#D6FD63'},
                                iconName: 'fallback'
                            });
                            map.addChild(fromPoint);
                        }
                    } else {
                        if (fromPoint) {
                            map.removeChild(fromPoint);
                        }
                    }

                    if (to) {
                        const {coordinates} = to.geometry;
                        const {name} = to.properties;
                        if (toPoint) toPoint.update({coordinates});
                        else {
                            toPoint = new MMapDefaultMarker({
                                coordinates,
                                title: name,
                                size: 'normal',
                                color: {day: '#313133', night: '#C8D2E6'},
                                iconName: 'fallback'
                            });
                            map.addChild(toPoint);
                        }
                    } else {
                        if (toPoint) {
                            map.removeChild(toPoint);
                        }
                    }
                }
            })
        )
    );
}
