import type {DrawingStyle} from '@mappable-world/mappable-types';
import type {MMapRuler, MMapRulerProps} from '@mappable-world/mappable-types/modules/ruler';
import {createMMapElement} from '../common/utils';
import markerDarkSVG from './icons/editor-point-dark.svg';
import markerLightSVG from './icons/editor-point-light.svg';
import './MMapDefaultRuler.css';
import {MMapDefaultRulerPoint} from './MMapDefaultRulerPoint';

const {MMapRuler: MMapRulerCore} = await mappable.import('@mappable-world/mappable-ruler');

const COLOR_LIGHT = '#313133';
const COLOR_DARK = '#C8FF80';

const FILL_LIGHT = '#122DB21A';
const FILL_DARK = '#C8FF8012';

export type MMapDefaultRulerProps = Pick<
    MMapRulerProps,
    'points' | 'zIndex' | 'editable' | 'onUpdate' | 'onUpdateEnd' | 'onUpdateStart' | 'source' | 'type'
>;
export class MMapDefaultRuler extends mappable.MMapComplexEntity<MMapDefaultRulerProps> {
    private _ruler!: MMapRuler;
    private _previewPoint: HTMLElement;

    constructor(props: MMapDefaultRulerProps) {
        super(props);
        this._previewPoint = createMMapElement('mappable--default-ruler-preview-point');
    }

    protected _onAttach(): void {
        this._ruler = new MMapRulerCore({
            ...this._props,
            point: (params) =>
                new MMapDefaultRulerPoint({
                    ...params,
                    onDeleteAllPoints: this._onDeleteAllPoints,
                    onFinish: this._onFinish
                }),
            geometry: {style: {}},
            previewPoint: this._previewPoint
        });
        this.addChild(this._ruler);

        this._watchContext(mappable.ThemeContext, this._updateTheme, {immediate: true});
    }

    protected _onUpdate(): void {
        this._ruler.update(this._props);
    }

    protected _onDetach(): void {
        this.removeChild(this._ruler);
    }

    private _updateTheme = () => {
        const themeCtx = this._consumeContext(mappable.ThemeContext);
        this._previewPoint.innerHTML = themeCtx?.theme === 'dark' ? markerDarkSVG : markerLightSVG;
        const fill = themeCtx?.theme === 'dark' ? FILL_DARK : FILL_LIGHT;
        const color = themeCtx?.theme === 'dark' ? COLOR_DARK : COLOR_LIGHT;
        const featureStyle: DrawingStyle = {simplificationRate: 0, fill, stroke: [{width: 2, color}]};
        this._ruler.update({geometry: {style: featureStyle}});
    };

    private _onDeleteAllPoints = () => {
        setTimeout(() => {
            this._ruler.update({points: []});
        });
    };
    private _onFinish = () => {
        this._ruler.update({editable: false});
    };
}
