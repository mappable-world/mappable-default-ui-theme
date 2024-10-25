import type TVue from '@vue/runtime-core';
import type {MMapControl, MMapControlCommonButton, MMapMarker} from '@mappable-world/mappable-types';
import type {EasingFunctionDescription, LngLat} from '@mappable-world/mappable-types/common/types';
import type {CustomVuefyOptions} from '@mappable-world/mappable-types/modules/vuefy';
import {MMapControlSpinner} from './MMapControlSpinner';
import './index.css';

/**
 * MMapGeolocationControl props
 */
type MMapGeolocationControlProps = {
    /** Geolocation request callback */
    onGeolocatePosition?: (position: LngLat) => void;
    /** Data source id for geolocation placemark */
    source?: string;
    /** Easing function for map location animation */
    easing?: EasingFunctionDescription;
    /** Map location animate duration */
    duration?: number;
    /** Map zoom after geolocate position */
    zoom?: number;
};

const defaultProps = Object.freeze({duration: 500});

type DefaultProps = typeof defaultProps;

const MMapGeolocationControlVuefyOptions: CustomVuefyOptions<MMapGeolocationControl> = {
    props: {
        onGeolocatePosition: Function as TVue.PropType<MMapGeolocationControlProps['onGeolocatePosition']>,
        source: String,
        easing: [String, Object, Function] as TVue.PropType<EasingFunctionDescription>,
        duration: {type: Number, default: defaultProps.duration},
        zoom: {type: Number}
    }
};

/**
 * Display geolocation control on a map.
 *
 * @example
 * ```javascript
 * const controls = new MMapControls({position: 'right'});
 * const geolocationControl = new MMapGeolocationControl();
 * controls.addChild(geolocationControl);
 * map.addChild(controls);
 * ```
 */
class MMapGeolocationControl extends mappable.MMapGroupEntity<MMapGeolocationControlProps, DefaultProps> {
    static defaultProps = defaultProps;
    static [mappable.optionsKeyVuefy] = MMapGeolocationControlVuefyOptions;
    private _control!: MMapControl;
    private _button!: MMapControlCommonButton;
    private _spinner!: MMapControlSpinner;
    private _marker!: MMapMarker;
    private _loading: boolean = false;
    private _element!: HTMLElement;
    private _unwatchThemeContext?: () => void;

    constructor(props: MMapGeolocationControlProps) {
        super(props);
        this._handleGeolocationClick = this._handleGeolocationClick.bind(this);
    }

    private _timeout: number;
    private _setLoading(loading: boolean): void {
        this._loading = loading;
        clearTimeout(this._timeout);
        this._timeout = window.setTimeout(() => {
            if (!this._spinner.parent && loading) {
                this._button.addChild(this._spinner);
            } else if (this._spinner.parent && !loading) {
                this._button.removeChild(this._spinner);
            }

            this._element.classList.toggle('mappable--geolocation-control-is-loading', loading);
            this._button.update({disabled: this._loading});
        }, 100);
    }

    private _position: LngLat | null = null;

    private _updatePosition(pos: LngLat): void {
        this._position = pos;

        if (this._props.onGeolocatePosition) {
            this._props.onGeolocatePosition(this._position);
        }

        const map = this.root;
        map?.update({
            location: {
                center: this._position,
                zoom: this._props.zoom,
                duration: this._props.duration,
                easing: this._props.easing
            }
        });

        this.addChild(this._marker);
        this._marker.update({coordinates: this._position});
    }

    private _handleGeolocationClick(): void {
        if (this._loading) return;
        this._setLoading(true);

        mappable.geolocation
            .getPosition({enableHighAccuracy: true, maximumAge: 60000})
            .then((position: {coords: LngLat; accuracy: number}) => {
                this._setLoading(false);
                this._updatePosition(position.coords);
            });
    }

    protected override _onAttach(): void {
        this._control = new mappable.MMapControl();
        this._element = document.createElement('mappable');
        this._element.classList.add('mappable--geolocation-control');

        this._button = new mappable.MMapControlCommonButton({
            onClick: this._handleGeolocationClick,
            element: this._element
        });

        this._spinner = new MMapControlSpinner({});
        this._control.addChild(this._button);
        this.addChild(this._control);

        this._initMarker();

        this._unwatchThemeContext = this._watchContext(mappable.ThemeContext, () => this._updateTheme(), {
            immediate: true
        });
    }

    protected override _onDetach() {
        this._control.removeChild(this._button);
        this.removeChild(this._control);
        this._unwatchThemeContext?.();
    }

    protected override _onUpdate(props: Partial<MMapGeolocationControlProps>): void {
        if (props.source) {
            this._marker.update({
                source: props.source
            });
        }
    }

    private _initMarker() {
        this._marker = new mappable.MMapMarker(
            {
                source: this._props.source,
                coordinates: [0, 0]
            },
            document.createElement('mappable')
        );
        this._marker.element.className = `mappable--geolocation-control-self`;
    }

    private _updateTheme(): void {
        const themeCtx = this._consumeContext(mappable.ThemeContext);
        if (!themeCtx) {
            return;
        }
        const {theme} = themeCtx;
        const geolocationControlDarkClassName = 'mappable--geolocation-control__dark';
        if (theme === 'dark') {
            this._element.classList.add(geolocationControlDarkClassName);
        } else if (theme === 'light') {
            this._element.classList.remove(geolocationControlDarkClassName);
        }
    }
}

export {MMapGeolocationControl, MMapGeolocationControlProps};
