import {
    DomDetach,
    DomEvent,
    DomEventHandlerObject,
    LngLat,
    MMapListener,
    SearchResponse,
    SuggestResponse
} from '@mappable-world/mappable-types';
import type {Feature as SearchResponseFeature} from '@mappable-world/mappable-types/imperative/search';
import debounce from 'lodash/debounce';
import {CustomSearch, CustomSuggest, SearchParams} from '../../MMapSearchControl';
import {MMapSuggest} from '../../MMapSearchControl/MMapSuggest';
import emptyIndicatorSVG from '../icons/indicators/empty-indicator.svg';
import fromFocusIndicator from '../icons/indicators/from-focus-indicator.svg';
import fromSettedIndicator from '../icons/indicators/from-setted-indicator.svg';
import toFocusIndicator from '../icons/indicators/to-focus-indicator.svg';
import toSettedIndicator from '../icons/indicators/to-setted-indicator.svg';
import locationSVG from '../icons/location-button.svg';
import './index.css';

const focusIndicator = {
    from: fromFocusIndicator,
    to: toFocusIndicator
};

const settedIndicator = {
    from: fromSettedIndicator,
    to: toSettedIndicator
};

export type SelectWaypointArgs = {
    feature: SearchResponseFeature;
};

export type MMapWaypointInputProps = {
    type: 'from' | 'to';
    waypoint?: LngLat | null;
    search?: ({params, map}: CustomSearch) => Promise<SearchResponse> | SearchResponse;
    suggest?: (args: CustomSuggest) => Promise<SuggestResponse> | SuggestResponse;
    onSelectWaypoint?: (args: SelectWaypointArgs | null) => void;
    onMouseMoveOnMap?: (coordinates: LngLat, lastCall: boolean) => void;
};

export class MMapWaypointInput extends mappable.MMapComplexEntity<MMapWaypointInputProps> {
    private _detachDom?: DomDetach;
    private _suggestComponent?: MMapSuggest;

    private _rootElement: HTMLElement;
    private _isBottomPosition: boolean;
    private _inputEl: HTMLInputElement;
    private _indicator: HTMLElement;

    private _mapListener: MMapListener;

    private _isHoverMode = false;

    private get _isInputFocused(): boolean {
        return document.activeElement === this._inputEl;
    }

    constructor(props: MMapWaypointInputProps) {
        super(props, {container: true});
    }

    protected _onAttach(): void {
        this._rootElement = document.createElement('mappable');
        this._rootElement.classList.add('mappable--route-control_waypoint-input');

        const form = document.createElement('form');
        form.addEventListener('submit', this._submitWaypointInput);
        form.classList.add('mappable--route-control_waypoint-input_form');

        this._indicator = document.createElement('mappable');
        this._indicator.classList.add('mappable--route-control_waypoint-input__indicator');
        this._indicator.insertAdjacentHTML('afterbegin', emptyIndicatorSVG);
        form.appendChild(this._indicator);

        this._inputEl = document.createElement('input');
        this._inputEl.classList.add('mappable--route-control_waypoint-input__field');
        this._inputEl.placeholder = this._props.type === 'from' ? 'From' : 'To';
        this._inputEl.addEventListener('input', this._onUpdateWaypoint);
        this._inputEl.addEventListener('focus', this._onFocusInput);
        this._inputEl.addEventListener('blur', this._onBlurInput);
        this._inputEl.addEventListener('keydown', this._onKeydownInput);
        form.appendChild(this._inputEl);

        const locationButton = document.createElement('button');
        locationButton.classList.add('mappable--route-control_waypoint-input__button');
        locationButton.insertAdjacentHTML('afterbegin', locationSVG);
        form.appendChild(locationButton);

        const suggestContainer = document.createElement('mappable');
        suggestContainer.classList.add('mappable--route-control_waypoint-input_suggest');

        this._rootElement.appendChild(form);
        this._rootElement.appendChild(suggestContainer);

        this._suggestComponent = new MMapSuggest({
            suggest: this._props.suggest,
            setSearchInputValue: (text) => {
                this._inputEl.value = text;
            },
            onSuggestClick: (params: SearchParams) => {
                this._inputEl.value = params.text;
                this._submitWaypointInput();
            }
        });

        this._mapListener = new mappable.MMapListener({
            onMouseMove: this._onMapMouseMove,
            onMouseLeave: this._onMapMouseLeave,
            onFastClick: this._onMapFastClick
        });
        this._addDirectChild(this._mapListener);

        this._detachDom = mappable.useDomContext(this, this._rootElement, suggestContainer);

        this._watchContext(
            mappable.ControlContext,
            () => {
                const controlCtx = this._consumeContext(mappable.ControlContext);
                const [verticalPosition] = controlCtx.position;
                this._isBottomPosition = verticalPosition === 'bottom';
                suggestContainer.classList.toggle('_bottom', this._isBottomPosition);
            },
            {immediate: true}
        );

        if (this._props.waypoint !== undefined && this._props.waypoint !== null) {
            this._search({text: this._props.waypoint.toString()}, this._props.waypoint);
        }
    }

    protected _onUpdate(): void {
        if (this._props.waypoint !== undefined) {
            if (this._props.waypoint === null) {
                this._props.waypoint = undefined;
                this._resetInput();
            } else {
                this._search({text: this._props.waypoint.toString()}, this._props.waypoint);
            }
        }
    }

    protected _onDetach(): void {
        this._detachDom?.();
        this._detachDom = undefined;
    }

    private _resetInput() {
        this._inputEl.value = '';

        this._indicator.innerHTML = '';
        this._indicator.insertAdjacentHTML('afterbegin', emptyIndicatorSVG);

        this._props.onSelectWaypoint(null);
    }

    private _onUpdateWaypoint = debounce((e: Event) => {
        const target = e.target as HTMLInputElement;
        this._suggestComponent.update({searchInputValue: target.value});
    }, 200);

    private _onFocusInput = (_event: FocusEvent) => {
        this.addChild(this._suggestComponent);
        this._indicator.innerHTML = '';
        this._indicator.insertAdjacentHTML('afterbegin', focusIndicator[this._props.type]);
    };

    private _onBlurInput = (event: FocusEvent) => {
        if (this._isHoverMode) {
            this._inputEl.focus();
        }
        if (event.relatedTarget !== this._suggestComponent.activeSuggest) {
            this.removeChild(this._suggestComponent);
        }
        this._indicator.innerHTML = '';
        this._indicator.insertAdjacentHTML('afterbegin', emptyIndicatorSVG);
    };

    private _submitWaypointInput = (event?: SubmitEvent) => {
        event?.preventDefault();
        if (!this._suggestComponent.activeSuggest) {
            this._inputEl.focus();
            return;
        }
        const {uri, text} = this._suggestComponent.activeSuggest.dataset;
        this._search({uri, text});
        this.removeChild(this._suggestComponent);
        this._inputEl.blur();
    };

    private _onKeydownInput = (event: KeyboardEvent) => {
        switch (event.key) {
            case 'Down': // IE/Edge specific value
            case 'ArrowDown':
                event.preventDefault();
                this._suggestComponent.update({suggestNavigationAction: {isNextSuggest: !this._isBottomPosition}});
                break;
            case 'Up': // IE/Edge specific value
            case 'ArrowUp':
                event.preventDefault();
                this._suggestComponent.update({suggestNavigationAction: {isNextSuggest: this._isBottomPosition}});
                break;
        }
    };

    private async _search(params: SearchParams, reverseGeocodingCoordinate?: LngLat) {
        const searchResult = (await this._props.search?.({params, map: this.root})) ?? (await mappable.search(params));
        const feature = searchResult[0];
        if (reverseGeocodingCoordinate) {
            this._inputEl.value = feature.properties.name;
            feature.geometry.coordinates = reverseGeocodingCoordinate;
        }
        this._indicator.innerHTML = '';
        this._indicator.insertAdjacentHTML('afterbegin', settedIndicator[this._props.type]);
        this._props.onSelectWaypoint({feature});
    }

    private _onMapMouseLeave = (object: DomEventHandlerObject, event: DomEvent): void => {
        if (this._isInputFocused && object === undefined) {
            this._isHoverMode = false;
            this._props.onMouseMoveOnMap?.(event.coordinates, true);
        }
    };

    private _onMapMouseMove = (object: DomEventHandlerObject, event: DomEvent): void => {
        if (this._isInputFocused) {
            this._isHoverMode = true;
            this._props.onMouseMoveOnMap?.(event.coordinates, false);
        }
    };

    private _onMapFastClick = (object: DomEventHandlerObject, event: DomEvent): void => {
        if (this._isInputFocused) {
            this._isHoverMode = false;
            this._inputEl.blur();
            this._search({text: event.coordinates.toString()}, event.coordinates);
        }
    };
}
