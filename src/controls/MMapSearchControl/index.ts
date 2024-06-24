import type {DomDetach} from '@mappable-world/mappable-types/imperative/DomContext';
import type {MMapControl} from '@mappable-world/mappable-types/imperative/MMapControl';
import type {MMap} from '@mappable-world/mappable-types/imperative/MMap';
import type {SearchResponse} from '@mappable-world/mappable-types/imperative/search';
import type {SuggestResponse} from '@mappable-world/mappable-types/imperative/suggest';
import {debounce} from 'lodash';
import {MMapSuggest} from './MMapSuggest';

import './index.css';

const SEARCH_CONTROL_CLASS = 'mappable--search-control';
const SEARCH_CONTROL_INPUT_CLASS = 'mappable--search-control__input';
const SEARCH_CONTROL_CLEAR_CLASS = 'mappable--search-control__clear';
const SEARCH_CONTROL_FORM_CLASS = 'mappable--search-control__form';
const HIDE_CLASS = '_hide';

export type SearchParams = {
    text?: string;
    uri?: string;
};

export type CustomSuggest = {
    text: string;
    map: MMap;
};

export type CustomSearch = {
    params: SearchParams;
    map: MMap;
};

type MMapSearchControlProps = {
    search?: ({params, map}: CustomSearch) => Promise<SearchResponse> | SearchResponse;
    suggest?: ({text, map}: CustomSuggest) => Promise<SuggestResponse> | SuggestResponse;
    searchResult: (result: SearchResponse) => void;
};

class MMapSearchCommonControl extends mappable.MMapComplexEntity<MMapSearchControlProps> {
    private _detachDom?: DomDetach;
    private _rootElement?: HTMLElement;
    private _clearButton?: HTMLButtonElement;
    private _searchInput?: HTMLInputElement;
    private _searchForm?: HTMLFormElement;
    private _suggestComponent?: MMapSuggest;
    private _unwatchThemeContext?: () => void;
    private _unwatchControlContext?: () => void;
    private _isBottomOrder?: boolean;

    private async _search(params: SearchParams) {
        const searchResult = (await this._props.search?.({params, map: this.root})) ?? (await mappable.search(params));
        this._props.searchResult(searchResult);
    }

    private _resetInput = () => {
        this._searchInput.value = '';
        this._searchInput.dispatchEvent(new Event('input'));
    };

    private _updateSuggestComponent = () => {
        if (this._searchInput.value) {
            this._suggestComponent.update({searchInputValue: this._searchInput.value});
            this._addDirectChild(this._suggestComponent);
        } else {
            this._removeDirectChild(this._suggestComponent);
        }
    };

    private _onChangeSearchInputDebounced = debounce(() => {
        this._updateSuggestComponent();
    }, 200);

    private _onChangeSearchInput = () => {
        this._clearButton.classList.toggle(HIDE_CLASS, !this._searchInput.value);

        this._onChangeSearchInputDebounced();
    };

    private _onFocusBlurSearchInput = (event: FocusEvent) => {
        if (event.type === 'focus') {
            this._updateSuggestComponent();
        } else if (event.type === 'blur') {
            // add a check so that the function does not work if you click on the element of the suggest
            if (event.relatedTarget !== this._suggestComponent?.activeSuggest) {
                this._removeDirectChild(this._suggestComponent);
            }
        }
    };

    private _onKeyDownSearchInput = (event: KeyboardEvent) => {
        if (!this._searchInput.value) return;

        switch (event.key) {
            case 'ArrowUp': {
                event.preventDefault();

                this._suggestComponent.update({
                    suggestNavigationAction: {
                        isNextSuggest: this._isBottomOrder
                    }
                });

                break;
            }
            case 'ArrowDown': {
                event.preventDefault();

                this._suggestComponent.update({
                    suggestNavigationAction: {
                        isNextSuggest: !this._isBottomOrder
                    }
                });

                break;
            }
        }
    };

    private _onClickClearButton = (event: MouseEvent) => {
        event.preventDefault();

        this._resetInput();
        this._searchInput.focus();
    };

    private _onSubmitSearchForm = (event: SubmitEvent) => {
        event.preventDefault();

        const activeSuggestUri = (this.children[0] as MMapSuggest)?.activeSuggest?.dataset?.uri;
        const searchParams = {uri: activeSuggestUri, text: this._searchInput.value};

        this._search(searchParams);
        this._resetInput();
        this._searchInput.blur();
    };

    private _updateTheme(searchInput: HTMLInputElement): void {
        const themeCtx = this._consumeContext(mappable.ThemeContext);
        if (!themeCtx) {
            return;
        }
        const {theme} = themeCtx;
        const darkClassName = '_dark';
        searchInput.classList.toggle(darkClassName, theme === 'dark');
    }

    private _updateVerticalOrder(container: HTMLElement): void {
        const controlCtx = this._consumeContext(mappable.ControlContext);
        if (!controlCtx) {
            return;
        }

        const verticalPosition = controlCtx.position[0];
        const bottomOrderClassName = '_bottom';
        this._isBottomOrder = verticalPosition === 'bottom';
        container.classList.toggle(bottomOrderClassName, this._isBottomOrder);
    }

    protected override _onAttach(): void {
        this._rootElement = document.createElement('mappable');
        this._rootElement.classList.add(SEARCH_CONTROL_CLASS);

        this._detachDom = mappable.useDomContext(this, this._rootElement, this._rootElement);

        this._searchInput = document.createElement('input');
        this._searchInput.type = 'text';
        this._searchInput.autocomplete = 'off';
        this._searchInput.classList.add(SEARCH_CONTROL_INPUT_CLASS);
        this._searchInput.placeholder = 'Enter an address';
        this._searchInput.addEventListener('input', this._onChangeSearchInput);
        this._searchInput.addEventListener('focus', this._onFocusBlurSearchInput);
        this._searchInput.addEventListener('blur', this._onFocusBlurSearchInput);
        this._searchInput.addEventListener('keydown', this._onKeyDownSearchInput);

        this._clearButton = document.createElement('button');
        this._clearButton.type = 'reset';
        this._clearButton.classList.add(SEARCH_CONTROL_CLEAR_CLASS, HIDE_CLASS);
        this._clearButton.addEventListener('click', this._onClickClearButton);

        this._searchForm = document.createElement('form');
        this._searchForm.classList.add(SEARCH_CONTROL_FORM_CLASS);
        this._searchForm.addEventListener('submit', this._onSubmitSearchForm);
        this._searchForm.appendChild(this._searchInput);
        this._searchForm.appendChild(this._clearButton);

        this._rootElement.appendChild(this._searchForm);

        this._suggestComponent = new MMapSuggest({
            setSearchInputValue: (text) => {
                this._searchInput.value = text;
            },
            onSuggestClick: (params: SearchParams) => {
                this._search(params);
                this._resetInput();
            },
            suggest: this._props.suggest
        });

        this._unwatchThemeContext = this._watchContext(
            mappable.ThemeContext,
            () => this._updateTheme(this._searchInput),
            {immediate: true}
        );

        this._unwatchControlContext = this._watchContext(
            mappable.ControlContext,
            () => this._updateVerticalOrder(this._rootElement),
            {immediate: true}
        );
    }

    protected override _onDetach(): void {
        this._removeDirectChild(this._suggestComponent);
        this._suggestComponent = undefined;

        this._detachDom?.();
        this._detachDom = undefined;

        this._unwatchThemeContext?.();
        this._unwatchThemeContext = undefined;
        this._unwatchControlContext?.();
        this._unwatchControlContext = undefined;
        this._isBottomOrder = undefined;

        this._clearButton.removeEventListener('click', this._resetInput);
        this._clearButton = undefined;

        this._searchInput.removeEventListener('input', this._onChangeSearchInput);
        this._searchInput.removeEventListener('focus', this._onFocusBlurSearchInput);
        this._searchInput.removeEventListener('blur', this._onFocusBlurSearchInput);
        this._searchInput.removeEventListener('keydown', this._onKeyDownSearchInput);
        this._searchInput = undefined;

        this._searchForm.removeEventListener('submit', this._onSubmitSearchForm);
        this._searchForm = undefined;

        this._rootElement = undefined;
    }
}

class MMapSearchControl extends mappable.MMapComplexEntity<MMapSearchControlProps> {
    private _control!: MMapControl;
    private _search!: MMapSearchCommonControl;

    protected override _onAttach(): void {
        this._search = new MMapSearchCommonControl(this._props);
        this._control = new mappable.MMapControl({transparent: true}).addChild(this._search);
        this.addChild(this._control);
    }

    protected _onUpdate(props: Partial<MMapSearchControlProps>): void {
        this._search.update(props);
    }

    protected override _onDetach(): void {
        this._control.removeChild(this._search);
        this.removeChild(this._control);
    }
}

export {MMapSearchControl, MMapSearchControlProps};
