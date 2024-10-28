import type {EasingFunctionDescription, MMapControl} from '@mappable-world/mappable-types';
import type {CustomVuefyOptions} from '@mappable-world/mappable-types/modules/vuefy';
import type TVue from '@vue/runtime-core';
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

export const MMapRotateTiltControlVuefyOptions: CustomVuefyOptions<MMapRotateTiltControl> = {
    props: {
        easing: [Function, String, Object] as TVue.PropType<EasingFunctionDescription>,
        duration: {type: Number, default: defaultProps.duration}
    }
};

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
    static [mappable.optionsKeyVuefy] = MMapRotateTiltControlVuefyOptions;

    private _rotateControl!: MMapRotateControl;
    private _tiltControl!: MMapTiltControl;
    private _control!: MMapControl;

    constructor(props: MMapRotateTiltControlProps) {
        super(props);
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
