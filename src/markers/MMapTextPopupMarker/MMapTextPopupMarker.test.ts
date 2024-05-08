import {MMap} from '@mappable-world/mappable-types';
import {CENTER, createContainer} from '../../../tests/common';
import {MMapTextPopupMarker} from './';

describe('MMapTextPopupMarker', () => {
    let map: MMap;
    let container: HTMLElement;

    beforeEach(() => {
        container = createContainer();
        document.body.append(container);
        map = new mappable.MMap(container, {location: {center: CENTER, zoom: 0}});
        map.addChild(new mappable.MMapDefaultFeaturesLayer({}));
    });

    afterEach(() => {
        map.destroy();
    });

    it('add on map', () => {
        const popup = new MMapTextPopupMarker({coordinates: CENTER, content: 'Popup'});
        map.addChild(popup);

        expect(document.querySelector('.mappable--popup-marker .mappable--default-text-popup')).not.toBeNull();
    });
    it('change content props', () => {
        const popup = new MMapTextPopupMarker({coordinates: CENTER, content: 'Popup'});
        map.addChild(popup);
        const popupElement = document.querySelector<HTMLElement>(
            '.mappable--popup-marker .mappable--default-text-popup'
        );
        expect(popupElement.textContent).toBe('Popup');

        popup.update({content: 'New content'});
        expect(popupElement.textContent).toBe('New content');
    });
});
