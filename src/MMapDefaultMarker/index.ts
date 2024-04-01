import {MMapMarker, MMapMarkerProps} from '@mappable-world/mappable-types';
import {IconName} from '../icons/types/icons';
import pin from './pin.svg';
import './index.css';

export type MMapDefaultMarkerProps = MMapMarkerProps & {
    name: IconName;
    color: string;
};

export class MMapDefaultMarker extends mappable.MMapComplexEntity<MMapDefaultMarkerProps> {
    private _marker: MMapMarker;
    private _markerElement: HTMLElement;

    constructor(props: MMapDefaultMarkerProps) {
        super(props);
    }

    protected _onAttach(): void {
        this._markerElement = document.createElement('mappable');
        this._markerElement.classList.add('mappable--point');
        this._markerElement.innerHTML = pin;
        this._markerElement.style.color = this._props.color;
        this._markerElement.style.backgroundColor = this._props.color;

        this._marker = new mappable.MMapMarker(this._props, this._markerElement);
        this.addChild(this._marker);
    }

    protected _onUpdate(propsDiff: Partial<MMapDefaultMarkerProps>): void {
        if (propsDiff.color !== undefined) {
            this._markerElement.style.color = this._props.color;
        }
        this._marker.update(this._props);
    }
}
