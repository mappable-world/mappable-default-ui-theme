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
import focusIndicatorSVG from '../icons/indicators/focus-indicator.svg';
import settedIndicatorSVG from '../icons/indicators/setted-indicator.svg';
import locationSVG from '../icons/location-button.svg';
import resetSVG from '../icons/reset-button.svg';
import './index.css';

const INDICATOR_COLORS = {
    light: {from: '#2E4CE5', to: '#313133'},
    dark: {from: '#D6FD63', to: '#C8D2E6'}
};

const DELAY_BETWEEN_BLUR_AND_CLICK = 200;

export type SelectWaypointArgs = {
    feature: SearchResponseFeature;
};

export type MMapWaypointInputProps = {
    type: 'from' | 'to';
    inputPlaceholder: string;
    value?: string;
    waypoint?: LngLat | null;
    geolocationTextInput?: string;
    search?: ({params, map}: CustomSearch) => Promise<SearchResponse> | SearchResponse;
    suggest?: (args: CustomSuggest) => Promise<SuggestResponse> | SuggestResponse;
    onSelectWaypoint?: (args: SelectWaypointArgs | null) => void;
    onMouseMoveOnMap?: (coordinates: LngLat, lastCall: boolean) => void;
    onError?: () => void;
};

const defaultProps = Object.freeze({geolocationTextInput: 'My location'});

/**
 * @internal
 */
export class MMapWaypointInput extends mappable.MMapComplexEntity<MMapWaypointInputProps, typeof defaultProps> {
    static defaultProps = defaultProps;
    private _detachDom?: DomDetach;
    private _suggestComponent?: MMapSuggest;

    private _rootElement: HTMLElement;
    private _inputEl: HTMLInputElement;
    private _indicator: HTMLElement;
    private _locationButton: HTMLButtonElement;
    private _resetButton: HTMLButtonElement;

    private _mapListener: MMapListener;

    private _isBottomPosition: boolean;
    private _isHoverMode = false;

    private _isInputFocused: boolean = false;

    public triggerFocus(): void {
        this._inputEl.focus();
    }

    public getValue(): string {
        return this._inputEl.value;
    }

    constructor(props: MMapWaypointInputProps) {
        super(props, {container: true});

        this._suggestComponent = new MMapSuggest({
            suggest: this._props.suggest,
            setSearchInputValue: (text) => {
                this._inputEl.value = text;
            },
            onSuggestClick: () => {
                this._submitWaypointInput();
            }
        });

        this._mapListener = new mappable.MMapListener({
            onMouseMove: this._onMapMouseMove,
            onMouseLeave: this._onMapMouseLeave,
            onFastClick: this._onMapFastClick
        });
        this._addDirectChild(this._mapListener);
    }

    protected _onAttach(): void {
        this._rootElement = document.createElement('mappable');
        this._rootElement.classList.add('mappable--route-control_waypoint-input');

        const form = document.createElement('form');
        form.addEventListener('submit', this._submitWaypointInput);
        form.classList.add('mappable--route-control_waypoint-input_form');

        this._indicator = document.createElement('mappable');
        this._indicator.classList.add('mappable--route-control_waypoint-input__indicator');
        this._updateIndicatorStatus('empty');
        form.appendChild(this._indicator);

        this._inputEl = document.createElement('input');
        this._inputEl.classList.add('mappable--route-control_waypoint-input__field');
        this._inputEl.placeholder = this._props.inputPlaceholder;
        this._inputEl.addEventListener('input', this._onUpdateWaypoint);
        this._inputEl.addEventListener('focus', this._onFocusInput);
        this._inputEl.addEventListener('blur', this._onBlurInput);
        this._inputEl.addEventListener('keydown', this._onKeydownInput);
        form.appendChild(this._inputEl);

        const fieldButton = document.createElement('mappable');
        fieldButton.classList.add('mappable--route-control_waypoint-input__field-buttons');
        form.appendChild(fieldButton);

        this._locationButton = document.createElement('button');
        this._locationButton.addEventListener('mousedown', this._getGeolocation);
        this._locationButton.classList.add('mappable--route-control_waypoint-input__field-buttons__location');
        this._locationButton.insertAdjacentHTML('afterbegin', locationSVG);
        fieldButton.appendChild(this._locationButton);

        this._resetButton = document.createElement('button');
        this._resetButton.addEventListener('mousedown', this._resetInput);
        this._resetButton.classList.add('mappable--route-control_waypoint-input__field-buttons__reset');
        this._resetButton.insertAdjacentHTML('afterbegin', resetSVG);
        fieldButton.appendChild(this._resetButton);

        const suggestContainer = document.createElement('mappable');
        suggestContainer.classList.add('mappable--route-control_waypoint-input_suggest');

        this._rootElement.appendChild(form);
        this._rootElement.appendChild(suggestContainer);

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
        this._watchContext(
            mappable.ThemeContext,
            () => {
                const {theme} = this._consumeContext(mappable.ThemeContext);
                this._indicator.style.color = INDICATOR_COLORS[theme][this._props.type];
                this._rootElement.classList.toggle('_dark-input', theme === 'dark');
            },
            {immediate: true}
        );

        if (this._props.waypoint !== undefined && this._props.waypoint !== null) {
            this._search({text: this._props.waypoint.toString()}, this._props.waypoint);
        }
    }

    protected _onUpdate(diffProps: Partial<MMapWaypointInputProps>): void {
        if (this._props.waypoint !== undefined) {
            if (this._props.waypoint === null) {
                this._props.waypoint = undefined;
                this._resetInput();
            } else {
                this._search({text: this._props.waypoint.toString()}, this._props.waypoint, this._props.value);
            }
        }

        if (diffProps.inputPlaceholder !== undefined) {
            this._inputEl.placeholder = diffProps.inputPlaceholder;
        }
    }

    protected _onDetach(): void {
        this._detachDom?.();
        this._detachDom = undefined;
        this._removeDirectChild(this._suggestComponent);
    }

    private _updateIndicatorStatus(status: 'empty' | 'focus' | 'setted'): void {
        this._indicator.classList.toggle('mappable--route-control_waypoint-input__indicator_empty', status === 'empty');

        switch (status) {
            case 'empty':
                this._indicator.innerHTML = emptyIndicatorSVG;
                break;
            case 'focus':
                this._indicator.innerHTML = focusIndicatorSVG;
                break;
            case 'setted':
                this._indicator.innerHTML = settedIndicatorSVG;
                break;
        }
    }

    private _resetInput = () => {
        this._inputEl.value = '';
        this._suggestComponent.update({searchInputValue: ''});
        this._updateIndicatorStatus('empty');
        this._props.onSelectWaypoint(null);
    };

    private _onUpdateWaypoint = debounce((e: Event) => {
        const target = e.target as HTMLInputElement;
        this._suggestComponent.update({searchInputValue: target.value});
    }, 200);

    private _onFocusInput = (_event: FocusEvent) => {
        this._isInputFocused = true;
        this._suggestComponent.update({suggestNavigationAction: undefined});
        this._addDirectChild(this._suggestComponent);
        this._updateIndicatorStatus('focus');
    };

    private _onBlurInput = (event: FocusEvent) => {
        if (this._isHoverMode) {
            this._inputEl.focus();
            return;
        }
        if (event.relatedTarget !== this._suggestComponent.activeSuggest) {
            this._removeDirectChild(this._suggestComponent);
        }

        this._updateIndicatorStatus('empty');
        // HACK: to check that input had focus before the click
        setTimeout(() => {
            this._isInputFocused = false;
        }, DELAY_BETWEEN_BLUR_AND_CLICK);
    };

    private _submitWaypointInput = (event?: SubmitEvent) => {
        event?.preventDefault();
        if (!this._suggestComponent.activeSuggest) {
            this._inputEl.focus();
            return;
        }
        const {uri, text} = this._suggestComponent.activeSuggest.dataset;
        this._inputEl.value = text;
        this._search({uri, text});
        this._removeDirectChild(this._suggestComponent);
        this._inputEl.blur();
    };

    private _onKeydownInput = (event: KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this._suggestComponent.update({suggestNavigationAction: {isNextSuggest: !this._isBottomPosition}});
                break;
            case 'ArrowUp':
                event.preventDefault();
                this._suggestComponent.update({suggestNavigationAction: {isNextSuggest: this._isBottomPosition}});
                break;
        }
    };

    private _getGeolocation = async () => {
        const text = this._props.geolocationTextInput;
        this._inputEl.value = text;

        const position = await mappable.geolocation.getPosition();
        const feature: SearchResponseFeature = {
            properties: {name: text, description: text},
            geometry: {type: 'Point', coordinates: position.coords}
        };
        this._updateIndicatorStatus('setted');
        this._props.onSelectWaypoint({feature});
    };

    private async _search(params: SearchParams, reverseGeocodingCoordinate?: LngLat, valueOverride?: string) {
        try {
            const searchResult =
                (await this._props.search?.({params, map: this.root})) ?? (await mappable.search(params));

            if (searchResult.length === 0) {
                return;
            }

            const feature = searchResult[0];
            if (reverseGeocodingCoordinate) {
                this._inputEl.value = valueOverride ? valueOverride : feature.properties.name;
                feature.geometry.coordinates = reverseGeocodingCoordinate;
            }
            this._updateIndicatorStatus('setted');
            this._props.onSelectWaypoint({feature});
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            this._updateIndicatorStatus('empty');
            this._inputEl.value = '';
            this._props.onError?.();
        }
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
            this._isInputFocused = false;
            this._props.onMouseMoveOnMap?.(event.coordinates, true);
            this._inputEl.blur();
            this._search({text: event.coordinates.toString()}, event.coordinates);
        }
    };
}
