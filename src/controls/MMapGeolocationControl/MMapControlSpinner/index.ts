import type {DomDetach} from '@mappable-world/mappable-types';
import './index.css';

class MMapControlSpinner extends mappable.MMapComplexEntity<{}> {
    private _detachDom?: DomDetach;
    private _unwatchThemeContext?: () => void;

    protected override _onAttach(): void {
        const element = document.createElement('mappable');
        element.classList.add('mappable--controls-spinner');

        const circle = document.createElement('mappable');
        circle.classList.add('mappable--controls-spinner__circle');
        element.appendChild(circle);

        this._detachDom = mappable.useDomContext(this, element, null);

        this._unwatchThemeContext = this._watchContext(mappable.ThemeContext, () => this._updateTheme(circle), {
            immediate: true
        });
    }

    protected override _onDetach(): void {
        this._detachDom?.();
        this._detachDom = undefined;
        this._unwatchThemeContext?.();
    }

    private _updateTheme(circle: HTMLElement): void {
        const themeCtx = this._consumeContext(mappable.ThemeContext);
        if (!themeCtx) {
            return;
        }
        const {theme} = themeCtx;
        const spinnerControlDarkClassName = 'mappable--controls-spinner__dark';
        if (theme === 'dark') {
            circle.classList.add(spinnerControlDarkClassName);
        } else if (theme === 'light') {
            circle.classList.remove(spinnerControlDarkClassName);
        }
    }
}

export {MMapControlSpinner};
