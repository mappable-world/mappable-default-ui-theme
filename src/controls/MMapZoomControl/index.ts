import type {
    DomDetach,
    MMapCenterZoomLocation,
    MMapControl,
    MMapControlCommonButton,
    MMapListener
} from '@mappable-world/mappable-types';
import type {EasingFunctionDescription} from '@mappable-world/mappable-types/common/types';
import type {CustomVuefyOptions} from '@mappable-world/mappable-types/modules/vuefy';
import type TVue from '@vue/runtime-core';

import './index.css';

/**
 * MMapZoomControl props
 */
type MMapZoomControlProps = {
    /** Easing function for map location animation */
    easing?: EasingFunctionDescription;
    /** Map location animate duration */
    duration?: number;
};

const defaultProps = Object.freeze({duration: 200});

type DefaultProps = typeof defaultProps;

const MMapZoomControlVuefyOptions: CustomVuefyOptions<MMapZoomControl> = {
    props: {
        easing: [String, Object, Function] as TVue.PropType<EasingFunctionDescription>,
        duration: {type: Number, default: defaultProps.duration}
    }
};

class MMapZoomCommonControl extends mappable.MMapGroupEntity<MMapZoomControlProps> {
    protected _zoomIn!: MMapControlCommonButton;
    protected _zoomOut!: MMapControlCommonButton;
    protected _listener!: MMapListener;

    private _currentZoom: number = 10;

    protected _detachDom?: DomDetach;
    protected _element?: HTMLElement;
    private _unwatchThemeContext?: () => void;
    private _unwatchControlContext?: () => void;

    constructor(props: MMapZoomControlProps) {
        super(props);
        this._onMapUpdate = this._onMapUpdate.bind(this);
    }

    private _onMapUpdate({location}: {location: MMapCenterZoomLocation}): void {
        this._currentZoom = location.zoom;
        this._onUpdate();
    }

    private _changeZoom(delta: number): void {
        const newZoom = this._currentZoom + delta;
        const map = this.root;
        map.update({
            location: {
                zoom: newZoom,
                duration: this._props.duration,
                easing: this._props.easing
            }
        });
        this._currentZoom = newZoom;
        this._onUpdate();
    }

    protected override _onAttach(): void {
        this._element = document.createElement('mappable');
        this._element.classList.add('mappable--zoom-control');

        this._detachDom = mappable.useDomContext(this, this._element, this._element);

        const zoomInElement = document.createElement('mappable');
        zoomInElement.classList.add('mappable--zoom-control__in');

        const zoomOutElement = document.createElement('mappable');
        zoomOutElement.classList.add('mappable--zoom-control__out');

        this._zoomIn = new mappable.MMapControlCommonButton({
            onClick: () => this._changeZoom(1),
            element: zoomInElement
        });

        this._zoomOut = new mappable.MMapControlCommonButton({
            onClick: () => this._changeZoom(-1),
            element: zoomOutElement
        });

        this._listener = new mappable.MMapListener({onUpdate: this._onMapUpdate});

        this.addChild(this._zoomIn).addChild(this._zoomOut).addChild(this._listener);
        this._currentZoom = this.root!.zoom;

        this._unwatchThemeContext = this._watchContext(
            mappable.ThemeContext,
            () => {
                if (this._element) {
                    this._updateTheme({zoomIn: zoomInElement, zoomOut: zoomOutElement});
                }
            },
            {immediate: true}
        );

        this._unwatchControlContext = this._watchContext(
            mappable.ControlContext,
            () => {
                if (this._element) {
                    this._updateOrientation(this._element);
                }
            },
            {immediate: true}
        );
    }

    protected override _onDetach(): void {
        this._detachDom?.();
        this._detachDom = undefined;
        this._element = undefined;
        this.removeChild(this._zoomIn).removeChild(this._zoomOut).removeChild(this._listener);
        this._unwatchThemeContext?.();
        this._unwatchControlContext?.();
    }

    protected override _onUpdate() {
        const map = this.root;
        this._zoomIn.update({
            disabled: this._currentZoom >= map.zoomRange.max
        });

        this._zoomOut.update({
            disabled: this._currentZoom <= map.zoomRange.min
        });
    }

    private _updateTheme(elements: {zoomOut: HTMLElement; zoomIn: HTMLElement}): void {
        const themeCtx = this._consumeContext(mappable.ThemeContext);
        if (!themeCtx) {
            return;
        }
        const {theme} = themeCtx;
        const {zoomIn, zoomOut} = elements;
        const zoomInDarkClassName = 'mappable--zoom-control__dark-in';
        const zoomOutDarkClassName = 'mappable--zoom-control__dark-out';
        zoomIn.classList.toggle(zoomInDarkClassName, theme === 'dark');
        zoomOut.classList.toggle(zoomOutDarkClassName, theme === 'dark');
    }

    private _updateOrientation(element: HTMLElement): void {
        const controlCtx = this._consumeContext(mappable.ControlContext);
        if (!controlCtx) {
            return;
        }
        const verticalZoomClassName = 'mappable--zoom-control_vertical';
        const horizontalZoomClassName = 'mappable--zoom-control_horizontal';
        const orientation = controlCtx.position[2];
        element.classList.toggle(verticalZoomClassName, orientation === 'vertical');
        element.classList.toggle(horizontalZoomClassName, orientation === 'horizontal');
    }
}

/**
 * Display zoom control on a map.
 *
 * @example
 * ```javascript
 * const controls = new MMapControls({position: 'right'});
 * const zoomControl = new MMapZoomControl();
 * controls.addChild(zoomControl);
 * map.addChild(controls);
 * ```
 */
class MMapZoomControl extends mappable.MMapComplexEntity<MMapZoomControlProps, DefaultProps> {
    static [mappable.optionsKeyVuefy] = MMapZoomControlVuefyOptions;

    static defaultProps = defaultProps;

    private _control!: MMapControl;
    private _zoom!: MMapZoomCommonControl;

    protected override _onAttach(): void {
        this._zoom = new MMapZoomCommonControl(this._props);
        this._control = new mappable.MMapControl().addChild(this._zoom);
        this.addChild(this._control);
    }

    protected override _onUpdate(props: MMapZoomControlProps): void {
        this._zoom.update(props);
    }

    protected override _onDetach(): void {
        this._control.removeChild(this._zoom);
        this.removeChild(this._control);
    }
}

export {MMapZoomControl, MMapZoomControlProps};
