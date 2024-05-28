import {AvailableTypes} from '.';
import changeOrderSVG from './icons/change-order.svg';
import drivingSVG from './icons/driving.svg';
import transitSVG from './icons/transit.svg';
import truckSVG from './icons/truck.svg';
import walkingSVG from './icons/walking.svg';

const svgIcons: Record<AvailableTypes, string> = {
    driving: drivingSVG,
    truck: truckSVG,
    walking: walkingSVG,
    transit: transitSVG
};

export function createSegmentedControl(availableTypes: AvailableTypes[]): HTMLElement {
    const element = document.createElement('mappable');
    element.classList.add('mappable--route-control_modes');

    const container = document.createElement('mappable');
    container.classList.add('mappable--route-control_modes__container');
    element.appendChild(container);

    // TODO: Do it normally
    if (availableTypes.length < 1) {
        throw new Error('The route must contain at least one type of route.');
    }

    const options: {option: HTMLInputElement; label: HTMLLabelElement}[] = [];
    (['driving', 'truck', 'walking', 'transit'] as AvailableTypes[]).forEach((routeType) => {
        if (!availableTypes.includes(routeType)) {
            return;
        }
        const option = document.createElement('input');
        const label = document.createElement('label');

        option.type = 'radio';
        option.id = routeType;
        option.value = routeType;
        label.htmlFor = routeType;
        label.insertAdjacentHTML('afterbegin', svgIcons[routeType]);
        option.name = 'route-mode';
        options.push({option, label});
    });

    options[0].option.checked = true;

    options.forEach(({option, label}) => {
        container.appendChild(option);
        container.appendChild(label);
    });

    return element;
}

export function createActionsContainer(): HTMLElement {
    const container = document.createElement('mappable');
    container.classList.add('mappable--route-control_actions');

    const changeOrderButton = document.createElement('button');
    changeOrderButton.insertAdjacentHTML('afterbegin', changeOrderSVG);
    const changeOrderButtonLabel = document.createElement('span');
    changeOrderButtonLabel.textContent = 'Change the order';
    changeOrderButton.appendChild(changeOrderButtonLabel);

    const clearFieldsButton = document.createElement('button');
    clearFieldsButton.textContent = 'Clear all';

    container.appendChild(changeOrderButton);
    container.appendChild(clearFieldsButton);

    return container;
}
