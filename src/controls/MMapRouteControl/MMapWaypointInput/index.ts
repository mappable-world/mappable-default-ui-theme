import {DomDetach, SearchResponse, SuggestResponse} from '@mappable-world/mappable-types';
import type {Feature as SearchResponseFeature} from '@mappable-world/mappable-types/imperative/search';
import debounce from 'lodash/debounce';
import {CustomSearch, CustomSuggest, SearchParams} from '../../MMapSearchControl';
import {MMapSuggest} from '../../MMapSearchControl/MMapSuggest';
import emptyIndicatorSVG from '../icons/empty-field.svg';
import locationSVG from '../icons/location-button.svg';
import './index.css';

export type SelectWaypointArgs = {
    feature: SearchResponseFeature;
};

export type MMapWaypointInputProps = {
    type: 'from' | 'to';
    search?: ({params, map}: CustomSearch) => Promise<SearchResponse> | SearchResponse;
    suggest?: (args: CustomSuggest) => Promise<SuggestResponse> | SuggestResponse;
    onSelectWaypoint?: (args: SelectWaypointArgs) => void;
};

export class MMapWaypointInput extends mappable.MMapComplexEntity<MMapWaypointInputProps> {
    private _detachDom?: DomDetach;
    private _suggestComponent?: MMapSuggest;

    private _rootElement: HTMLElement;
    private _isBottomPosition: boolean;
    private _inputEl: HTMLInputElement;

    protected _onAttach(): void {
        this._rootElement = document.createElement('mappable');
        this._rootElement.classList.add('mappable--route-control_waypoint-input');

        const form = document.createElement('form');
        form.addEventListener('submit', this._submitWaypointInput);
        form.classList.add('mappable--route-control_waypoint-input_form');

        const indicator = document.createElement('mappable');
        indicator.classList.add('mappable--route-control_waypoint-input__indicator');
        indicator.insertAdjacentHTML('afterbegin', emptyIndicatorSVG);
        form.appendChild(indicator);

        this._inputEl = document.createElement('input');
        this._inputEl.classList.add('mappable--route-control_waypoint-input__field');
        this._inputEl.placeholder = this._props.type === 'from' ? 'From' : 'To';
        this._inputEl.addEventListener('input', this.__onUpdateWaypoint);
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

        this._detachDom = mappable.useDomContext(this, this._rootElement, suggestContainer);

        this._watchContext(
            mappable.ControlContext,
            () => {
                const controlCtx = this._consumeContext(mappable.ControlContext);
                const [verticalPosition] = controlCtx.position;
                this._isBottomPosition = verticalPosition === 'bottom';
            },
            {immediate: true}
        );
    }

    private __onUpdateWaypoint = debounce((e: Event) => {
        const target = e.target as HTMLInputElement;
        this._suggestComponent.update({searchInputValue: target.value});
    }, 200);

    private _onFocusInput = (_event: FocusEvent) => {
        this.addChild(this._suggestComponent);
    };

    private _onBlurInput = (event: FocusEvent) => {
        if (event.relatedTarget !== this._suggestComponent.activeSuggest) {
            this.removeChild(this._suggestComponent);
        }
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

    private async _search(params: SearchParams) {
        const searchResult = (await this._props.search?.({params, map: this.root})) ?? (await mappable.search(params));
        const feature = searchResult[0];

        this._props.onSelectWaypoint({feature});
    }

    protected _onDetach(): void {
        this._detachDom?.();
        this._detachDom = undefined;
    }
}
