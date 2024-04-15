import {MMapMarker, MMapMarkerProps} from '@mappable-world/mappable-types';
import {MMapTooltipMarkerVuefyOptions} from './vue';

import './index.css';
import tailSVG from './tail.svg';

type VerticalPosition = 'top' | 'bottom';
type HorizontalPosition = 'left' | 'right';
export type MMapTooltipPositionProps =
    | VerticalPosition
    | HorizontalPosition
    | `${VerticalPosition} ${HorizontalPosition}`
    | `${HorizontalPosition} ${VerticalPosition}`;

export type MMapTooltipMarkerProps = MMapMarkerProps & {
    text: string;
    position?: MMapTooltipPositionProps;
    offset?: number;
};

const defaultProps = Object.freeze({position: 'top', offset: 0});
type DefaultProps = typeof defaultProps;

export class MMapTooltipMarker extends mappable.MMapComplexEntity<MMapTooltipMarkerProps, DefaultProps> {
    static defaultProps = defaultProps;
    static [mappable.optionsKeyVuefy] = MMapTooltipMarkerVuefyOptions;

    private _markerElement: HTMLElement;
    private _tooltipContainer: HTMLElement;
    private _tooltipTail: HTMLElement;
    private _marker: MMapMarker;

    private _unwatchThemeContext?: () => void;

    protected __implGetDefaultProps(): DefaultProps {
        return MMapTooltipMarker.defaultProps;
    }

    protected _onAttach(): void {
        this._markerElement = document.createElement('mappable');
        this._markerElement.classList.add('mappable--tooltip-marker');

        this._tooltipContainer = document.createElement('mappable');
        this._tooltipContainer.classList.add('mappable--tooltip-marker_container');
        this._tooltipContainer.textContent = this._props.text;

        this._tooltipTail = document.createElement('mappable');
        this._tooltipTail.classList.add('mappable--tooltip-marker_tail');
        this._tooltipTail.innerHTML = tailSVG;

        this._updatePosition();
        this._updateOffset();

        this._markerElement.appendChild(this._tooltipContainer);
        this._markerElement.appendChild(this._tooltipTail);

        this._marker = new mappable.MMapMarker(this._props, this._markerElement);
        this.addChild(this._marker);

        this._unwatchThemeContext = this._watchContext(mappable.ThemeContext, () => this._updateTheme(), {
            immediate: true
        });
    }

    protected _onUpdate(propsDiff: Partial<MMapTooltipMarkerProps>): void {
        if (propsDiff.position !== undefined) {
            this._updatePosition();
        }
        if (propsDiff.offset !== undefined) {
            this._updateOffset();
        }

        if (propsDiff.text !== undefined) {
            this._tooltipContainer.textContent = this._props.text;
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
        this._tooltipContainer.classList.toggle('mappable--tooltip__dark', theme === 'dark');
        this._tooltipTail.classList.toggle('mappable--tooltip__dark', theme === 'dark');
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
