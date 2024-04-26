import {CENTER, LOCATION} from '../common';
window.map = null;

main();
async function main() {
    await mappable.ready;
    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls, MMapControlButton} = mappable;

    const {MMapDefaultMarker} = await mappable.import('@mappable-world/mappable-default-ui-theme');

    map = new MMap(document.getElementById('app'), {location: LOCATION});

    map.addChild(new MMapDefaultSchemeLayer({}));
    map.addChild(new MMapDefaultFeaturesLayer({}));

    const marker = new MMapDefaultMarker({
        coordinates: CENTER,
        iconName: 'fallback',
        size: 'normal',
        popup: {
            title: 'Popup',
            description: 'Description for this marker',
            action: 'Action'
        }
    });

    map.addChild(marker);

    map.addChild(
        new MMapControls({position: 'top left'}, [
            new MMapControlButton({text: 'Normal', onClick: () => marker.update({size: 'normal'})}),
            new MMapControlButton({text: 'Small', onClick: () => marker.update({size: 'small'})}),
            new MMapControlButton({text: 'Micro', onClick: () => marker.update({size: 'micro'})})
        ])
    );
}
