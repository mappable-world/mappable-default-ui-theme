import {MMapMarker, MMapMarkerProps} from '@mappable-world/mappable-types';
import {MMapMarkerVuefyOptions} from './vue';

import './index.css';
import tailSVG from './tail.svg';

type VerticalPosition = 'top' | 'bottom';
type HorizontalPosition = 'left' | 'right';
export type MMapTooltipPositionProps = VerticalPosition | HorizontalPosition;

export type MMapTooltipMarkerProps = MMapMarkerProps & {
    text: string;
    position?: MMapTooltipPositionProps;
};

const defaultProps = Object.freeze({position: 'top'});
type DefaultProps = typeof defaultProps;

export class MMapTooltipMarker extends mappable.MMapComplexEntity<MMapTooltipMarkerProps, DefaultProps> {
    static defaultProps = defaultProps;
    static [mappable.optionsKeyVuefy] = MMapMarkerVuefyOptions;

    private _markerElement: HTMLElement;
    private _tooltipContainer: HTMLElement;
    private _tooltipTail: HTMLElement;
    private _marker: MMapMarker;

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

        this._updateElementPosition();

        this._markerElement.appendChild(this._tooltipContainer);
        this._markerElement.appendChild(this._tooltipTail);

        this._marker = new mappable.MMapMarker(this._props, this._markerElement);
        this.addChild(this._marker);
    }

    protected _onUpdate(propsDiff: Partial<MMapTooltipMarkerProps>): void {
        if (propsDiff.position !== undefined) {
            this._updateElementPosition();
        }

        if (propsDiff.text !== undefined) {
            this._tooltipContainer.textContent = this._props.text;
        }

        this._marker.update(this._props);
    }

    private _updateElementPosition() {
        const {position} = this._props;

        // check top position
        this._markerElement.classList.toggle('position-top', position === 'top');

        // check bottom position
        this._markerElement.classList.toggle('position-bottom', position === 'bottom');

        // check left position
        this._markerElement.classList.toggle('position-left', position === 'left');

        // check right position
        this._markerElement.classList.toggle('position-right', position === 'right');
    }
}
