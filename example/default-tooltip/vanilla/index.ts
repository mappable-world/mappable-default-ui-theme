import {CENTER, LOCATION, POPUP_TEXT} from '../common';
window.map = null;

main();
async function main() {
    await mappable.ready;
    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls, MMapControlButton} = mappable;

    const {MMapTextPopupMarker} = await mappable.import('@mappable-world/mappable-default-ui-theme');

    map = new MMap(document.getElementById('app'), {location: LOCATION});

    map.addChild(new MMapDefaultSchemeLayer({}));
    map.addChild(new MMapDefaultFeaturesLayer({}));

    map.addChild(
        new MMapControls({position: 'top right'}, [
            new MMapControlButton({text: 'Left', onClick: () => textPopup.update({position: 'left'})}),
            new MMapControlButton({text: 'Left Top', onClick: () => textPopup.update({position: 'left top'})}),
            new MMapControlButton({text: 'Left Bottom', onClick: () => textPopup.update({position: 'left bottom'})}),
            new MMapControlButton({text: 'Bottom', onClick: () => textPopup.update({position: 'bottom'})}),
            new MMapControlButton({text: 'Top', onClick: () => textPopup.update({position: 'top'})}),
            new MMapControlButton({text: 'Right Top', onClick: () => textPopup.update({position: 'right top'})}),
            new MMapControlButton({text: 'Right Bottom', onClick: () => textPopup.update({position: 'right bottom'})}),
            new MMapControlButton({text: 'Right', onClick: () => textPopup.update({position: 'right'})})
        ])
    );

    const textPopup = new MMapTextPopupMarker({coordinates: CENTER, draggable: true, content: POPUP_TEXT});
    map.addChild(textPopup);
}
