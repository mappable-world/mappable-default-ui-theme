import type {MMapListener} from '@mappable-world/mappable-types';
import {MMapCameraRequest} from '@mappable-world/mappable-types/imperative/MMap';
import type {MMapRotateTiltControlProps} from '.';
import {Position, getDeltaAzimuth, toggleRotate} from '../utils/angle-utils';
import './MMapRotateControl.css';

const ROTATE_CONTROL_CLASS = 'mappable--rotate-control';
const ROTATE_RING_CLASS = 'mappable--rotate-control_ring';
const ROTATE_CONTAINER_CLASS = 'mappable--rotate-control_container';

export class MMapRotateControl extends mappable.MMapGroupEntity<MMapRotateTiltControlProps> {
    private _element?: HTMLElement;
    private _containerElement?: HTMLElement;
    private _ringElement?: HTMLElement;
    private _domDetach?: () => void;

    private _listener!: MMapListener;
    private _isClick: boolean = false;
    private _controlCenterPosition?: Position;
    private _startMovePosition?: Position;
    private _startAzimuth?: number;

    constructor(props: MMapRotateTiltControlProps) {
        super(props);
    }

    protected _onAttach(): void {
        this._listener = new mappable.MMapListener({
            onUpdate: (event) => this._onMapUpdate(event.camera)
        });
        this.addChild(this._listener);

        this._element = document.createElement('mappable');
        this._element.classList.add(ROTATE_CONTROL_CLASS);

        this._containerElement = document.createElement('mappable');
        this._containerElement.classList.add(ROTATE_CONTAINER_CLASS);

        this._ringElement = document.createElement('mappable');
        this._ringElement.classList.add(ROTATE_RING_CLASS);
        this._ringElement.addEventListener('click', this._toggleMapRotate);
        this._ringElement.addEventListener('mousedown', this._onRotateStart);

        this._element.appendChild(this._ringElement);
        this._element.appendChild(this._containerElement);

        this._domDetach = mappable.useDomContext(this, this._element, this._containerElement);
    }

    protected _onDetach(): void {
        this._ringElement?.removeEventListener('click', this._toggleMapRotate);
        this._ringElement?.removeEventListener('mousedown', this._onRotateStart);
        this._domDetach?.();
        this._domDetach = undefined;
        this._element = undefined;
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

    private _onMapUpdate({azimuth}: MMapCameraRequest): void {
        if (this._ringElement === undefined) {
            return;
        }
        this._ringElement.style.transform = `rotateZ(${azimuth}rad)`;
    }
}
