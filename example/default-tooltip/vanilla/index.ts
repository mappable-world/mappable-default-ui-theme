import {CENTER, LOCATION, TOOLTIP_TEXT} from '../common';
window.map = null;

main();
async function main() {
    await mappable.ready;
    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls, MMapControlButton} = mappable;

    const {MMapTooltipMarker} = await mappable.import('@mappable-world/mappable-default-ui-theme');

    map = new MMap(document.getElementById('app'), {location: LOCATION});

    map.addChild(new MMapDefaultSchemeLayer({}));
    map.addChild(new MMapDefaultFeaturesLayer({}));

    map.addChild(
        new MMapControls({position: 'top right'}, [
            new MMapControlButton({text: 'Left', onClick: () => tooltip.update({position: 'left'})}),
            new MMapControlButton({text: 'Bottom', onClick: () => tooltip.update({position: 'bottom'})}),
            new MMapControlButton({text: 'Top', onClick: () => tooltip.update({position: 'top'})}),
            new MMapControlButton({text: 'Right', onClick: () => tooltip.update({position: 'right'})})
        ])
    );

    const tooltip = new MMapTooltipMarker({coordinates: CENTER, draggable: true, text: TOOLTIP_TEXT});
    map.addChild(tooltip);
}
