import type {DomDetach} from '@mappable-world/mappable-types/imperative/DomContext';
import type {SuggestResponse, SuggestResponseItem} from '@mappable-world/mappable-types/imperative/suggest';
import type {SuggestListContext, ActiveSuggestContext} from '../';
import {SearchContext} from '../';

import './index.css';

const SUGGEST_CONTROL_CLASS = 'mappable--suggest-control';
const SUGGEST_CONTROL_ITEM_CLASS = 'mappable--suggest-item-control';
const SUGGEST_CONTROL_ITEM_TITLE_CLASS = 'mappable--suggest-item-control__title';
const SUGGEST_CONTROL_ITEM_SUBTITLE_CLASS = 'mappable--suggest-item-control__subtitle';
const HIDE_CLASS = '_hide';
const ACTIVE_CLASS = '_active';

class MMapSuggestControl extends mappable.MMapComplexEntity<{}> {
    private _detachDom?: DomDetach;
    private _rootElement?: HTMLElement;
    private _unwatchSearchContext?: () => void;
    private _unwatchThemeContext?: () => void;

    private _searchContextListener = async () => {
        const searchCtx = this._consumeContext(SearchContext);
        if (!searchCtx) {
            return;
        }

        if (searchCtx.hasOwnProperty('value') && searchCtx.hasOwnProperty('onSuggestClick')) {
            this._updateSuggestList(searchCtx as SuggestListContext);
        } else if (searchCtx.hasOwnProperty('isNext') && searchCtx.hasOwnProperty('setInputValue')) {
            this._updateActiveSuggest(searchCtx as ActiveSuggestContext);
        }
    };

    private _updateSuggestList = async (searchCtx: SuggestListContext) => {
        const suggest = await mappable.suggest({text: searchCtx.value});

        this._removeSuggestItems();

        this._addSuggestItems(suggest, searchCtx.onSuggestClick);

        this._rootElement.classList.toggle(
            HIDE_CLASS,
            searchCtx.isInputBlur || !searchCtx.value || !this.children.length
        );
    };

    private _updateActiveSuggest = (searchCtx: ActiveSuggestContext) => {
        if (this.children.length === 0) {
            return;
        }

        const suggestElements = this._getSuggestElements();

        let activeIndex = suggestElements.findIndex((element) => element.classList.contains(ACTIVE_CLASS));

        if (searchCtx.isNext) {
            activeIndex = (activeIndex + 1) % suggestElements.length; // cyclic movement
        } else {
            activeIndex = (activeIndex - 1 + suggestElements.length) % suggestElements.length;
        }

        suggestElements.forEach((element, index) => {
            element.classList.toggle(ACTIVE_CLASS, index === activeIndex);
        });

        if (suggestElements[activeIndex] && suggestElements[activeIndex]?.dataset?.value) {
            searchCtx.setInputValue(suggestElements[activeIndex].dataset.value);
        }
    };

    private _updateTheme(container: HTMLElement): void {
        const themeCtx = this._consumeContext(mappable.ThemeContext);
        if (!themeCtx) {
            return;
        }
        const {theme} = themeCtx;
        const darkClassName = '_dark';
        if (theme === 'dark') {
            container.classList.add(darkClassName);
        } else if (theme === 'light') {
            container.classList.remove(darkClassName);
        }
    }

    private _removeSuggestItems = () => {
        while (this.children.length) {
            this.removeChild(this.children[0]);
        }
    };

    private _addSuggestItems(suggest: SuggestResponse, onSuggestClick: SuggestListContext['onSuggestClick']) {
        suggest.forEach((suggestItem) => {
            const searchText = suggestItem.uri ?? suggestItem.title.text;

            this.addChild(
                new MMapSuggestItemControl({
                    suggestItem,
                    onClick: () => onSuggestClick(searchText)
                })
            );
        });
    }

    private _onMouseOverHandler = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const hoveredElement = target.closest(`.${SUGGEST_CONTROL_ITEM_CLASS}`);
        if (!hoveredElement) {
            return;
        }

        const suggestElements = this._getSuggestElements();
        suggestElements.forEach((element) => element.classList.toggle(ACTIVE_CLASS, element === hoveredElement));
    };

    private _getSuggestElements = () =>
        (this.children.filter((child) => child instanceof MMapSuggestItemControl) as MMapSuggestItemControl[]).map(
            (child) => child.element
        );

    protected override _onAttach(): void {
        this._rootElement = document.createElement('mappable');
        this._rootElement.classList.add(SUGGEST_CONTROL_CLASS, HIDE_CLASS);
        this._rootElement.addEventListener('mouseover', this._onMouseOverHandler);

        this._detachDom = mappable.useDomContext(this, this._rootElement, this._rootElement);

        this._unwatchSearchContext = this._watchContext(SearchContext, this._searchContextListener);

        this._unwatchThemeContext = this._watchContext(
            mappable.ThemeContext,
            () => this._updateTheme(this._rootElement),
            {
                immediate: true
            }
        );
    }

    protected override _onDetach(): void {
        this._detachDom?.();
        this._detachDom = undefined;

        this._unwatchSearchContext?.();
        this._unwatchSearchContext = undefined;
        this._unwatchThemeContext?.();
        this._unwatchThemeContext = undefined;

        this._rootElement.removeEventListener('mouseover', this._onMouseOverHandler);
        this._rootElement = undefined;
    }
}

type MMapSuggestItemControlProps = {
    suggestItem: SuggestResponseItem;
    onClick: () => void;
};

class MMapSuggestItemControl extends mappable.MMapComplexEntity<MMapSuggestItemControlProps> {
    private _detachDom?: DomDetach;
    private _rootElement?: HTMLElement;
    private _unwatchThemeContext?: () => void;

    constructor(props: MMapSuggestItemControlProps) {
        super(props);
    }

    public get element() {
        return this._rootElement;
    }

    private _updateTheme(container: HTMLElement, titleElement: HTMLElement, subtitleElement?: HTMLElement): void {
        const themeCtx = this._consumeContext(mappable.ThemeContext);
        if (!themeCtx) {
            return;
        }
        const {theme} = themeCtx;
        const darkClassName = '_dark';
        if (theme === 'dark') {
            container.classList.add(darkClassName);
            titleElement.classList.add(darkClassName);
            subtitleElement?.classList.add(darkClassName);
        } else if (theme === 'light') {
            container.classList.remove(darkClassName);
            titleElement.classList.remove(darkClassName);
            subtitleElement?.classList.remove(darkClassName);
        }
    }

    protected override _onAttach(): void {
        this._rootElement = document.createElement('mappable');
        this._rootElement.classList.add(SUGGEST_CONTROL_ITEM_CLASS);
        this._rootElement.addEventListener('click', this._props.onClick);
        this._rootElement.dataset.value = this._props.suggestItem.title.text;

        this._detachDom = mappable.useDomContext(this, this._rootElement, this._rootElement);

        const titleElement = document.createElement('mappable');
        titleElement.classList.add(SUGGEST_CONTROL_ITEM_TITLE_CLASS);
        titleElement.innerText = this._props.suggestItem.title.text;
        this._rootElement.appendChild(titleElement);

        let subtitleElement: HTMLElement | undefined;
        if (this._props.suggestItem.subtitle) {
            subtitleElement = document.createElement('mappable');
            subtitleElement.classList.add(SUGGEST_CONTROL_ITEM_SUBTITLE_CLASS);
            subtitleElement.innerText = this._props.suggestItem.subtitle.text;
            this._rootElement.appendChild(subtitleElement);
        }

        this._unwatchThemeContext = this._watchContext(
            mappable.ThemeContext,
            () => this._updateTheme(this._rootElement, titleElement, subtitleElement),
            {
                immediate: true
            }
        );
    }

    protected override _onDetach(): void {
        this._detachDom?.();
        this._detachDom = undefined;

        this._unwatchThemeContext?.();
        this._unwatchThemeContext = undefined;

        this._rootElement.removeEventListener('click', this._props.onClick);
        this._rootElement = undefined;
    }
}

export {MMapSuggestControl};
