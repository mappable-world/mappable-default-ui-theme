import {MMapMarker, MMapMarkerProps} from '@mappable-world/mappable-types';
import {IconColor, IconName, IconSize, glyphColors, iconColors, icons} from '../icons';
import microPoiStrokeSVG from './backgrounds/micro-poi-stroke.svg';
import microPoiSVG from './backgrounds/micro-poi.svg';
import normalPinSVG from './backgrounds/normal-pin.svg';
import smallPoiStrokeSVG from './backgrounds/small-poi-stroke.svg';
import smallPoiSVG from './backgrounds/small-poi.svg';
import './index.css';

export type ThemesColor = {day: string; night: string};
export type MarkerColorProps = IconColor | ThemesColor;
export type MarkerSizeProps = IconSize | 'micro';

export type MMapDefaultMarkerProps = MMapMarkerProps & {
    iconName?: IconName;
    color?: MarkerColorProps;
    size?: MarkerSizeProps;
};

const defaultProps = Object.freeze({color: 'darkgray', size: 'small'});
type DefaultProps = typeof defaultProps;

type BackgroundAndIcon = {background: HTMLElement; stroke?: HTMLElement; icon?: HTMLElement};

export class MMapDefaultMarker extends mappable.MMapComplexEntity<MMapDefaultMarkerProps, DefaultProps> {
    static defaultProps = defaultProps;

    private _marker: MMapMarker;
    private _markerElement: HTMLElement;
    private _color: ThemesColor;
    private _background: HTMLElement;
    private _stroke?: HTMLElement;
    private _icon?: HTMLElement;

    constructor(props: MMapDefaultMarkerProps) {
        super(props);
    }

    protected __implGetDefaultProps(): DefaultProps {
        return MMapDefaultMarker.defaultProps;
    }

    protected _onAttach(): void {
        this._color = this._getColor();

        this._markerElement = document.createElement('mappable');
        this._markerElement.classList.add('mappable--default-marker-point');

        switch (this._props.size) {
            case 'normal':
                const normal = this._createNormalPin();
                this._icon = normal.icon;
                this._background = normal.background;
                this._stroke = normal.stroke;
                break;
            case 'small':
                const small = this._createSmallPoi();
                this._icon = small.icon;
                this._background = small.background;
                this._stroke = small.stroke;
                break;
            case 'micro':
                const micro = this._createMicroPoi();
                this._stroke = micro.stroke;
                this._background = micro.background;
                break;
        }

        this._markerElement.appendChild(this._background);
        if (this._stroke) {
            this._markerElement.appendChild(this._stroke);
        }
        if (this._icon) {
            this._markerElement.appendChild(this._icon);
        }

        this._marker = new mappable.MMapMarker(this._props, this._markerElement);
        this.addChild(this._marker);

        this._updateTheme();
    }

    protected _onUpdate(propsDiff: Partial<MMapDefaultMarkerProps>): void {
        if (propsDiff.color !== undefined) {
            this._color = this._getColor();
            this._updateTheme();
        }

        this._marker.update(this._props);
    }

    private _updateTheme() {
        switch (this._props.size) {
            case 'normal':
                const circle = this._background.querySelector<HTMLElement>('.mappable--normal-pin_circle');
                this._background.style.color = this._color.day;
                circle.style.backgroundColor = this._color.day;
                this._icon.style.color = glyphColors.day;
                circle.style.borderColor = glyphColors.day;
                break;
            case 'small':
                this._background.style.color = this._color.day;
                this._stroke.style.color = glyphColors.day;
                this._icon.style.color = glyphColors.day;
                break;
            case 'micro':
                this._background.style.color = this._color.day;
                this._stroke.style.color = glyphColors.day;
                break;
        }
    }

    private _getIcon(): string {
        if (this._props.size === 'micro') {
            return '';
        }
        return this._props.iconName !== undefined ? icons[this._props.iconName][this._props.size] : '';
    }

    private _getColor(): ThemesColor {
        const color = this._props.color as MarkerColorProps;

        if (typeof color === 'string') {
            if (!iconColors[color]) {
                throw new Error(
                    'The color should be one of the available color presets. If you need a custom color, pass it as an object with fields for day and night.'
                );
            }
            return iconColors[color];
        }

        return color;
    }

    private _createNormalPin(): BackgroundAndIcon {
        const normalPin = document.createElement('mappable');
        const normalIcon = document.createElement('mappable');
        const circle = document.createElement('mappable');

        normalPin.classList.add('mappable--normal-pin');
        normalPin.innerHTML = normalPinSVG;

        circle.classList.add('mappable--normal-pin_circle');
        normalPin.appendChild(circle);

        normalIcon.classList.add('mappable--normal-icon');
        normalIcon.innerHTML = this._getIcon();

        return {background: normalPin, icon: normalIcon};
    }

    private _createSmallPoi(): BackgroundAndIcon {
        const smallPoi = document.createElement('mappable');
        const smallPoiStroke = document.createElement('mappable');
        const smallIcon = document.createElement('mappable');

        smallPoi.classList.add('mappable--small-poi');
        smallPoi.innerHTML = smallPoiSVG;

        smallPoiStroke.classList.add('mappable--small-poi_stroke');
        smallPoiStroke.innerHTML = smallPoiStrokeSVG;

        smallIcon.classList.add('mappable--small-icon');
        smallIcon.innerHTML = this._getIcon();

        return {background: smallPoi, icon: smallIcon, stroke: smallPoiStroke};
    }

    private _createMicroPoi(): BackgroundAndIcon {
        const microPoi = document.createElement('mappable');
        const microPoiStroke = document.createElement('mappable');

        microPoi.classList.add('mappable--micro-poi');
        microPoi.innerHTML = microPoiSVG;

        microPoiStroke.classList.add('mappable--micro-poi_stroke');
        microPoiStroke.innerHTML = microPoiStrokeSVG;

        return {background: microPoi, stroke: microPoiStroke};
    }
}
