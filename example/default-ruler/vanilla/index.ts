import {LOCATION, RULER_COORDINATES} from '../common';

window.map = null;

main();
async function main() {
    // Waiting for all api elements to be loaded
    await mappable.ready;
    const {MMap, MMapDefaultSchemeLayer, MMapControlButton, MMapControls} = mappable;
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

    let editable = true;

    const ruler = new MMapDefaultRuler({
        type: 'ruler',
        editable,
        points: RULER_COORDINATES,
        onFinish: () => {
            editable = false;
        }
    });
    map.addChild(ruler);

    map.addChild(
        new MMapControls({position: 'top right'}, [
            new MMapControlButton({
                text: 'Switch edit ruler',
                onClick: () => {
                    editable = !editable;
                    ruler.update({editable});
                }
            })
        ])
    );
}
