import {LOCATION, MARKER_LOCATIONS} from '../common';
window.map = null;

main();
async function main() {
    await mappable.ready;
    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls, MMapControlButton} = mappable;

    const {MMapDefaultMarker} = await mappable.import('@mappable-world/mappable-default-ui-theme');

    map = new MMap(document.getElementById('app'), {location: LOCATION});

    map.addChild(new MMapDefaultSchemeLayer({}));
    map.addChild(new MMapDefaultFeaturesLayer({}));

    map.addChild(
        new MMapControls({position: 'top right'}).addChild(
            new MMapControlButton({
                text: 'Switch theme',
                onClick: () => {
                    const {theme} = map;
                    map.update({theme: theme === 'light' ? 'dark' : 'light'});
                }
            })
        )
    );

    MARKER_LOCATIONS.forEach((props) => map.addChild(new MMapDefaultMarker(props)));
}
