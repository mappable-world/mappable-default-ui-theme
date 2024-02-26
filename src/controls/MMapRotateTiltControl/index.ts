import type {EasingFunctionDescription, MMapControl} from '@mappable-world/mappable-types';
import {MMapRotateControl} from './MMapRotateControl';
import {MMapTiltControl} from './MMapTiltControl';

/**
 * MMapRotateTiltControl props
 */
export type MMapRotateTiltControlProps = {
    /** Easing function for map location animation */
    easing?: EasingFunctionDescription;
    /** Map location animate duration */
    duration?: number;
};
const defaultProps = Object.freeze({duration: 200});
type DefaultProps = typeof defaultProps;

/**
 * Display tilt and rotation controls on a map.
 *
 * @example
 * ```javascript
 * const controls = new MMapControls({position: 'right'});
 * const {MMapRotateTiltControl} = await mappable.import('@mappable-world/mappable-controls@0.0.1');
 * const rotateTiltControl = new MMapRotateTiltControl({});
 * controls.addChild(rotateTiltControl);
 * map.addChild(controls);
 * ```
 */
export class MMapRotateTiltControl extends mappable.MMapComplexEntity<MMapRotateTiltControlProps, DefaultProps> {
    static defaultProps = defaultProps;

    private _rotateControl!: MMapRotateControl;
    private _tiltControl!: MMapTiltControl;
    private _control!: MMapControl;

    protected __implGetDefaultProps() {
        return MMapRotateTiltControl.defaultProps;
    }

    constructor(props: MMapRotateTiltControlProps) {
        super(props);
    }

    protected _onAttach(): void {
        this._control = new mappable.MMapControl({transparent: true});
        this._rotateControl = new MMapRotateControl(this._props);
        this._tiltControl = new MMapTiltControl(this._props);

        this._rotateControl.addChild(this._tiltControl);
        this._control.addChild(this._rotateControl);
        this.addChild(this._control);
    }
    protected _onUpdate(): void {
        this._rotateControl.update(this._props);
        this._tiltControl.update(this._props);
    }
}
