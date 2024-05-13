import {MMapMarker, MMapMarkerProps} from '@mappable-world/mappable-types';
import {MMapPopupMarkerReactifyOverride} from './react';
import {MMapPopupMarkerVuefyOptions, MMapPopupMarkerVuefyOverride} from './vue';

import './index.css';
import tailSVG from './tail.svg';

type VerticalPosition = 'top' | 'bottom';
type HorizontalPosition = 'left' | 'right';
export type MMapPopupPositionProps =
    | VerticalPosition
    | HorizontalPosition
    | `${VerticalPosition} ${HorizontalPosition}`
    | `${HorizontalPosition} ${VerticalPosition}`;

export type MMapPopupContentProps = () => HTMLElement;

export type MMapPopupMarkerProps = MMapMarkerProps & {
    /** The function of creating popup content */
    content: MMapPopupContentProps;
    /** The position of the popup in relation to the point it is pointing to */
    position?: MMapPopupPositionProps;
    /** The offset in pixels between the popup pointer and the point it is pointing to. */
    offset?: number;
    /** Hide or show popup on map */
    show?: boolean;
    /** Popup closing callback */
    onClose?: () => void;
    /** Popup opening callback */
    onOpen?: () => void;
};

const defaultProps = Object.freeze({position: 'top', offset: 0, show: true});
type DefaultProps = typeof defaultProps;

/**
 * `MMapPopupMarker` is a popup with customized content.
 * @example
 * ```js
 * const popup = new MMapPopupMarker({
 *  content: (close) => createPopupContentHTMLElement(close),
 *  position: 'top',
 *  onOpen:() => console.log('open'),
 *  onClose:() => console.log('close'),
 *  // support MMapMarker props
 *  coordinates: POPUP_COORD,
 *  draggable: true,
 * });
 * map.addChild(popup);
 * ```
 */
export class MMapPopupMarker extends mappable.MMapComplexEntity<MMapPopupMarkerProps, DefaultProps> {
    static defaultProps = defaultProps;
    static [mappable.overrideKeyReactify] = MMapPopupMarkerReactifyOverride;
    static [mappable.overrideKeyVuefy] = MMapPopupMarkerVuefyOverride;
    static [mappable.optionsKeyVuefy] = MMapPopupMarkerVuefyOptions;

    public get isOpen() {
        return this._props.show;
    }
    private _markerElement: HTMLElement;
    private _popupContainer: HTMLElement;
    private _popupTail: HTMLElement;
    private _marker: MMapMarker;

    private _togglePopup(forceShowPopup?: boolean): void {
        const openPopup = forceShowPopup ?? !this._props.show;

        this._markerElement.classList.toggle('mappable--popup-marker__hide', !openPopup);

        if (openPopup) {
            this._props.onOpen?.();
        } else {
            this._props.onClose?.();
        }

        this._props.show = openPopup;
    }

    protected _onAttach(): void {
        this._markerElement = document.createElement('mappable');
        this._markerElement.classList.add('mappable--popup-marker');

        this._popupContainer = document.createElement('mappable');
        this._popupContainer.classList.add('mappable--popup-marker_container');
        this._popupContainer.appendChild(this._props.content());

        this._popupTail = document.createElement('mappable');
        this._popupTail.classList.add('mappable--popup-marker_tail');
        this._popupTail.innerHTML = tailSVG;

        this._togglePopup(this._props.show);
        this._updatePosition();
        this._updateOffset();

        this._markerElement.appendChild(this._popupContainer);
        this._markerElement.appendChild(this._popupTail);

        this._marker = new mappable.MMapMarker(this._props, this._markerElement);
        this.addChild(this._marker);

        this._watchContext(mappable.ThemeContext, () => this._updateTheme(), {
            immediate: true
        });
    }

    protected _onUpdate(propsDiff: Partial<MMapPopupMarkerProps>): void {
        if (propsDiff.position !== undefined) {
            this._updatePosition();
        }
        if (propsDiff.offset !== undefined) {
            this._updateOffset();
        }

        if (propsDiff.content !== undefined) {
            this._popupContainer.innerHTML = '';
            this._popupContainer.appendChild(this._props.content());
        }

        if (propsDiff.show !== undefined) {
            this._togglePopup(propsDiff.show);
        }

        this._marker.update(this._props);
    }

    private _updateTheme() {
        const themeCtx = this._consumeContext(mappable.ThemeContext);
        const {theme} = themeCtx;
        this._popupContainer.classList.toggle('mappable--popup-marker__dark', theme === 'dark');
        this._popupTail.classList.toggle('mappable--popup-marker__dark', theme === 'dark');
    }

    private _updateOffset(): void {
        this._markerElement.style.setProperty('--mappable-default-offset', `${this._props.offset}px`);
    }

    private _updatePosition(): void {
        const {position} = this._props;
        let verticalPosition: VerticalPosition;
        let horizontalPosition: HorizontalPosition;

        const positionTypeHash: Record<HorizontalPosition | VerticalPosition, 'horizontal' | 'vertical'> = {
            top: 'vertical',
            left: 'horizontal',
            bottom: 'vertical',
            right: 'horizontal'
        };

        if (position === 'top' || position === 'bottom') {
            verticalPosition = position;
        } else if (position === 'left' || position === 'right') {
            horizontalPosition = position;
        } else {
            const [first, second] = position.split(' ') as (HorizontalPosition | VerticalPosition)[];
            if (positionTypeHash[first] === 'vertical' && positionTypeHash[second] === 'horizontal') {
                verticalPosition = first as VerticalPosition;
                horizontalPosition = second as HorizontalPosition;
            } else if (positionTypeHash[first] === 'horizontal' && positionTypeHash[second] === 'vertical') {
                verticalPosition = second as VerticalPosition;
                horizontalPosition = first as HorizontalPosition;
            }
        }

        // check top position
        this._markerElement.classList.toggle('mappable--popup-marker__position-top', verticalPosition === 'top');

        // check bottom position
        this._markerElement.classList.toggle('mappable--popup-marker__position-bottom', verticalPosition === 'bottom');

        // check left position
        this._markerElement.classList.toggle('mappable--popup-marker__position-left', horizontalPosition === 'left');

        // check right position
        this._markerElement.classList.toggle('mappable--popup-marker__position-right', horizontalPosition === 'right');
    }
}
