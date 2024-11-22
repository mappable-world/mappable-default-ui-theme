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
import {CustomVuefyOptions} from '@mappable-world/mappable-types/modules/vuefy';
import type TVue from '@vue/runtime-core';
import debounce from 'lodash/debounce';
import {CustomSearch, CustomSuggest} from '../MMapSearchControl';
import {MMapWaypointInput, MMapWaypointInputProps, SelectWaypointArgs} from './MMapWaypointInput';
import {
    createActionsContainer,
    createInfoElementComponent,
    createLoadingSpinner,
    createRouteNoBuildError,
    createRouteServerError,
    createSegmentedControl
} from './helpers';
import './index.css';
import {formatDistance, formatDuration} from './utils';
import {areFuzzyEqual} from '../../common/utils';

export type WaypointsArray = Array<SelectWaypointArgs['feature'] | null>;

export type AvailableTypes = RouteOptions['type'];

export type CustomRoute = {
    params: RouteOptions;
    map: MMap;
};

export type MMapRouteControlProps = {
    geolocationTextInput?: string;
    clearFieldsText?: string;
    changeOrderText?: string;
    availableTypes?: AvailableTypes[];
    truckParameters?: TruckParameters;
    waypoints?: [LngLat | null, LngLat | null];
    waypointsPlaceholders?: [string, string];
    autofocus?: boolean;
    search?: (args: CustomSearch) => Promise<SearchResponse> | SearchResponse;
    suggest?: (args: CustomSuggest) => Promise<SuggestResponse> | SuggestResponse;
    route?: (args: CustomRoute) => Promise<BaseRouteResponse[]> | BaseRouteResponse[];
    onMouseMoveOnMap?: (coordinates: LngLat, index: number, lastCall: boolean) => void;
    onUpdateWaypoints?: (waypoints: WaypointsArray) => void;
    onRouteResult?: (result: BaseRouteResponse, type: AvailableTypes) => void;
    onBuildRouteError?: () => void;
};

const defaultProps = Object.freeze({
    geolocationTextInput: 'My location',
    clearFieldsText: 'Clear all',
    changeOrderText: 'Change the order',
    waypointsPlaceholders: ['From', 'To'],
    availableTypes: ['driving', 'truck', 'walking', 'transit'],
    autofocus: true
});
type DefaultProps = typeof defaultProps;

const MMapRouteControlVuefyOptions: CustomVuefyOptions<MMapRouteControl> = {
    props: {
        geolocationTextInput: {type: String, default: defaultProps.geolocationTextInput},
        clearFieldsText: {type: String, default: defaultProps.clearFieldsText},
        changeOrderText: {type: String, default: defaultProps.changeOrderText},
        availableTypes: {type: Array as TVue.PropType<AvailableTypes[]>, default: defaultProps.availableTypes},
        truckParameters: Object as TVue.PropType<TruckParameters>,
        waypoints: Array as unknown as TVue.PropType<[LngLat | null, LngLat | null]>,
        waypointsPlaceholders: {
            type: Array as unknown as TVue.PropType<[string, string]>,
            default: defaultProps.waypointsPlaceholders
        },
        search: Function as TVue.PropType<MMapRouteControlProps['search']>,
        suggest: Function as TVue.PropType<MMapRouteControlProps['suggest']>,
        route: Function as TVue.PropType<MMapRouteControlProps['route']>,
        onMouseMoveOnMap: Function as TVue.PropType<MMapRouteControlProps['onMouseMoveOnMap']>,
        onUpdateWaypoints: Function as TVue.PropType<MMapRouteControlProps['onUpdateWaypoints']>,
        onRouteResult: Function as TVue.PropType<MMapRouteControlProps['onRouteResult']>,
        onBuildRouteError: Function as TVue.PropType<MMapRouteControlProps['onBuildRouteError']>,
        autofocus: {
            type: Boolean as TVue.PropType<MMapRouteControlProps['autofocus']>,
            default: defaultProps.autofocus
        }
    }
};

export class MMapRouteControl extends mappable.MMapComplexEntity<MMapRouteControlProps, DefaultProps> {
    static defaultProps = defaultProps;
    static [mappable.optionsKeyVuefy] = MMapRouteControlVuefyOptions;

    private _control: MMapControl;
    private _router: MMapCommonRouteControl;

    constructor(props: MMapRouteControlProps) {
        super(props, {container: true});
    }

    protected _onAttach(): void {
        this._control = new mappable.MMapControl({transparent: true});
        this._router = new MMapCommonRouteControl(this._props);

        this._control.addChild(this._router);

        this._addDirectChild(this._control);
    }

    protected _onUpdate(props: Partial<MMapRouteControlProps>): void {
        this._router.update(props);
    }

    protected _onDetach(): void {
        this._removeDirectChild(this._control);
    }
}

class MMapCommonRouteControl extends mappable.MMapComplexEntity<MMapRouteControlProps> {
    private _rootElement: HTMLElement;
    private _routeParametersElement: HTMLElement;
    private _routeInfoElement: HTMLElement;

    private _routeModesElement: HTMLElement;
    private _waypointsElement: HTMLElement;
    private _waypointInputFromElement: MMapWaypointInput;
    private _waypointInputToElement: MMapWaypointInput;
    private _actionsContainerElement: HTMLElement;
    private _changeOrderButton: HTMLButtonElement;
    private _clearFieldsButton: HTMLButtonElement;

    private _waypoints: WaypointsArray = [null, null];

    private _routeMode: RouteOptions['type'];

    private _detachDom?: DomDetach;

    protected _onAttach(): void {
        this._rootElement = document.createElement('mappable');
        this._rootElement.classList.add('mappable--route-control');

        this._routeParametersElement = document.createElement('mappable');
        this._routeParametersElement.classList.add('mappable--route-control_parameters');
        this._rootElement.appendChild(this._routeParametersElement);

        this._routeInfoElement = document.createElement('mappable');
        this._routeInfoElement.classList.add('mappable--route-control_info');

        this._routeMode = this._props.availableTypes[0];
        this._routeModesElement = createSegmentedControl(this._props.availableTypes);
        this._routeModesElement.addEventListener('change', this._onUpdateRouteMode);
        this._routeParametersElement.appendChild(this._routeModesElement);

        this._waypointsElement = document.createElement('mappable');
        this._waypointsElement.classList.add('mappable--route-control_waypoints');
        this._routeParametersElement.appendChild(this._waypointsElement);

        this._waypointInputFromElement = this._createWaypointInput('from', this._props.waypoints?.[0] ?? undefined);
        this._waypointInputToElement = this._createWaypointInput('to', this._props.waypoints?.[1] ?? undefined);

        const {container, changeOrderButton, clearFieldsButton} = createActionsContainer({
            clearFieldsText: this._props.clearFieldsText,
            changeOrderText: this._props.changeOrderText
        });
        this._changeOrderButton = changeOrderButton;
        this._changeOrderButton.addEventListener('click', this._changeOrder);
        this._clearFieldsButton = clearFieldsButton;
        this._clearFieldsButton.addEventListener('click', this._clearAll);
        this._actionsContainerElement = container;
        this._routeParametersElement.appendChild(this._actionsContainerElement);

        this._detachDom = mappable.useDomContext(this, this._rootElement, this._waypointsElement);

        this.addChild(this._waypointInputFromElement);
        this.addChild(this._waypointInputToElement);

        this._watchContext(
            mappable.ControlContext,
            () => {
                const controlCtx = this._consumeContext(mappable.ControlContext);
                const [verticalPosition] = controlCtx.position;
                this._rootElement.classList.toggle('mappable--route-control_bottom', verticalPosition === 'bottom');
            },
            {immediate: true}
        );
        this._watchContext(
            mappable.ThemeContext,
            () => {
                const {theme} = this._consumeContext(mappable.ThemeContext);
                this._rootElement.classList.toggle('_dark', theme === 'dark');
            },
            {immediate: true}
        );
    }

    protected _onUpdate(diffProps: Partial<MMapRouteControlProps>): void {
        if (diffProps.search !== undefined) {
            this._waypointInputFromElement.update({search: diffProps.search});
            this._waypointInputToElement.update({search: diffProps.search});
        }
        if (diffProps.suggest !== undefined) {
            this._waypointInputFromElement.update({suggest: diffProps.suggest});
            this._waypointInputToElement.update({suggest: diffProps.suggest});
        }
        if (diffProps.waypoints !== undefined) {
            if (!areFuzzyEqual(this._waypoints[0].geometry.coordinates, diffProps.waypoints[0])) {
                this._waypointInputFromElement.update({waypoint: diffProps.waypoints[0], value: undefined});
            }
            if (!areFuzzyEqual(this._waypoints[1].geometry.coordinates, diffProps.waypoints[1])) {
                this._waypointInputToElement.update({waypoint: diffProps.waypoints[1], value: undefined});
            }
        }
        if (diffProps.geolocationTextInput !== undefined) {
            this._waypointInputFromElement.update({geolocationTextInput: diffProps.geolocationTextInput});
            this._waypointInputToElement.update({geolocationTextInput: diffProps.geolocationTextInput});
        }
        if (diffProps.waypointsPlaceholders !== undefined) {
            this._waypointInputFromElement.update({inputPlaceholder: diffProps.waypointsPlaceholders[0]});
            this._waypointInputToElement.update({inputPlaceholder: diffProps.waypointsPlaceholders[1]});
        }
        if (diffProps.clearFieldsText !== undefined) {
            this._clearFieldsButton.textContent = diffProps.clearFieldsText;
        }
        if (diffProps.changeOrderText !== undefined) {
            this._changeOrderButton.textContent = diffProps.changeOrderText;
        }
        if (diffProps.availableTypes !== undefined) {
            this._routeModesElement.replaceChildren(...createSegmentedControl(diffProps.availableTypes).children);
            this._setRouteMode(diffProps.availableTypes[0]);
        }
    }

    protected _onDetach(): void {
        this._detachDom?.();
        this._detachDom = undefined;

        this.removeChild(this._waypointInputFromElement);
        this.removeChild(this._waypointInputToElement);
    }

    private _createWaypointInput(type: MMapWaypointInputProps['type'], waypoint?: LngLat): MMapWaypointInput {
        const waypointIndex = type === 'from' ? 0 : 1;
        const {geolocationTextInput, onMouseMoveOnMap, waypointsPlaceholders, search, suggest} = this._props;
        return new MMapWaypointInput({
            type,
            inputPlaceholder: waypointsPlaceholders[waypointIndex],
            waypoint,
            geolocationTextInput,
            search,
            suggest,
            onSelectWaypoint: (result) => {
                if (result === null) {
                    this._waypoints[waypointIndex] = null;
                    this._onUpdateWaypoints(null, waypointIndex);
                    this._clearInfo();
                    return;
                }

                const {feature} = result;
                this._waypoints[waypointIndex] = feature;
                this._onUpdateWaypoints(feature, waypointIndex);
            },
            onMouseMoveOnMap: (coordinates, lastCall) => {
                onMouseMoveOnMap?.(coordinates, waypointIndex, lastCall);
            },
            onError: () => {
                this._showServerError(() => {
                    this._rootElement.removeChild(this._routeInfoElement);
                });
            }
        });
    }

    private _clearAll = () => {
        this._waypointInputFromElement.update({waypoint: null});
        this._waypointInputToElement.update({waypoint: null});
        this._clearInfo();
    };

    private _clearInfo = () => {
        this._routeInfoElement.replaceChildren();
        if (this._routeInfoElement.parentElement === this._rootElement) {
            this._rootElement.removeChild(this._routeInfoElement);
        }
    }

    private _changeOrder = () => {
        const [fromOld, toOld] = this._waypoints;
        const fromValue = this._waypointInputFromElement.getValue();
        const toValue = this._waypointInputToElement.getValue();
        this._waypointInputToElement.update({
            waypoint: fromOld === null ? null : fromOld.geometry.coordinates,
            value: !fromValue ? null : fromValue
        });
        this._waypointInputFromElement.update({
            waypoint: toOld === null ? null : toOld.geometry.coordinates,
            value: !toValue ? null : toValue
        });
    };

    private _onUpdateWaypoints(feature: Feature | null, index: number) {
        this._waypoints[index] = feature;
        this._props.onUpdateWaypoints?.(this._waypoints);

        if (this._props.autofocus) {
            this._autofocusNextInput(index);
        }

        if (this._waypoints.every((point) => point !== null)) {
            this._route();
        }
    }

    private _autofocusNextInput(index: number): void {
        if (index === 0 && this._waypoints[1] === null) {
            this._waypointInputToElement.triggerFocus();
        } else if (index === 1 && this._waypoints[0] === null) {
            this._waypointInputFromElement.triggerFocus();
        }
    }

    private _onUpdateRouteMode = (e: Event) => {
        const target = e.target as HTMLInputElement;
        this._setRouteMode(target.value as RouteOptions['type']);
    };

    private _setRouteMode(mode: AvailableTypes): void {
        this._routeMode = mode;
        this._route();
    }

    private _route = debounce(async () => {
        if (!this._waypoints.every((point) => point !== null)) {
            return;
        }
        const points = this._waypoints.map((point) => point.geometry.coordinates);
        const type = this._routeMode;
        const params = {points, type, truck: type === 'truck' ? this._props.truckParameters : undefined};

        this._routeInfoElement.classList.remove('mappable--route-control_info__error');
        this._routeInfoElement.replaceChildren(createLoadingSpinner());
        try {
            const response = (await this._props.route?.({params, map: this.root})) ?? (await mappable.route(params));
            const route = response[0].toRoute();
            if (route.geometry.coordinates.length !== 0) {
                this._props.onRouteResult?.(response[0], this._routeMode);
                this._rootElement.appendChild(this._routeInfoElement);
                this._routeInfoElement.replaceChildren(...this._getRouteDetails(response[0]));
            } else {
                this._props.onBuildRouteError?.();
                this._rootElement.appendChild(this._routeInfoElement);
                this._routeInfoElement.classList.add('mappable--route-control_info__error');
                this._routeInfoElement.replaceChildren(...createRouteNoBuildError());
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            this._showServerError(() => this._route());
        }
    }, 200);

    private _showServerError(onButtonClick: () => void) {
        this._props.onBuildRouteError?.();
        this._rootElement.appendChild(this._routeInfoElement);
        this._routeInfoElement.classList.add('mappable--route-control_info__error');
        this._routeInfoElement.replaceChildren(...createRouteServerError(onButtonClick));
    }

    private _getRouteDetails(response: BaseRouteResponse): HTMLElement[] {
        if (!response.toSteps) {
            return [];
        }
        const steps = response.toSteps();
        let totalLength = 0;
        let totalDuration = 0;
        steps.forEach((step) => {
            totalLength += step.properties.length;
            totalDuration += step.properties.duration;
        });
        const formattedLength = formatDistance(totalLength);
        const formattedDuration = formatDuration(totalDuration);
        return [
            createInfoElementComponent('time', formattedDuration),
            createInfoElementComponent('distance', formattedLength)
        ];
    }
}
