import {LngLat} from '@mappable-world/mappable-types';

export const CENTER: LngLat = [0, 0];

export const createContainer = () => {
    const container = document.createElement('div');
    container.style.width = '640px';
    container.style.height = '480px';
    return container;
};
