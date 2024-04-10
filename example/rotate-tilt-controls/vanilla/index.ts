import {ENABLED_BEHAVIORS, LOCATION} from '../common';

window.map = null;

main();
async function main() {
    // Waiting for all api elements to be loaded
    await mappable.ready;
    const {MMap, MMapControls, MMapDefaultSchemeLayer} = mappable;
    const {MMapRotateTiltControl, MMapTiltControl, MMapRotateControl} = await mappable.import(
        '@mappable-world/mappable-default-ui-theme'
    );
    // Initialize the map
    map = new MMap(
        // Pass the link to the HTMLElement of the container
        document.getElementById('app'),
        // Pass the map initialization parameters
        {location: LOCATION, showScaleInCopyrights: true, behaviors: ENABLED_BEHAVIORS},
        // Add a map scheme layer
        [new MMapDefaultSchemeLayer({})]
    );

    map.addChild(
        new MMapControls({position: 'right'}, [
            new MMapRotateTiltControl({}),
            new MMapRotateControl({}),
            new MMapTiltControl({})
        ])
    );
}
