import {MMapPopupMarker, MMapPopupMarkerProps} from '../MMapPopupMarker';
import './index.css';
import {MMapTextPopupMarkerVuefyOptions} from './vue';

export type MMapTextPopupMarkerProps = Omit<MMapPopupMarkerProps, 'content' | 'show' | 'onClose' | 'onOpen'> & {
    /** The text content that the popup will display */
    content: string;
};
/**
 * `MMapTextPopupMarker` - a text popup with no ability to close.
 * @example
 * ```js
 * const popup = new MMapTextPopupMarker({
 *  content:'Text popup',
 *  // support MMapMarker props
 *  coordinates: POPUP_COORD,
 *  draggable: true,
 *  // support MMapPopupMarker props
 *  position: 'top',
 * });
 * map.addChild(popup);
 * ```
 */
export class MMapTextPopupMarker extends mappable.MMapComplexEntity<MMapTextPopupMarkerProps> {
    static [mappable.optionsKeyVuefy] = MMapTextPopupMarkerVuefyOptions;
    private _popup: MMapPopupMarker;
    private _element: HTMLElement;

    protected _onAttach(): void {
        this._popup = new MMapPopupMarker({...this._props, content: this.__createTextPopup});
        this.addChild(this._popup);
    }

    protected _onUpdate(propsDiff: Partial<MMapTextPopupMarkerProps>): void {
        if (propsDiff.content !== undefined) {
            this._element.textContent = this._props.content;
        }
        const {content, ...propsWithoutContent} = this._props;
        this._popup.update({...propsWithoutContent});
    }

    private __createTextPopup = (): HTMLElement => {
        this._element = document.createElement('mappable');
        this._element.classList.add('mappable--default-text-popup');
        this._element.textContent = this._props.content;
        return this._element;
    };
}
