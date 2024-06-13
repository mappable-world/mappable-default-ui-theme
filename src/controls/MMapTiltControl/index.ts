import type {EasingFunctionDescription, MMapControl, MMapListener} from '@mappable-world/mappable-types';
import {MMapCameraRequest} from '@mappable-world/mappable-types/imperative/MMap';
import {CLICK_TOLERANCE_PX, Position, radToDeg, toggleTilt} from '../utils/angle-utils';
import {MMapTiltControlVuefyOptions} from './vue';

import './index.css';

/**
 * MMapTiltControl props
 */
export type MMapTiltControlProps = {
    /** Easing function for map location animation */
    easing?: EasingFunctionDescription;
    /** Map location animate duration */
    duration?: number;
};
const defaultProps = Object.freeze({duration: 200});
type DefaultProps = typeof defaultProps;

/**
 * Display tilt control on a map.
 *
 * @example
 * ```javascript
 * const controls = new MMapControls({position: 'right'});
 * const {MMapTiltControl} = await mappable.import('@mappable-world/mappable-controls@0.0.1');
 * const tiltControl = new MMapTiltControl({});
 * controls.addChild(tiltControl);
 * map.addChild(controls);
 * ```
 */
export class MMapTiltControl extends mappable.MMapComplexEntity<MMapTiltControlProps, DefaultProps> {
    static defaultProps = defaultProps;
    static [mappable.optionsKeyVuefy] = MMapTiltControlVuefyOptions;
    private _control!: MMapControl;
    private _tiltControl!: InternalTiltControl;

    constructor(props: MMapTiltControlProps) {
        super(props);
        this._control = new mappable.MMapControl({transparent: true});
        this._tiltControl = new InternalTiltControl(this._props);

        this._control.addChild(this._tiltControl);
        this.addChild(this._control);
    }

    protected _onUpdate(): void {
        this._tiltControl.update(this._props);
    }
}

const TILT_CONTROL_CLASS = 'mappable--tilt';
const TILT_CONTROL_ACTIVE_CLASS = 'mappable--tilt_active';
const TILT_LABEL_CLASS = 'mappable--tilt_label';
const TILT_CONTROL_IN_ACTION_CLASS = 'mappable--tilt-control__in-action';
const TILT_INDICATOR_IN_CLASS = 'mappable--tilt_indicator_in';
const TILT_INDICATOR_OUT_CLASS = 'mappable--tilt_indicator_out';
const TILT_INDICATOR_ACTIVE_CLASS = 'mappable--tilt_indicator__active';
const HIDE_INDICATOR_CLASS = 'hide-indicator';

class InternalTiltControl extends mappable.MMapComplexEntity<MMapTiltControlProps> {
    private _listener!: MMapListener;

    private _element?: HTMLElement;
    private _label?: HTMLElement;
    private _tiltIn?: HTMLElement;
    private _tiltOut?: HTMLElement;
    private _domDetach?: () => void;

    private _startTilt?: number;
    private _startMovePosition?: Position;
    private _isClick: boolean = false;
    private _prevTilt?: number;

    protected _onAttach(): void {
        this._listener = new mappable.MMapListener({
            onUpdate: (event) => this._onMapUpdate(event.camera)
        });
        this.addChild(this._listener);

        this._element = document.createElement('mappable');
        this._label = document.createElement('mappable');
        this._tiltIn = document.createElement('mappable');
        this._tiltOut = document.createElement('mappable');

        this._element.classList.add(TILT_CONTROL_CLASS);
        this._label.classList.add(TILT_LABEL_CLASS);
        const {tilt, tiltRange} = this.root;
        this._label.textContent = tilt === tiltRange.min ? '3D' : '2D';
        this._tiltIn.classList.add(TILT_INDICATOR_IN_CLASS, HIDE_INDICATOR_CLASS);
        this._tiltOut.classList.add(TILT_INDICATOR_OUT_CLASS, HIDE_INDICATOR_CLASS);

        this._element.appendChild(this._tiltIn);
        this._element.appendChild(this._label);
        this._element.appendChild(this._tiltOut);

        this._element.addEventListener('click', this._toggleMapTilt);
        this._element.addEventListener('mousedown', this._onTiltStart);

        this._domDetach = mappable.useDomContext(this, this._element, null);
    }

    protected _onDetach(): void {
        this._domDetach?.();
        this._domDetach = undefined;
        this._element?.removeEventListener('click', this._toggleMapTilt);
        this._element?.removeEventListener('mousedown', this._onTiltStart);
    }

    private _toggleMapTilt = (): void => {
        if (!this.root || !this._isClick) {
            return;
        }
        const {duration, easing} = this._props;
        const {
            tilt,
            tiltRange: {min, max}
        } = this.root;
        const targetTiltDeg = toggleTilt(tilt, min, max);
        this.root.setCamera({tilt: targetTiltDeg, duration, easing});
    };

    private _onTiltStart = (event: MouseEvent) => {
        const isLeftClick = event.button === 0;
        if (!isLeftClick) {
            return;
        }
        this._isClick = true;
        this._startTilt = this.root?.tilt;
        this._prevTilt = this.root?.tilt;
        this._startMovePosition = {
            x: event.clientX,
            y: event.clientY
        };
        this._element?.classList.toggle(TILT_CONTROL_IN_ACTION_CLASS, true);
        this._addTiltEventListeners();
    };

    private _onTiltMove = (event: MouseEvent) => {
        if (!this._startMovePosition || this._startTilt === undefined || this._prevTilt === undefined || !this.root) {
            return;
        }
        const delta = this._startMovePosition.y - event.clientY;

        if (Math.abs(delta) < CLICK_TOLERANCE_PX) {
            return;
        }
        const deltaTilt = (Math.PI * delta) / this.root.size.y;
        const currentTilt = this._startTilt + deltaTilt;
        this._isClick = false;
        this._tiltIn?.classList.remove(HIDE_INDICATOR_CLASS);
        this._tiltOut?.classList.remove(HIDE_INDICATOR_CLASS);

        const tiltDiff = currentTilt - this._prevTilt;
        if (tiltDiff !== 0) {
            this._tiltOut?.classList.toggle(TILT_INDICATOR_ACTIVE_CLASS, tiltDiff < 0);
            this._tiltIn?.classList.toggle(TILT_INDICATOR_ACTIVE_CLASS, tiltDiff > 0);
        }

        this.root.setCamera({tilt: currentTilt});
        this._prevTilt = currentTilt;
    };

    private _onTiltEnd = () => {
        this._tiltIn?.classList.add(HIDE_INDICATOR_CLASS);
        this._tiltOut?.classList.add(HIDE_INDICATOR_CLASS);
        this._element?.classList.toggle(TILT_CONTROL_IN_ACTION_CLASS, false);
        this._removeTiltEventListeners();
    };

    private _onMapUpdate({tilt: radTilt}: MMapCameraRequest): void {
        if (!this._element || !this._label) {
            return;
        }
        const degTilt = radToDeg(radTilt ?? 0);
        const isMinTilt = Math.round(degTilt) === this.root.tiltRange.min;
        this._label.textContent = isMinTilt ? '3D' : '2D';
        this._element.classList.toggle(TILT_CONTROL_ACTIVE_CLASS, !isMinTilt);
    }

    private _addTiltEventListeners(): void {
        window.addEventListener('mousemove', this._onTiltMove);
        window.addEventListener('mouseup', this._onTiltEnd);
    }

    private _removeTiltEventListeners(): void {
        window.removeEventListener('mousemove', this._onTiltMove);
        window.removeEventListener('mouseup', this._onTiltEnd);
    }
}
