import type {DomDetach} from '@mappable-world/mappable-types/imperative/DomContext';
import type {SuggestResponse, SuggestResponseItem} from '@mappable-world/mappable-types/imperative/suggest';

import './index.css';

const SUGGEST_CLASS = 'mappable--suggest-control';
const SUGGEST_ITEM_CLASS = 'mappable--suggest-item-control';
const SUGGEST_ITEM_TITLE_CLASS = 'mappable--suggest-item-control__title';
const SUGGEST_ITEM_SUBTITLE_CLASS = 'mappable--suggest-item-control__subtitle';
const HIDE_CLASS = '_hide';
const ACTIVE_CLASS = '_active';

type UpdateSuggestOption = {
    value: string;
    onSuggestClick: (text: string) => void;
    isInputBlur?: boolean;
};

type UpdateActiveSuggestOption = {
    isNext: boolean;
    setInputValue: (text: string) => void;
};

type MMapSuggestProps = {
    updateSuggestList?: UpdateSuggestOption;
    updateActiveSuggest?: UpdateActiveSuggestOption;
};

class MMapSuggest extends mappable.MMapComplexEntity<MMapSuggestProps> {
    private _detachDom?: DomDetach;
    private _rootElement?: HTMLElement;
    private _unwatchThemeContext?: () => void;
    private _unwatchControlContext?: () => void;

    private _updateSuggest(props: MMapSuggestProps) {
        if (props.updateSuggestList) {
            this._updateSuggestList(props.updateSuggestList);
        }

        if (props.updateActiveSuggest) {
            this._updateActiveSuggest(props.updateActiveSuggest);
        }
    }

    private _updateSuggestList = async (updateSuggestList: UpdateSuggestOption) => {
        const suggest = await mappable.suggest({text: updateSuggestList.value});

        this._removeSuggestItems();

        this._addSuggestItems(suggest, updateSuggestList.onSuggestClick);

        this._rootElement.classList.toggle(
            HIDE_CLASS,
            updateSuggestList.isInputBlur || !updateSuggestList.value || !this.children.length
        );
    };

    private _updateActiveSuggest = (updateActiveSuggest: UpdateActiveSuggestOption) => {
        if (this.children.length === 0) {
            return;
        }

        const suggestElements = this._getSuggestElements();

        let activeIndex = suggestElements.findIndex((element) => element.classList.contains(ACTIVE_CLASS));

        if (updateActiveSuggest.isNext) {
            activeIndex = (activeIndex + 1) % suggestElements.length; // cyclic movement
        } else {
            activeIndex =
                activeIndex === -1
                    ? suggestElements.length - 1
                    : (activeIndex - 1 + suggestElements.length) % suggestElements.length;
        }

        suggestElements.forEach((element, index) => {
            element.classList.toggle(ACTIVE_CLASS, index === activeIndex);
        });

        if (suggestElements[activeIndex] && suggestElements[activeIndex]?.dataset?.value) {
            updateActiveSuggest.setInputValue(suggestElements[activeIndex].dataset.value);
        }
    };

    private _removeSuggestItems = () => {
        while (this.children.length) {
            this.removeChild(this.children[0]);
        }
    };

    private _addSuggestItems(suggest: SuggestResponse, onSuggestClick: UpdateSuggestOption['onSuggestClick']) {
        suggest.forEach((suggestItem) => {
            const searchText = suggestItem.uri ?? suggestItem.title.text;

            this.addChild(
                new MMapSuggestItem({
                    suggestItem,
                    onClick: () => onSuggestClick(searchText)
                })
            );
        });
    }

    private _onMouseOverHandler = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const hoveredElement = target.closest(`.${SUGGEST_ITEM_CLASS}`);
        if (!hoveredElement) {
            return;
        }

        const suggestElements = this._getSuggestElements();
        suggestElements.forEach((element) => element.classList.toggle(ACTIVE_CLASS, element === hoveredElement));
    };

    private _onMouseOutHandler = (event: MouseEvent) => {
        if (!this._rootElement.contains(event.relatedTarget as Node)) {
            const suggestElements = this._getSuggestElements();
            suggestElements.forEach((element) => element.classList.remove(ACTIVE_CLASS));
        }
    };

    private _getSuggestElements = () =>
        (this.children.filter((child) => child instanceof MMapSuggestItem) as MMapSuggestItem[]).map(
            (child) => child.element
        );

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

    private _updateVerticalOrder(container: HTMLElement): void {
        const controlCtx = this._consumeContext(mappable.ControlContext);
        if (!controlCtx) {
            return;
        }

        const verticalPosition = controlCtx.position[0];
        const bottomOrderClassName = '_bottom';
        container.classList.toggle(bottomOrderClassName, verticalPosition === 'bottom');
    }

    protected override _onAttach(): void {
        this._rootElement = document.createElement('mappable');
        this._rootElement.classList.add(SUGGEST_CLASS, HIDE_CLASS);
        this._rootElement.addEventListener('mouseover', this._onMouseOverHandler);
        this._rootElement.addEventListener('mouseout', this._onMouseOutHandler);

        this._detachDom = mappable.useDomContext(this, this._rootElement, this._rootElement);

        this._updateSuggest(this._props);

        this._unwatchThemeContext = this._watchContext(
            mappable.ThemeContext,
            () => this._updateTheme(this._rootElement),
            {
                immediate: true
            }
        );

        this._unwatchControlContext = this._watchContext(
            mappable.ControlContext,
            () => this._updateVerticalOrder(this._rootElement),
            {immediate: true}
        );
    }

    protected _onUpdate(props: Partial<MMapSuggestProps>): void {
        this._updateSuggest(props);
    }

    protected override _onDetach(): void {
        this._detachDom?.();
        this._detachDom = undefined;

        this._unwatchThemeContext?.();
        this._unwatchThemeContext = undefined;
        this._unwatchControlContext?.();
        this._unwatchControlContext = undefined;

        this._rootElement.removeEventListener('mouseover', this._onMouseOverHandler);
        this._rootElement.removeEventListener('mouseout', this._onMouseOutHandler);
        this._rootElement = undefined;
    }
}

type MMapSuggestItemProps = {
    suggestItem: SuggestResponseItem;
    onClick: () => void;
};

class MMapSuggestItem extends mappable.MMapComplexEntity<MMapSuggestItemProps> {
    private _detachDom?: DomDetach;
    private _rootElement?: HTMLElement;
    private _unwatchThemeContext?: () => void;

    constructor(props: MMapSuggestItemProps) {
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
        this._rootElement.classList.add(SUGGEST_ITEM_CLASS);
        this._rootElement.addEventListener('click', this._props.onClick);
        this._rootElement.dataset.value = this._props.suggestItem.title.text;

        this._detachDom = mappable.useDomContext(this, this._rootElement, this._rootElement);

        const titleElement = document.createElement('mappable');
        titleElement.classList.add(SUGGEST_ITEM_TITLE_CLASS);
        titleElement.innerText = this._props.suggestItem.title.text;
        this._rootElement.appendChild(titleElement);

        let subtitleElement: HTMLElement | undefined;
        if (this._props.suggestItem.subtitle) {
            subtitleElement = document.createElement('mappable');
            subtitleElement.classList.add(SUGGEST_ITEM_SUBTITLE_CLASS);
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

export {MMapSuggest};
