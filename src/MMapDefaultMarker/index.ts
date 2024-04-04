import {MMapMarker, MMapMarkerProps} from '@mappable-world/mappable-types';
import {IconColor, IconName, iconColors, icons, glyphColors} from '../icons';
import './index.css';
import pin from './pin.svg';

export type MMapDefaultMarkerProps = MMapMarkerProps & {
    iconName?: IconName;
    color?: IconColor;
};

const defaultProps = Object.freeze({color: 'darkgray'});
type DefaultProps = typeof defaultProps;

export class MMapDefaultMarker extends mappable.MMapComplexEntity<MMapDefaultMarkerProps, DefaultProps> {
    static defaultProps = defaultProps;

    private _marker: MMapMarker;
    private _markerElement: HTMLElement;
    private _pin: HTMLElement;
    private _icon: HTMLElement;
    private _color: {day: string; night: string};

    constructor(props: MMapDefaultMarkerProps) {
        super(props);
    }

    protected __implGetDefaultProps(): DefaultProps {
        return MMapDefaultMarker.defaultProps;
    }

    protected _onAttach(): void {
        this._color = iconColors[this._props.color];
        this._markerElement = document.createElement('mappable');
        this._pin = document.createElement('mappable');
        this._icon = document.createElement('mappable');

        this._markerElement.classList.add('mappable--point');

        this._pin.classList.add('mappable--pin');
        this._pin.innerHTML = pin;

        this._icon.classList.add('mappable--icon');
        if (this._props.iconName !== undefined) {
            this._icon.innerHTML = icons[this._props.iconName].normal;
        }

        this._pin.appendChild(this._icon);
        this._markerElement.appendChild(this._pin);
        this._marker = new mappable.MMapMarker(this._props, this._markerElement);
        this.addChild(this._marker);

        this._updateTheme();
    }

    protected _onUpdate(propsDiff: Partial<MMapDefaultMarkerProps>): void {
        if (propsDiff.color !== undefined) {
            this._color = iconColors[this._props.color];
            this._updateTheme();
        }

        this._icon.innerHTML = this._props.iconName !== undefined ? icons[this._props.iconName].normal : '';

        this._marker.update(this._props);
    }

    private _updateTheme() {
        this._markerElement.style.color = this._color.day;
        this._markerElement.style.backgroundColor = this._color.day;
        this._markerElement.style.borderColor = '#f8f8f8';
        this._icon.style.color = glyphColors.day;
    }
}
