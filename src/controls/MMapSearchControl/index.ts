import type {DomDetach} from '@mappable-world/mappable-types/imperative/DomContext';
import type {MMapControl} from '@mappable-world/mappable-types/imperative/MMapControl';
import {debounce} from 'lodash';
import {MMapSuggest} from './MMapSuggest';

import './index.css';

const SEARCH_CONTROL_CLASS = 'mappable--search-control';
const SEARCH_CONTROL_INPUT_CLASS = 'mappable--search-control__input';
const SEARCH_CONTROL_CLEAR_CLASS = 'mappable--search-control__clear';
const SEARCH_CONTROL_FORM_CLASS = 'mappable--search-control__form';
const HIDE_CLASS = '_hide';

class MMapSearchCommonControl extends mappable.MMapComplexEntity<{}> {
    private _detachDom?: DomDetach;
    private _rootElement?: HTMLElement;
    private _clearButton?: HTMLButtonElement;
    private _searchInput?: HTMLInputElement;
    private _suggest?: MMapSuggest;
    private _unwatchThemeContext?: () => void;
    private _unwatchControlContext?: () => void;
    private _isBottomOrder?: boolean;

    private async _search(text: string) {
        const res = await mappable.search({text});
        console.log(res);
    }

    private _resetInput = () => {
        this._searchInput.value = '';
        this._searchInput.dispatchEvent(new Event('input'));
    };

    private _onChangeSearchInputDebounced = debounce(() => {
        this._suggest.update({
            updateSuggestList: {
                value: this._searchInput.value,
                onSuggestClick: (text: string) => {
                    this._search(text);
                    this._resetInput();
                }
            }
        });
    }, 200);

    private _onChangeSearchInput = () => {
        this._clearButton.classList.toggle(HIDE_CLASS, !this._searchInput.value);

        this._onChangeSearchInputDebounced();
    };

    private _onFocusBlurSearchInput = (event: FocusEvent) => {
        this._suggest.update({
            updateSuggestList: {
                value: this._searchInput.value,
                onSuggestClick: (text: string) => {
                    this._search(text);
                    this._resetInput();
                },
                isInputBlur: event.type === 'blur'
            }
        });
    };

    private _onKeyDownSearchInput = (event: KeyboardEvent) => {
        if (!this._searchInput.value) return;

        switch (event.key) {
            case 'Enter': {
                event.preventDefault();

                this._search(this._searchInput.value);
                this._resetInput();
                this._searchInput.blur();

                break;
            }
            case 'ArrowUp': {
                event.preventDefault();

                this._suggest.update({
                    updateActiveSuggest: {
                        isNext: this._isBottomOrder,
                        setInputValue: (text) => (this._searchInput.value = text)
                    }
                });

                break;
            }
            case 'ArrowDown': {
                event.preventDefault();

                this._suggest.update({
                    updateActiveSuggest: {
                        isNext: !this._isBottomOrder,
                        setInputValue: (text) => (this._searchInput.value = text)
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

    private _updateTheme(searchInput: HTMLInputElement): void {
        const themeCtx = this._consumeContext(mappable.ThemeContext);
        if (!themeCtx) {
            return;
        }
        const {theme} = themeCtx;
        const darkClassName = '_dark';
        if (theme === 'dark') {
            searchInput.classList.add(darkClassName);
        } else if (theme === 'light') {
            searchInput.classList.remove(darkClassName);
        }
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
        this._clearButton.classList.add(SEARCH_CONTROL_CLEAR_CLASS, HIDE_CLASS);
        this._clearButton.addEventListener('click', this._onClickClearButton);

        const searchForm = document.createElement('form');
        searchForm.classList.add(SEARCH_CONTROL_FORM_CLASS);
        searchForm.appendChild(this._searchInput);
        searchForm.appendChild(this._clearButton);
        this._rootElement.appendChild(searchForm);

        this._suggest = new MMapSuggest({});
        this.addChild(this._suggest);

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
        this.removeChild(this._suggest);
        this._suggest = undefined;

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

        this._rootElement = undefined;
    }
}

class MMapSearchControl extends mappable.MMapComplexEntity<{}> {
    private _control!: MMapControl;
    private _search!: MMapSearchCommonControl;

    protected override _onAttach(): void {
        this._search = new MMapSearchCommonControl({});
        this._control = new mappable.MMapControl({transparent: true}).addChild(this._search);
        this.addChild(this._control);
    }

    protected override _onDetach(): void {
        this.removeChild(this._control);
    }
}

export {MMapSearchControl};
