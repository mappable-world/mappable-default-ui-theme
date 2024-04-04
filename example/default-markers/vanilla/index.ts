import {LOCATION, MARKER_LOCATION} from '../common';
window.map = null;

main();
async function main() {
    await mappable.ready;
    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer} = mappable;

    const {MMapDefaultMarker} = await mappable.import('@mappable-world/mappable-default-ui-theme');

    map = new MMap(document.getElementById('app'), {location: LOCATION});

    map.addChild(new MMapDefaultSchemeLayer({}));
    map.addChild(new MMapDefaultFeaturesLayer({}));

    const defaultMarker = new MMapDefaultMarker({
        iconName: 'fallback',
        color: 'bluebell',
        coordinates: MARKER_LOCATION
    });
    map.addChild(defaultMarker);
}
