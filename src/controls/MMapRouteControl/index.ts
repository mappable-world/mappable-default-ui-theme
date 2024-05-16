import {DomDetach, MMapControl} from '@mappable-world/mappable-types';
import {RouteOptions, TruckParameters} from '@mappable-world/mappable-types/imperative/route';

import drivingSVG from './icons/driving.svg';
import truckSVG from './icons/truck.svg';
import walkingSVG from './icons/walking.svg';
import transitSVG from './icons/transit.svg';
import emptyIndicatorSVG from './icons/empty-field.svg';
import locationSVG from './icons/location-button.svg';
import changeOrderSVG from './icons/change-order.svg';

import './index.css';

const svgIcons: Record<AvailableTypes, string> = {
    driving: drivingSVG,
    truck: truckSVG,
    walking: walkingSVG,
    transit: transitSVG
};

export type AvailableTypes = RouteOptions['type'];

export type MMapRouteControlProps = {
    availableTypes?: AvailableTypes[];
    truckParameters?: TruckParameters;
};

const defaultProps = Object.freeze({availableTypes: ['driving', 'truck', 'walking', 'transit']});
type DefaultProps = typeof defaultProps;

export class MMapRouteControl extends mappable.MMapComplexEntity<MMapRouteControlProps, DefaultProps> {
    static defaultProps = defaultProps;

    private _control: MMapControl;
    private _router: MMapCommonRouteControl;

    constructor(props: MMapRouteControlProps) {
        super(props);
    }

    protected _onAttach(): void {
        this._control = new mappable.MMapControl({transparent: true});
        this._router = new MMapCommonRouteControl(this._props);

        this._control.addChild(this._router);
        this.addChild(this._control);
    }
}

class MMapCommonRouteControl extends mappable.MMapComplexEntity<MMapRouteControlProps> {
    private _rootElement: HTMLElement;
    private _routeModesElement: HTMLElement;
    private _waypointsElement: HTMLElement;
    private _waypointInputFromElement: HTMLElement;
    private _waypointInputToElement: HTMLElement;
    private _actionsElement: HTMLElement;

    private _detachDom?: DomDetach;

    protected _onAttach(): void {
        this._rootElement = document.createElement('mappable');
        this._rootElement.classList.add('mappable--route-control');

        this._routeModesElement = this.__createSegmentedControl();
        this._rootElement.appendChild(this._routeModesElement);

        this._waypointsElement = document.createElement('mappable');
        this._waypointsElement.classList.add('mappable--route-control_waypoints');
        this._rootElement.appendChild(this._waypointsElement);

        this._waypointInputFromElement = this.__createWaypointInput('from');
        this._waypointInputToElement = this.__createWaypointInput('to');
        this._waypointsElement.appendChild(this._waypointInputFromElement);
        this._waypointsElement.appendChild(this._waypointInputToElement);

        this._actionsElement = this.__createActionsContainer();
        this._rootElement.appendChild(this._actionsElement);

        this._detachDom = mappable.useDomContext(this, this._rootElement, null);
    }

    protected _onDetach(): void {
        this._detachDom?.();
        this._detachDom = undefined;
    }

    private __createSegmentedControl(): HTMLElement {
        const element = document.createElement('mappable');
        element.classList.add('mappable--route-control_modes');

        const container = document.createElement('mappable');
        container.classList.add('mappable--route-control_modes__container');
        element.appendChild(container);

        // TODO: Do it normally
        if (this._props.availableTypes.length < 1) {
            throw new Error('The route must contain at least one type of route.');
        }

        const options: {option: HTMLInputElement; label: HTMLLabelElement}[] = [];
        (['driving', 'truck', 'walking', 'transit'] as AvailableTypes[]).forEach((routeType) => {
            if (!this._props.availableTypes.includes(routeType)) {
                return;
            }
            const option = document.createElement('input');
            const label = document.createElement('label');

            option.type = 'radio';
            option.id = routeType;
            label.htmlFor = routeType;
            label.innerHTML = svgIcons[routeType];
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

    private __createWaypointInput(type: 'from' | 'to'): HTMLElement {
        const element = document.createElement('mappable');
        element.classList.add('mappable--route-control_waypoint-input');

        const indicator = document.createElement('mappable');
        indicator.classList.add('mappable--route-control_waypoint-input__indicator');
        indicator.innerHTML = emptyIndicatorSVG;
        element.appendChild(indicator);

        const input = document.createElement('input');
        input.classList.add('mappable--route-control_waypoint-input__field');
        input.placeholder = type === 'from' ? 'From' : 'To';
        element.appendChild(input);

        const locationButton = document.createElement('button');
        locationButton.classList.add('mappable--route-control_waypoint-input__button');
        locationButton.innerHTML = locationSVG;
        element.appendChild(locationButton);

        return element;
    }

    private __createActionsContainer(): HTMLElement {
        const container = document.createElement('mappable');
        container.classList.add('mappable--route-control_actions');

        const changeOrderButton = document.createElement('button');
        changeOrderButton.innerHTML = changeOrderSVG;
        const changeOrderButtonLabel = document.createElement('span');
        changeOrderButtonLabel.textContent = 'Change the order';
        changeOrderButton.appendChild(changeOrderButtonLabel);

        const clearFieldsButton = document.createElement('button');
        clearFieldsButton.textContent = 'Clear all';

        container.appendChild(changeOrderButton);
        container.appendChild(clearFieldsButton);

        return container;
    }
}
