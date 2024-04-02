import {MMapMarker, MMapMarkerProps} from '@mappable-world/mappable-types';
import {IconName} from '../icons/icon-name';
import {icons} from '../icons';
import pin from './pin.svg';
import './index.css';

export type MMapDefaultMarkerProps = MMapMarkerProps & {
    name: IconName;
    color: string;
};

export class MMapDefaultMarker extends mappable.MMapComplexEntity<MMapDefaultMarkerProps> {
    private _marker: MMapMarker;
    private _markerElement: HTMLElement;
    private _pin: HTMLElement;
    private _icon: HTMLElement;

    constructor(props: MMapDefaultMarkerProps) {
        super(props);
    }

    protected _onAttach(): void {
        this._markerElement = document.createElement('mappable');
        this._pin = document.createElement('mappable');
        this._icon = document.createElement('mappable');

        this._markerElement.classList.add('mappable--point');
        this._markerElement.style.color = this._props.color;
        this._markerElement.style.backgroundColor = this._props.color;

        this._pin.classList.add('mappable--pin');
        this._pin.innerHTML = pin;

        this._icon.classList.add('mappable--icon');
        this._icon.innerHTML = icons[this._props.name].normal;

        this._pin.appendChild(this._icon);
        this._markerElement.appendChild(this._pin);

        this._marker = new mappable.MMapMarker(this._props, this._markerElement);
        this.addChild(this._marker);
    }

    protected _onUpdate(propsDiff: Partial<MMapDefaultMarkerProps>): void {
        if (propsDiff.color !== undefined) {
            this._markerElement.style.color = this._props.color;
            this._markerElement.style.backgroundColor = this._props.color;
        }
        if (propsDiff.name !== undefined) {
            this._icon.innerHTML = icons[propsDiff.name].normal;
        }
        this._marker.update(this._props);
    }
}
