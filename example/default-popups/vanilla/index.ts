import {CUSTOM_POPUP_COORDS, DEFAULT_POPUP_COORDS, LOCATION} from '../common';
window.map = null;

main();
async function main() {
    await mappable.ready;
    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls, MMapControlButton} = mappable;

    const {MMapPopupMarker, MMapDefaultPopupMarker} = await mappable.import(
        '@mappable-world/mappable-default-ui-theme'
    );

    map = new MMap(document.getElementById('app'), {location: LOCATION});

    map.addChild(new MMapDefaultSchemeLayer({}));
    map.addChild(new MMapDefaultFeaturesLayer({}));

    map.addChild(
        new MMapControls({position: 'top right'}, [
            new MMapControlButton({
                text: 'Toggle custom popup',
                onClick: () => customPopup.update({show: !customPopup.isOpen})
            }),
            new MMapControlButton({
                text: 'Toggle default popup',
                onClick: () => defaultPopup.update({show: !defaultPopup.isOpen})
            })
        ])
    );

    const customPopup = new MMapPopupMarker({
        coordinates: CUSTOM_POPUP_COORDS,
        content: () => {
            const popupElement = document.createElement('div');
            popupElement.classList.add('custom-popup');

            const titleElement = document.createElement('div');
            titleElement.classList.add('title');
            titleElement.textContent = 'Title';
            popupElement.appendChild(titleElement);

            const closeButton = document.createElement('button');
            closeButton.textContent = 'close';
            closeButton.addEventListener('click', () => customPopup.update({show: false}));
            popupElement.appendChild(closeButton);

            const contentElement = document.createElement('div');
            contentElement.classList.add('content');
            contentElement.textContent = 'Custom popup content';
            popupElement.appendChild(contentElement);

            return popupElement;
        }
    });
    map.addChild(customPopup);

    const defaultPopup = new MMapDefaultPopupMarker({
        coordinates: DEFAULT_POPUP_COORDS,
        title: 'Default popup marker',
        description: 'Description for default popup',
        action: 'Make an action',
        onAction: () => alert('Click on action button!')
    });
    map.addChild(defaultPopup);
}
