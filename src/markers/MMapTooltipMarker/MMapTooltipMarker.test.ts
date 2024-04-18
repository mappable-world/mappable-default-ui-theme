import {MMap} from '@mappable-world/mappable-types';
import {createContainer, CENTER} from '../../../tests/common';
import {MMapTooltipMarker} from './';

describe('MMapTooltipMarker', () => {
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
        const tooltip = new MMapTooltipMarker({coordinates: CENTER, content: 'Tooltip'});
        map.addChild(tooltip);

        expect(document.querySelector('.mappable--balloon-marker .mappable--default-tooltip')).not.toBeNull();
    });
    it('change content props', () => {
        const tooltip = new MMapTooltipMarker({coordinates: CENTER, content: 'Tooltip'});
        map.addChild(tooltip);
        const tooltipElement = document.querySelector<HTMLElement>(
            '.mappable--balloon-marker .mappable--default-tooltip'
        );
        expect(tooltipElement.textContent).toBe('Tooltip');

        tooltip.update({content: 'New content'});
        expect(tooltipElement.textContent).toBe('New content');
    });
});
