import {MMapMarker, MMapMarkerProps} from '@mappable-world/mappable-types';
import {MMapBalloonMarkerVuefyOptions} from './vue';

import './index.css';
import tailSVG from './tail.svg';

type VerticalPosition = 'top' | 'bottom';
type HorizontalPosition = 'left' | 'right';
export type MMapBalloonPositionProps =
    | VerticalPosition
    | HorizontalPosition
    | `${VerticalPosition} ${HorizontalPosition}`
    | `${HorizontalPosition} ${VerticalPosition}`;

export type MMapBalloonContentProps = (close: () => void) => HTMLElement;

export type MMapBalloonMarkerProps = MMapMarkerProps & {
    /**
     * The function of creating balloon content
     * @param close - A function for hiding balloon content. The `MMapBalloonMarker` is not deleted.
     * @returns Balloon content as `HTMLElement`
     */
    content: MMapBalloonContentProps;
    /** The position of the balloon in relation to the point it is pointing to */
    position?: MMapBalloonPositionProps;
    /** The offset in pixels between the balloon pointer and the point it is pointing to. */
    offset?: number;
    /** Hide or show balloon on map */
    show?: boolean;
    /** Balloon closing callback */
    onClose?: () => void;
    /** Balloon opening callback */
    onOpen?: () => void;
};

const defaultProps = Object.freeze({position: 'top', offset: 0, show: true});
type DefaultProps = typeof defaultProps;

/**
 * `MMapBalloonMarker` is a balloon (popup) with customized content.
 * @example
 * ```js
 * const balloon = new MMapBalloonMarker({
 *  content: (close) => createPopupContentHTMLElement(close),
 *  position: 'top',
 *  onOpen:() => console.log('open'),
 *  onClose:() => console.log('close'),
 *  // support MMapMarker props
 *  coordinates: BALLOON_COORD,
 *  draggable: true,
 * });
 * map.addChild(balloon);
 * ```
 */
export class MMapBalloonMarker extends mappable.MMapComplexEntity<MMapBalloonMarkerProps, DefaultProps> {
    static defaultProps = defaultProps;
    static [mappable.optionsKeyVuefy] = MMapBalloonMarkerVuefyOptions;

    public get isOpen() {
        return this._props.show;
    }
    private _markerElement: HTMLElement;
    private _balloonContainer: HTMLElement;
    private _balloonTail: HTMLElement;
    private _marker: MMapMarker;

    private _togglePopup(forceShowBalloon?: boolean): void {
        let openBalloon = !this._props.show;
        if (forceShowBalloon !== undefined) {
            openBalloon = forceShowBalloon;
        }

        this._markerElement.classList.toggle('hide', !openBalloon);

        if (openBalloon) {
            this._props.onOpen?.();
        } else {
            this._props.onClose?.();
        }

        this._props.show = openBalloon;
    }

    protected __implGetDefaultProps(): DefaultProps {
        return MMapBalloonMarker.defaultProps;
    }

    protected _onAttach(): void {
        this._markerElement = document.createElement('mappable');
        this._markerElement.classList.add('mappable--balloon-marker');

        this._balloonContainer = document.createElement('mappable');
        this._balloonContainer.classList.add('mappable--balloon-marker_container');
        this._balloonContainer.appendChild(this._props.content(this.__closePopup));

        this._balloonTail = document.createElement('mappable');
        this._balloonTail.classList.add('mappable--balloon-marker_tail');
        this._balloonTail.innerHTML = tailSVG;

        this._togglePopup(this._props.show);
        this._updatePosition();
        this._updateOffset();

        this._markerElement.appendChild(this._balloonContainer);
        this._markerElement.appendChild(this._balloonTail);

        this._marker = new mappable.MMapMarker(this._props, this._markerElement);
        this.addChild(this._marker);

        this._watchContext(mappable.ThemeContext, () => this._updateTheme(), {
            immediate: true
        });
    }

    protected _onUpdate(propsDiff: Partial<MMapBalloonMarkerProps>): void {
        if (propsDiff.position !== undefined) {
            this._updatePosition();
        }
        if (propsDiff.offset !== undefined) {
            this._updateOffset();
        }

        if (propsDiff.content !== undefined) {
            this._balloonContainer.innerHTML = '';
            this._balloonContainer.appendChild(this._props.content(this.__closePopup));
        }

        if (propsDiff.show !== undefined) {
            this._togglePopup(propsDiff.show);
        }

        this._marker.update(this._props);
    }

    private _updateTheme() {
        const themeCtx = this._consumeContext(mappable.ThemeContext);
        const {theme} = themeCtx;
        this._balloonContainer.classList.toggle('mappable--balloon__dark', theme === 'dark');
        this._balloonTail.classList.toggle('mappable--balloon__dark', theme === 'dark');
    }

    private _updateOffset(): void {
        this._markerElement.style.setProperty('--offset', `${this._props.offset}px`);
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
        this._markerElement.classList.toggle('position-top', verticalPosition === 'top');

        // check bottom position
        this._markerElement.classList.toggle('position-bottom', verticalPosition === 'bottom');

        // check left position
        this._markerElement.classList.toggle('position-left', horizontalPosition === 'left');

        // check right position
        this._markerElement.classList.toggle('position-right', horizontalPosition === 'right');
    }

    private __closePopup = () => {
        this._togglePopup(false);
    };
}
