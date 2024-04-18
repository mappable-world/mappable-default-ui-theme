import {MMap} from '@mappable-world/mappable-types';
import {createContainer, CENTER} from '../../../tests/common';
import {MMapDefaultPopupMarker} from './';

describe('MMapDefaultPopupMarker', () => {
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
        const defaultPopup = new MMapDefaultPopupMarker({coordinates: CENTER, title: 'Title'});
        map.addChild(defaultPopup);

        expect(document.querySelector(BASE_SELECTOR)).not.toBeNull();
    });

    it('title props', () => {
        const defaultPopup = new MMapDefaultPopupMarker({title: 'Title', coordinates: CENTER});
        map.addChild(defaultPopup);
        let titleElement = document.querySelector(`${BASE_SELECTOR} .mappable--default-popup_header_title`);
        expect(titleElement.textContent).toBe('Title');

        defaultPopup.update({title: 'New Title'});
        titleElement = document.querySelector(`${BASE_SELECTOR} .mappable--default-popup_header_title`);
        expect(titleElement.textContent).toBe('New Title');
    });

    it('description props', () => {
        const defaultPopup = new MMapDefaultPopupMarker({description: 'Description', coordinates: CENTER});
        map.addChild(defaultPopup);
        let descriptionElement = document.querySelector(`${BASE_SELECTOR} .mappable--default-popup_description`);
        expect(descriptionElement.textContent).toBe('Description');

        defaultPopup.update({description: 'New Description'});
        descriptionElement = document.querySelector(`${BASE_SELECTOR} .mappable--default-popup_description`);
        expect(descriptionElement.textContent).toBe('New Description');
    });

    it('action props', () => {
        const defaultPopup = new MMapDefaultPopupMarker({action: 'Action', coordinates: CENTER});
        map.addChild(defaultPopup);
        let actionButton = document.querySelector(`${BASE_SELECTOR} .mappable--default-popup_action`);
        expect(actionButton.textContent).toBe('Action');

        defaultPopup.update({action: 'New Action'});
        actionButton = document.querySelector(`${BASE_SELECTOR} .mappable--default-popup_action`);
        expect(actionButton.textContent).toBe('New Action');
    });

    describe('test buttons', () => {
        it('click close button', (done) => {
            const onClose = () => {
                expect(defaultPopup.isOpen).toBe(false);
                done();
            };
            const defaultPopup = new MMapDefaultPopupMarker({title: 'Title', coordinates: CENTER, onClose});
            map.addChild(defaultPopup);

            const closeButton = document.querySelector(`${BASE_SELECTOR} .mappable--default-popup_header_close`);
            expect(closeButton).not.toBeNull();

            const event = new MouseEvent('click');
            closeButton.dispatchEvent(event);
        });
        it('click action button', (done) => {
            const onAction = () => {
                done();
            };
            const defaultPopup = new MMapDefaultPopupMarker({action: 'Action', coordinates: CENTER, onAction});
            map.addChild(defaultPopup);

            const actionButton = document.querySelector(`${BASE_SELECTOR} .mappable--default-popup_action`);
            expect(actionButton).not.toBeNull();

            const event = new MouseEvent('click');
            actionButton.dispatchEvent(event);
        });
    });
});

const BASE_SELECTOR = '.mappable--balloon-marker .mappable--default-popup';
