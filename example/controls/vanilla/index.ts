import {ENABLED_BEHAVIORS, LOCATION} from '../common';
window.map = null;

main();
async function main() {
    await mappable.ready;
    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls} = mappable;

    const {MMapGeolocationControl, MMapRotateControl, MMapRotateTiltControl, MMapTiltControl, MMapZoomControl} =
        await mappable.import('@mappable-world/mappable-default-ui-theme');

    map = new MMap(
        document.getElementById('app'),
        {location: LOCATION, showScaleInCopyrights: true, behaviors: ENABLED_BEHAVIORS},
        [new MMapDefaultSchemeLayer({}), new MMapDefaultFeaturesLayer({})]
    );

    map.addChild(
        new MMapControls({position: 'left'}, [new MMapZoomControl({}), new MMapGeolocationControl({zoom: 11})])
    );
    map.addChild(new MMapControls({position: 'bottom'}, [new MMapZoomControl({})]));
    map.addChild(
        new MMapControls({position: 'right'}, [
            new MMapRotateTiltControl({}),
            new MMapRotateControl({}),
            new MMapTiltControl({})
        ])
    );
}
