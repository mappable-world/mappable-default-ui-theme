import {MMapMarker, MMapMarkerProps} from '@mappable-world/mappable-types';
import {IconColor, IconName, iconColors, icons} from '../../icons';
import microPoiStrokeSVG from './backgrounds/micro-poi-stroke.svg';
import microPoiSVG from './backgrounds/micro-poi.svg';
import normalPinStrokeSVG from './backgrounds/normal-pin-stroke.svg';
import normalPinSVG from './backgrounds/normal-pin.svg';
import smallPoiStrokeSVG from './backgrounds/small-poi-stroke.svg';
import smallPoiSVG from './backgrounds/small-poi.svg';
import './index.css';

const GLYPH_COLOR = '#FFFFFF';

export type ThemesColor = {day: string; night: string};
export type MarkerColorProps = IconColor | ThemesColor;
export type MarkerSizeProps = 'normal' | 'small' | 'micro';

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
    private _unwatchThemeContext?: () => void;

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

        this._unwatchThemeContext = this._watchContext(mappable.ThemeContext, () => this._updateTheme(), {
            immediate: true
        });
    }

    protected _onUpdate(propsDiff: Partial<MMapDefaultMarkerProps>): void {
        if (propsDiff.color !== undefined) {
            this._color = this._getColor();
            this._updateTheme();
        }

        this._marker.update(this._props);
    }

    protected _onDetach(): void {
        this._unwatchThemeContext?.();
    }

    private _updateTheme() {
        const themeCtx = this._consumeContext(mappable.ThemeContext);
        const theme = themeCtx.theme;

        const strokeColor = GLYPH_COLOR;
        const backgroundColor = theme === 'light' ? this._color.day : this._color.night;

        switch (this._props.size) {
            case 'normal':
                this._background.style.color = backgroundColor;
                this._stroke.style.color = strokeColor;
                this._icon.style.color = strokeColor;
                break;
            case 'small':
                this._background.style.color = backgroundColor;
                this._stroke.style.color = strokeColor;
                this._icon.style.color = strokeColor;
                break;
            case 'micro':
                this._background.style.color = backgroundColor;
                this._stroke.style.color = strokeColor;
                break;
        }
    }

    private _getIcon(): string {
        const {size} = this._props;
        if (size === 'micro' || this._props.iconName === undefined) {
            return '';
        }
        if (size === 'normal') {
            return icons[this._props.iconName];
        }
        return icons[this._props.iconName].replace(/<svg/, '$& style="transform:scale(calc(14/24)"');
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
        const normalPinStroke = document.createElement('mappable');
        const normalIcon = document.createElement('mappable');

        normalPin.classList.add('mappable--normal-pin');
        normalPin.innerHTML = normalPinSVG;

        normalPinStroke.classList.add('mappable--normal-pin_stroke');
        normalPinStroke.innerHTML = normalPinStrokeSVG;

        normalIcon.classList.add('mappable--normal-icon');
        normalIcon.innerHTML = this._getIcon();

        return {background: normalPin, icon: normalIcon, stroke: normalPinStroke};
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
