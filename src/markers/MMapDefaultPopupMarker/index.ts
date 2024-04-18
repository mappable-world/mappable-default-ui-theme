import {MMapBalloonContentProps, MMapBalloonMarker, MMapBalloonMarkerProps} from '../MMapBalloonMarker';
import {MMapDefaultPopupMarkerVuefyOptions} from './vue';

import closeSVG from './close.svg';
import './index.css';

export type MMapDefaultPopupMarkerProps = Omit<MMapBalloonMarkerProps, 'content'> & {
    /** Displayed title in popup header */
    title?: string;
    /** Displayed description */
    description?: string;
    /** The inscription on the action button */
    action?: string;
    /** Callback of click the action button */
    onAction?: () => void;
};
/**
 * `MMapDefaultPopupMarker` is a default popup that contains a title, a description, and an action button.
 * @example
 * ```js
 * const defaultPopup = new MMapDefaultPopupMarker({
 *  title: 'Default title',
 *  description: 'Default description',
 *  action: 'Make action',
 *  // support MMapMarker props
 *  coordinates: POPUP_COORD,
 *  draggable: true,
 *  // support MMapBalloonMarker props
 *  position: 'top',
 * });
 * map.addChild(defaultPopup);
 * ```
 */
export class MMapDefaultPopupMarker extends mappable.MMapComplexEntity<MMapDefaultPopupMarkerProps> {
    static [mappable.optionsKeyVuefy] = MMapDefaultPopupMarkerVuefyOptions;
    private _balloon: MMapBalloonMarker;
    private _element: HTMLElement;

    public get isOpen() {
        return this._balloon.isOpen;
    }

    protected _onAttach(): void {
        const {title, description, action} = this._props;

        if (title === undefined && description === undefined && action === undefined) {
            throw new Error(
                'There is no content to display. Specify one of the parameters: title, description, action'
            );
        }

        this._balloon = new MMapBalloonMarker({
            ...this._props,
            content: this.__createDefaultPopup,
            onClose: () => {
                this._props.show = false;
                this._props.onClose?.();
            },
            onOpen: () => {
                this._props.show = true;
                this._props.onOpen?.();
            }
        });
        this.addChild(this._balloon);

        this._watchContext(mappable.ThemeContext, () => this._updateTheme(), {immediate: true});
    }

    protected _onUpdate(propsDiff: Partial<MMapDefaultPopupMarkerProps>, oldProps: MMapDefaultPopupMarkerProps): void {
        const {title, description, action} = this._props;

        const isTitleChange = oldProps.title !== title;
        const isDescriptionChange = oldProps.description !== description;
        const isActionChange = oldProps.action !== action;

        if (isTitleChange || isDescriptionChange || isActionChange) {
            this._balloon.update({content: () => this.__createDefaultPopup()});
        }

        this._balloon.update(this._props);
    }

    private _updateTheme() {
        const themeCtx = this._consumeContext(mappable.ThemeContext);
        this._element.classList.toggle('mappable--default-popup__dark', themeCtx.theme === 'dark');
    }

    private __createDefaultPopup: MMapBalloonContentProps = () => {
        const {title, description, action} = this._props;
        this._element = document.createElement('mappable');
        this._element.classList.add('mappable--default-popup');

        const popupHeaderElement = document.createElement('mappable');
        popupHeaderElement.classList.add('mappable--default-popup_header');
        this._element.appendChild(popupHeaderElement);

        if (title) {
            const titleElement = document.createElement('mappable');
            titleElement.classList.add('mappable--default-popup_header_title');
            titleElement.textContent = title;
            popupHeaderElement.appendChild(titleElement);
        }

        const closeButton = document.createElement('button');
        closeButton.classList.add('mappable--default-popup_header_close');
        closeButton.innerHTML = closeSVG;
        closeButton.addEventListener('click', () => this._balloon.update({show: false}));
        popupHeaderElement.appendChild(closeButton);

        if (description) {
            const descriptionElement = document.createElement('mappable');
            descriptionElement.classList.add('mappable--default-popup_description');
            descriptionElement.textContent = description;
            this._element.appendChild(descriptionElement);
        }
        if (action) {
            const actionButton = document.createElement('button');
            actionButton.classList.add('mappable--default-popup_action');
            actionButton.textContent = action;
            actionButton.addEventListener('click', () => {
                this._props.onAction?.();
            });
            this._element.appendChild(actionButton);
        }

        return this._element;
    };
}
