import type {MMapPopupPositionProps} from '../../src';
import {ACTION, CUSTOM_POPUP_COORDS, DESCRIPTION, LOCATION, POPUP_TEXT, TEXT_POPUP_COORDS, TITLE} from '../common';

window.map = null;

main();
async function main() {
    await mappable.ready;
    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls, MMapControlButton} = mappable;

    const {MMapPopupMarker} = await mappable.import('@mappable-world/mappable-default-ui-theme');

    map = new MMap(document.getElementById('app'), {location: LOCATION});

    map.addChild(new MMapDefaultSchemeLayer({}));
    map.addChild(new MMapDefaultFeaturesLayer({}));

    const updatePositions = (position: MMapPopupPositionProps) => {
        textPopup.update({position});
        customPopup.update({position});
    };

    map.addChild(
        new MMapControls({position: 'top right'}, [
            new MMapControlButton({text: 'Left', onClick: () => updatePositions('left')}),
            new MMapControlButton({text: 'Left Top', onClick: () => updatePositions('left top')}),
            new MMapControlButton({text: 'Left Bottom', onClick: () => updatePositions('left bottom')}),
            new MMapControlButton({text: 'Bottom', onClick: () => updatePositions('bottom')}),
            new MMapControlButton({text: 'Top', onClick: () => updatePositions('top')}),
            new MMapControlButton({text: 'Right Top', onClick: () => updatePositions('right top')}),
            new MMapControlButton({text: 'Right Bottom', onClick: () => updatePositions('right bottom')}),
            new MMapControlButton({text: 'Right', onClick: () => updatePositions('right')})
        ])
    );

    const textPopup = new MMapPopupMarker({coordinates: TEXT_POPUP_COORDS, draggable: true, content: POPUP_TEXT});
    map.addChild(textPopup);

    const customPopup = new MMapPopupMarker({
        coordinates: CUSTOM_POPUP_COORDS,
        draggable: true,
        content: createDefaultPopup
    });
    map.addChild(customPopup);

    function createDefaultPopup(): HTMLElement {
        const popupRootElement = document.createElement('span');
        popupRootElement.classList.add('popup');

        const popupHeaderElement = document.createElement('span');
        popupHeaderElement.classList.add('header');
        popupRootElement.appendChild(popupHeaderElement);

        const titleElement = document.createElement('span');
        titleElement.classList.add('header_title');
        titleElement.textContent = TITLE;
        popupHeaderElement.appendChild(titleElement);

        const closeButton = document.createElement('button');
        closeButton.classList.add('header_close');
        closeButton.addEventListener('click', () => {
            customPopup.update({show: false});
        });
        popupHeaderElement.appendChild(closeButton);

        const descriptionElement = document.createElement('span');
        descriptionElement.classList.add('description');
        descriptionElement.textContent = DESCRIPTION;
        popupRootElement.appendChild(descriptionElement);

        const actionButton = document.createElement('button');
        actionButton.classList.add('action');
        actionButton.textContent = ACTION;
        actionButton.addEventListener('click', () => {
            alert('Click on action button!');
        });
        popupRootElement.appendChild(actionButton);

        return popupRootElement;
    }
}
