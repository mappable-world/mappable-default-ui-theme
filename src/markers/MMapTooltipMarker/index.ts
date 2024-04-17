import {MMapBalloonMarker, MMapBalloonMarkerProps} from '../MMapBalloonMarker';
import {MMapTooltipMarkerVuefyOptions} from './vue';
import './index.css';

export type MMapTooltipMarkerProps = Omit<MMapBalloonMarkerProps, 'content' | 'show' | 'onClose' | 'onOpen'> & {
    /** The text content that the tooltip will display */
    content: string;
};
/**
 * `MMapTooltipMarker` is a default tooltip - a text popup with no ability to close.
 * @example
 * ```js
 * const tooltip = new MMapTooltipMarker({
 *  content:'Default tooltip',
 *  // support MMapMarker props
 *  coordinates: TOOLTIP_COORD,
 *  draggable: true,
 *  // support MMapBalloonMarker props
 *  position: 'top',
 * });
 * map.addChild(tooltip);
 * ```
 */
export class MMapTooltipMarker extends mappable.MMapComplexEntity<MMapTooltipMarkerProps> {
    static [mappable.optionsKeyVuefy] = MMapTooltipMarkerVuefyOptions;
    private _balloon: MMapBalloonMarker;
    private _element: HTMLElement;

    protected _onAttach(): void {
        this._balloon = new MMapBalloonMarker({...this._props, content: this.__createTooltip});
        this.addChild(this._balloon);
    }

    protected _onUpdate(propsDiff: Partial<MMapTooltipMarkerProps>): void {
        if (propsDiff.content !== undefined) {
            this._element.textContent = this._props.content;
        }
        const {content, ...propsWithoutContent} = this._props;
        this._balloon.update({...propsWithoutContent});
    }

    private __createTooltip = (): HTMLElement => {
        this._element = document.createElement('mappable');
        this._element.classList.add('mappable--default-tooltip');
        this._element.textContent = this._props.content;
        return this._element;
    };
}
