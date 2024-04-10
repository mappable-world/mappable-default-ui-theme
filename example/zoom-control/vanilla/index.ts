import {LOCATION} from '../common';
window.map = null;

main();
async function main() {
    await mappable.ready;
    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls} = mappable;

    const {MMapZoomControl} = await mappable.import('@mappable-world/mappable-default-ui-theme');

    map = new MMap(document.getElementById('app'), {location: LOCATION});

    map.addChild(new MMapDefaultSchemeLayer({}));
    map.addChild(new MMapDefaultFeaturesLayer({}));

    map.addChild(new MMapControls({position: 'right'}).addChild(new MMapZoomControl({})));
    map.addChild(new MMapControls({position: 'bottom'}).addChild(new MMapZoomControl({})));
}
