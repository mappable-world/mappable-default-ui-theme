import {LOCATION, RULER_COORDINATES} from '../common';

window.map = null;

main();
async function main() {
    // Waiting for all api elements to be loaded
    await mappable.ready;
    const {MMap, MMapDefaultSchemeLayer} = mappable;
    const {MMapDefaultRuler} = await mappable.import('@mappable-world/mappable-default-ui-theme');
    // Initialize the map
    map = new MMap(
        // Pass the link to the HTMLElement of the container
        document.getElementById('app'),
        // Pass the map initialization parameters
        {location: LOCATION, showScaleInCopyrights: true},
        // Add a map scheme layer
        [new MMapDefaultSchemeLayer({})]
    );

    const ruler = new MMapDefaultRuler({type: 'ruler', points: RULER_COORDINATES});
    map.addChild(ruler);
}
