import {AvailableTypes} from '.';
import changeOrderSVG from './icons/change-order.svg';
import drivingSVG from './icons/driving.svg';
import errorIconSVG from './icons/error-icon.svg';
import loadingSpinnerSVG from './icons/loading-spinner.svg';
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

export function createLoadingSpinner(): HTMLElement {
    const containerElement = document.createElement('mappable');
    containerElement.classList.add('mappable--route-control_info_loading');
    containerElement.insertAdjacentHTML('afterbegin', loadingSpinnerSVG);
    return containerElement;
}

export function createInfoElementComponent(type: 'time' | 'distance', value: string): HTMLElement {
    const containerElement = document.createElement('mappable');
    containerElement.classList.add('mappable--route-control_info_container');

    const labelEl = document.createElement('mappable');
    labelEl.classList.add('mappable--route-control_info_container__label');
    labelEl.textContent = type === 'time' ? 'Time of your route' : 'Distance';

    const valueEl = document.createElement('mappable');
    valueEl.classList.add('mappable--route-control_info_container__value');
    valueEl.textContent = value;

    containerElement.replaceChildren(labelEl, valueEl);

    return containerElement;
}

export function createRouteNoBuildError(): HTMLElement[] {
    const errorIcon = document.createElement('mappable');
    errorIcon.classList.add('mappable--route-control_info_error__icon');
    errorIcon.insertAdjacentHTML('afterbegin', errorIconSVG);

    const textContainer = document.createElement('mappable');
    textContainer.classList.add('mappable--route-control_info_error__text-container');

    const labelElement = document.createElement('mappable');
    labelElement.classList.add('mappable--route-control_info_error__label');
    labelElement.textContent = 'There is no opportunity to build route';

    const descriptionElement = document.createElement('mappable');
    descriptionElement.classList.add('mappable--route-control_info_error__description');
    descriptionElement.textContent =
        'Check the places of the start and finish points, or the availability of roads between';

    textContainer.replaceChildren(labelElement, descriptionElement);

    return [errorIcon, textContainer];
}

export function createRouteServerError(onClick: () => void): HTMLElement[] {
    const errorIcon = document.createElement('mappable');
    errorIcon.classList.add('mappable--route-control_info_error__icon');
    errorIcon.insertAdjacentHTML('afterbegin', errorIconSVG);

    const labelElement = document.createElement('mappable');
    labelElement.classList.add('mappable--route-control_info_error__label');
    labelElement.textContent = 'Server error';

    const buttonElement = document.createElement('button');
    buttonElement.classList.add('mappable--route-control_info_error__button');
    buttonElement.textContent = 'Build a rout again';
    buttonElement.addEventListener('click', onClick);

    return [errorIcon, labelElement, buttonElement];
}
