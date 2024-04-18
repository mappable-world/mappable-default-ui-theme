import {MMap} from '@mappable-world/mappable-types';
import {createContainer, CENTER} from '../../../tests/common';
import {MMapBalloonMarker} from './';

describe('MMapBalloonMarker', () => {
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
        const balloon = new MMapBalloonMarker({coordinates: CENTER, content: createPopupContent});
        map.addChild(balloon);

        expect(document.querySelector('.mappable--balloon-marker')).not.toBeNull();
        expect(document.querySelector('.mappable--balloon-marker .test-popup')).not.toBeNull();
    });
    it('changing show props', () => {
        const balloon = new MMapBalloonMarker({show: true, coordinates: CENTER, content: createPopupContent});
        map.addChild(balloon);

        const popupMarkerElement = document.querySelector<HTMLElement>('.mappable--balloon-marker');
        expect(popupMarkerElement).not.toBeNull();

        expect(balloon.isOpen).toBe(true);
        expect(document.querySelector('.mappable--balloon-marker.hide')).toBeNull();

        balloon.update({show: false});
        expect(balloon.isOpen).toBe(false);
        expect(document.querySelector('.mappable--balloon-marker.hide')).not.toBeNull();

        balloon.update({show: true});
        expect(balloon.isOpen).toBe(true);
        expect(document.querySelector('.mappable--balloon-marker.hide')).toBeNull();
    });

    it('offset props', () => {
        const balloon = new MMapBalloonMarker({offset: 12, coordinates: CENTER, content: createPopupContent});
        map.addChild(balloon);

        const popupMarkerElement = document.querySelector<HTMLElement>('.mappable--balloon-marker');
        expect(popupMarkerElement.style.getPropertyValue('--offset')).toBe('12px');

        balloon.update({offset: 24});
        expect(popupMarkerElement.style.getPropertyValue('--offset')).toBe('24px');
    });

    describe('callback for closing and opening', () => {
        it('callback on open', (done) => {
            const onOpen = () => {
                expect(balloon.isOpen).toBe(true);
                done();
            };
            const balloon = new MMapBalloonMarker({
                show: true,
                coordinates: CENTER,
                content: createPopupContent,
                onOpen
            });
            map.addChild(balloon);
        });
        it('callback on close', (done) => {
            const onClose = () => {
                expect(balloon.isOpen).toBe(false);
                done();
            };
            const balloon = new MMapBalloonMarker({
                show: true,
                coordinates: CENTER,
                content: createPopupContent,
                onClose
            });
            map.addChild(balloon);
            balloon.update({show: false});
        });
    });

    describe('change popup position', () => {
        it('initial default position', () => {
            const balloon = new MMapBalloonMarker({coordinates: CENTER, content: createPopupContent});
            map.addChild(balloon);

            expect(document.querySelector('.mappable--balloon-marker.position-top')).not.toBeNull();
        });
        it('initial position', () => {
            const balloon = new MMapBalloonMarker({position: 'left', coordinates: CENTER, content: createPopupContent});
            map.addChild(balloon);

            expect(document.querySelector('.mappable--balloon-marker.position-left')).not.toBeNull();
        });
        it('change position props', () => {
            const balloon = new MMapBalloonMarker({coordinates: CENTER, content: createPopupContent});
            map.addChild(balloon);

            balloon.update({position: 'top'});
            expect(document.querySelector('.mappable--balloon-marker.position-top')).not.toBeNull();

            balloon.update({position: 'bottom'});
            expect(document.querySelector('.mappable--balloon-marker.position-bottom')).not.toBeNull();

            balloon.update({position: 'left'});
            expect(document.querySelector('.mappable--balloon-marker.position-left')).not.toBeNull();

            balloon.update({position: 'right'});
            expect(document.querySelector('.mappable--balloon-marker.position-right')).not.toBeNull();
        });
        it('change combined position props', () => {
            const balloon = new MMapBalloonMarker({coordinates: CENTER, content: createPopupContent});
            map.addChild(balloon);

            balloon.update({position: 'top left'});
            expect(document.querySelector('.mappable--balloon-marker.position-top.position-left')).not.toBeNull();
            balloon.update({position: 'top right'});
            expect(document.querySelector('.mappable--balloon-marker.position-top.position-right')).not.toBeNull();

            balloon.update({position: 'bottom left'});
            expect(document.querySelector('.mappable--balloon-marker.position-bottom.position-left')).not.toBeNull();
            balloon.update({position: 'bottom right'});
            expect(document.querySelector('.mappable--balloon-marker.position-bottom.position-right')).not.toBeNull();
        });
    });
});

const createPopupContent = () => {
    const popup = document.createElement('div');
    popup.classList.add('test-popup');
    return popup;
};
