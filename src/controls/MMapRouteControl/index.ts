import {
    BaseRouteResponse,
    DomDetach,
    Feature,
    LngLat,
    MMap,
    MMapControl,
    SearchResponse,
    SuggestResponse
} from '@mappable-world/mappable-types';
import {RouteOptions, TruckParameters} from '@mappable-world/mappable-types/imperative/route';
import {CustomSearch, CustomSuggest} from '../MMapSearchControl';
import {MMapWaypointInput, MMapWaypointInputProps, SelectWaypointArgs} from './MMapWaypointInput';
import {createActionsContainer, createSegmentedControl} from './helpers';
import './index.css';

type WaypointsArray = Array<SelectWaypointArgs['feature'] | null>;

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
    onMouseMoveOnMap?: (coordinates: LngLat, index: number, lastCall: boolean) => void;
    onUpdateWaypoints?: (waypoints: WaypointsArray) => void;
    onRouteResult?: (result: BaseRouteResponse, type: AvailableTypes) => void;
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

    private _waypoints: WaypointsArray = [null, null];

    private _routeMode: RouteOptions['type'];

    private _detachDom?: DomDetach;

    protected _onAttach(): void {
        this._rootElement = document.createElement('mappable');
        this._rootElement.classList.add('mappable--route-control');

        this._routeMode = this._props.availableTypes[0];
        this._routeModesElement = createSegmentedControl(this._props.availableTypes);
        this._routeModesElement.addEventListener('change', this.__onUpdateRouteMode);
        this._rootElement.appendChild(this._routeModesElement);

        this._waypointsElement = document.createElement('mappable');
        this._waypointsElement.classList.add('mappable--route-control_waypoints');
        this._rootElement.appendChild(this._waypointsElement);

        this._waypointInputFromElement = this.__createWaypointInput('from');
        this._waypointInputToElement = this.__createWaypointInput('to');

        this._actionsElement = createActionsContainer();
        this._rootElement.appendChild(this._actionsElement);
        this._detachDom = mappable.useDomContext(this, this._rootElement, this._waypointsElement);

        this.addChild(this._waypointInputFromElement);
        this.addChild(this._waypointInputToElement);
    }

    private __createWaypointInput(type: MMapWaypointInputProps['type']): MMapWaypointInput {
        const waypointIndex = type === 'from' ? 0 : 1;
        return new MMapWaypointInput({
            type,
            onSelectWaypoint: ({feature}) => {
                this._waypoints[waypointIndex] = feature;
                if (!this._waypoints[0]) {
                    this._waypoints[0] = null;
                }
                this._onUpdateWaypoints(feature, waypointIndex);
            },
            onMouseMoveOnMap: (coordinates, lastCall) => {
                this._props.onMouseMoveOnMap?.(coordinates, waypointIndex, lastCall);
            }
        });
    }

    private _onUpdateWaypoints(feature: Feature, index: number) {
        this._waypoints[index] = feature;
        this._props.onUpdateWaypoints(this._waypoints);

        if (this._waypoints.every((point) => point !== null)) {
            this._route();
        }
    }

    private async _route() {
        if (!this._waypoints.every((point) => point !== null)) {
            return;
        }
        const points = this._waypoints.map((point) => point.geometry.coordinates);
        const type = this._routeMode;
        const params = {points, type};

        const response = (await this._props.route?.({params, map: this.root})) ?? (await mappable.route(params));
        this._props.onRouteResult(response[0], this._routeMode);
    }

    protected _onDetach(): void {
        this._detachDom?.();
        this._detachDom = undefined;
    }

    private __onUpdateRouteMode = (e: Event) => {
        const target = e.target as HTMLInputElement;
        this._routeMode = target.value as RouteOptions['type'];
        this._route();
    };
}
