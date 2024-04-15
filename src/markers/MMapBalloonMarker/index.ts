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

export type MMapBalloonMarkerProps = MMapMarkerProps & {
    // TODO: content props as string or function
    content: string;
    position?: MMapBalloonPositionProps;
    offset?: number;
};

const defaultProps = Object.freeze({position: 'top', offset: 0});
type DefaultProps = typeof defaultProps;

export class MMapBalloonMarker extends mappable.MMapComplexEntity<MMapBalloonMarkerProps, DefaultProps> {
    static defaultProps = defaultProps;
    static [mappable.optionsKeyVuefy] = MMapBalloonMarkerVuefyOptions;

    private _markerElement: HTMLElement;
    private _balloonContainer: HTMLElement;
    private _balloonTail: HTMLElement;
    private _marker: MMapMarker;

    private _unwatchThemeContext?: () => void;

    protected __implGetDefaultProps(): DefaultProps {
        return MMapBalloonMarker.defaultProps;
    }

    protected _onAttach(): void {
        this._markerElement = document.createElement('mappable');
        this._markerElement.classList.add('mappable--balloon-marker');

        this._balloonContainer = document.createElement('mappable');
        this._balloonContainer.classList.add('mappable--balloon-marker_container');
        this._balloonContainer.textContent = this._props.content;

        this._balloonTail = document.createElement('mappable');
        this._balloonTail.classList.add('mappable--balloon-marker_tail');
        this._balloonTail.innerHTML = tailSVG;

        this._updatePosition();
        this._updateOffset();

        this._markerElement.appendChild(this._balloonContainer);
        this._markerElement.appendChild(this._balloonTail);

        this._marker = new mappable.MMapMarker(this._props, this._markerElement);
        this.addChild(this._marker);

        this._unwatchThemeContext = this._watchContext(mappable.ThemeContext, () => this._updateTheme(), {
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
            this._balloonContainer.textContent = this._props.content;
        }

        this._marker.update(this._props);
    }

    protected _onDetach(): void {
        this._unwatchThemeContext?.();
        this._unwatchThemeContext = undefined;
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
}
