import type {SearchResponse} from '@mappable-world/mappable-types';
import {LOCATION, MARGIN, initialMarkerProps, findSearchResultBoundsRange} from '../common';

window.map = null;

main();
async function main() {
    await mappable.ready;
    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls} = mappable;

    const {MMapDefaultMarker} = await mappable.import('@mappable-world/mappable-default-ui-theme');
    const {MMapSearchControl} = await mappable.import('@mappable-world/mappable-default-ui-theme');

    map = new MMap(document.getElementById('app'), {location: LOCATION, margin: MARGIN});

    map.addChild(new MMapDefaultSchemeLayer({}));
    map.addChild(new MMapDefaultFeaturesLayer({}));

    const initialMarker = new MMapDefaultMarker({
        title: initialMarkerProps.properties.name,
        subtitle: initialMarkerProps.properties.description,
        coordinates: initialMarkerProps.geometry.coordinates,
        size: 'normal',
        iconName: 'fallback',
        onClick: () => {
            map.removeChild(initialMarker);
        }
    });
    map.addChild(initialMarker);
    const searchMarkers = [initialMarker];

    const updateSearchMarkers = (searchResult: SearchResponse) => {
        searchMarkers.forEach((marker) => {
            map.removeChild(marker);
        });

        searchResult.forEach((element) => {
            const marker = new MMapDefaultMarker({
                title: element.properties.name,
                subtitle: element.properties?.description,
                coordinates: element.geometry.coordinates,
                size: 'normal',
                iconName: 'fallback',
                onClick: () => {
                    map.removeChild(marker);
                }
            });
            map.addChild(marker);
            searchMarkers.push(marker);
        });
    };

    const updateMapLocation = (searchResult: SearchResponse) => {
        if (searchResult.length !== 0) {
            let center;
            let zoom;
            let bounds;

            if (searchResult.length === 1) {
                center = searchResult[0].geometry?.coordinates;
                zoom = 12;
            } else {
                bounds = findSearchResultBoundsRange(searchResult);
            }

            map.update({
                location: {
                    center,
                    zoom,
                    bounds,
                    duration: 400
                }
            });
        }
    };

    const searchResultHandler = (searchResult: SearchResponse) => {
        updateSearchMarkers(searchResult);
        updateMapLocation(searchResult);
    };

    map.addChild(
        new MMapControls({position: 'top'}).addChild(
            new MMapSearchControl({
                searchResult: searchResultHandler
            })
        )
    );
}
