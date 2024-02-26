import type {EasingFunctionDescription, MMapControl, MMapListener} from '@mappable-world/mappable-types';
import {MMapCameraRequest} from '@mappable-world/mappable-types/imperative/MMap';
import {Position, getDeltaAzimuth, toggleRotate} from '../utils/angle-utils';

import './index.css';

/**
 * MMapRotateControl props
 */
export type MMapRotateControlProps = {
    /** Easing function for map location animation */
    easing?: EasingFunctionDescription;
    /** Map location animate duration */
    duration?: number;
};
const defaultProps = Object.freeze({duration: 200});
type DefaultProps = typeof defaultProps;

/**
 * Display rotate control on a map.
 *
 * @example
 * ```javascript
 * const controls = new MMapControls({position: 'right'});
 * const {MMapRotateControl} = await mappable.import('@mappable-world/mappable-controls@0.0.1');
 * const rotateControl = new MMapRotateControl({});
 * controls.addChild(rotateControl);
 * map.addChild(controls);
 * ```
 */
export class MMapRotateControl extends mappable.MMapComplexEntity<MMapRotateControlProps, DefaultProps> {
    static defaultProps = defaultProps;
    private _control!: MMapControl;
    private _rotateControl!: InternalRotateControl;

    protected __implGetDefaultProps() {
        return MMapRotateControl.defaultProps;
    }

    constructor(props: MMapRotateControlProps) {
        super(props);
    }

    protected _onAttach(): void {
        this._control = new mappable.MMapControl({transparent: true});
        this._rotateControl = new InternalRotateControl(this._props);

        this._control.addChild(this._rotateControl);
        this.addChild(this._control);
    }

    protected _onUpdate(): void {
        this._rotateControl.update(this._props);
    }
}

const ROTATE_CONTROL_CLASS = 'mappable--rotate';

export class InternalRotateControl extends mappable.MMapComplexEntity<MMapRotateControlProps, DefaultProps> {
    private _listener!: MMapListener;

    private _element?: HTMLElement;
    private _domDetach: () => void;
    private _isClick = false;
    private _controlCenterPosition?: Position;
    private _startMovePosition?: Position;
    private _startAzimuth?: number;

    protected _onAttach(): void {
        this._listener = new mappable.MMapListener({
            onUpdate: (event) => this._onMapUpdate(event.camera)
        });
        this.addChild(this._listener);

        this._element = document.createElement('mappable');
        this._element.textContent = 'N';
        this._element.classList.add(ROTATE_CONTROL_CLASS);
        this._element.addEventListener('click', this._toggleMapRotate);
        this._element.addEventListener('mousedown', this._onRotateStart);

        this._domDetach = mappable.useDomContext(this, this._element, null);
    }

    protected _onDetach(): void {
        this._element?.removeEventListener('click', this._toggleMapRotate);
        this._element?.removeEventListener('mousedown', this._onRotateStart);
        this._domDetach?.();
        this._domDetach = undefined;
    }

    private _onMapUpdate({azimuth}: MMapCameraRequest): void {
        if (!this._element) {
            return;
        }
        this._element.style.transform = `rotateZ(${azimuth}rad)`;
    }

    private _toggleMapRotate = (): void => {
        if (!this.root || !this._isClick) {
            return;
        }
        const {duration, easing} = this._props;
        let targetAzimuth = toggleRotate(this.root.azimuth);
        this.root.update({camera: {azimuth: targetAzimuth, duration, easing}});
    };

    private _onRotateStart = (event: MouseEvent) => {
        const isLeftClick = event.button === 0;
        if (!isLeftClick || !this._element) {
            return;
        }
        this._isClick = true;

        const {x, y, height, width} = this._element.getBoundingClientRect();

        this._controlCenterPosition = {
            x: x + width / 2,
            y: y + height / 2
        };
        this._startMovePosition = {
            x: event.clientX,
            y: event.clientY
        };
        this._startAzimuth = this.root?.azimuth;
        this._addRotateEventListeners();
    };

    private _onRotateMove = (event: MouseEvent) => {
        if (!this._controlCenterPosition || !this._startMovePosition || this._startAzimuth === undefined) {
            return;
        }
        const deltaAzimuth = getDeltaAzimuth(this._startMovePosition, this._controlCenterPosition, {
            x: event.pageX,
            y: event.pageY
        });
        this._isClick = false;
        this.root?.update({camera: {azimuth: this._startAzimuth + deltaAzimuth}});
    };

    private _onRotateEnd = () => {
        this._removeRotateEventListeners();
    };

    private _addRotateEventListeners = (): void => {
        window.addEventListener('mousemove', this._onRotateMove);
        window.addEventListener('mouseup', this._onRotateEnd);
    };
    private _removeRotateEventListeners = (): void => {
        window.removeEventListener('mousemove', this._onRotateMove);
        window.removeEventListener('mouseup', this._onRotateEnd);
    };
}
