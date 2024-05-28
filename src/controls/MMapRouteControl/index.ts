import {
    BaseRouteResponse,
    DomDetach,
    MMap,
    MMapControl,
    SearchResponse,
    SuggestResponse
} from '@mappable-world/mappable-types';
import {RouteOptions, TruckParameters} from '@mappable-world/mappable-types/imperative/route';
import type {Feature as SearchResponseFeature} from '@mappable-world/mappable-types/imperative/search';
import {CustomSearch, CustomSuggest} from '../MMapSearchControl';
import {MMapWaypointInput} from './MMapWaypointInput';
import {createActionsContainer, createSegmentedControl} from './helpers';
import './index.css';

export type AvailableTypes = RouteOptions['type'];

export type CustomRoute = {
    params: RouteOptions;
    map: MMap;
};

export type MMapRouteControlProps = {
    availableTypes?: AvailableTypes[];
    truckParameters?: TruckParameters;
    search?: (args: CustomSearch) => Promise<SearchResponse> | SearchResponse;
    suggest?: (args: CustomSuggest) => Promise<SuggestResponse> | SuggestResponse;
    route?: (args: CustomRoute) => Promise<BaseRouteResponse[]> | BaseRouteResponse[];
    onUpdateWaypoints?: (waypoints: SearchResponseFeature[]) => void;
    onRouteResult?: (result: BaseRouteResponse) => void;
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
    private _waypointInputFromElement: MMapWaypointInput;
    private _waypointInputToElement: MMapWaypointInput;
    private _actionsElement: HTMLElement;

    private _routeMode: RouteOptions['type'];

    private _detachDom?: DomDetach;

    protected _onAttach(): void {
        this._rootElement = document.createElement('mappable');
        this._rootElement.classList.add('mappable--route-control');

        this._routeModesElement = createSegmentedControl(this._props.availableTypes);
        this._routeModesElement.addEventListener('change', this.__onUpdateRouteMode);
        this._rootElement.appendChild(this._routeModesElement);

        this._waypointsElement = document.createElement('mappable');
        this._waypointsElement.classList.add('mappable--route-control_waypoints');
        this._rootElement.appendChild(this._waypointsElement);

        this._waypointInputFromElement = new MMapWaypointInput({
            type: 'from',
            onSelectWaypoint: (res) => {
                console.log('from', res.feature.geometry.coordinates, res.feature.properties.name);
            }
        });
        this._waypointInputToElement = new MMapWaypointInput({
            type: 'to',
            onSelectWaypoint: (res) => {
                console.log('to', res.feature.geometry.coordinates, res.feature.properties.name);
            }
        });

        this._actionsElement = createActionsContainer();
        this._rootElement.appendChild(this._actionsElement);
        this._detachDom = mappable.useDomContext(this, this._rootElement, this._waypointsElement);

        this.addChild(this._waypointInputFromElement);
        this.addChild(this._waypointInputToElement);
    }

    protected _onDetach(): void {
        this._detachDom?.();
        this._detachDom = undefined;
    }

    private __onUpdateRouteMode = (e: Event) => {
        const target = e.target as HTMLInputElement;
        this._routeMode = target.value as RouteOptions['type'];
    };
}
