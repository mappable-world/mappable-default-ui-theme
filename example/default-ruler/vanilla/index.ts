import {RulerType} from '@mappable-world/mappable-types/modules/ruler';
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
    let rulerType: RulerType = 'ruler';

    const ruler = new MMapDefaultRuler({
        type: rulerType,
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
    map.addChild(
        new MMapControls({position: 'top left'}, [
            new MMapControlButton({
                text: 'Switch ruler type',
                onClick: () => {
                    rulerType = rulerType === 'ruler' ? 'planimeter' : 'ruler';
                    ruler.update({type: rulerType});
                }
            })
        ])
    );
}
