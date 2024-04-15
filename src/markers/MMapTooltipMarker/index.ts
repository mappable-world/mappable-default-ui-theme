import {MMapBalloonMarker, MMapBalloonMarkerProps} from '../MMapBalloonMarker';
import {MMapTooltipMarkerVuefyOptions} from './vue';

export type MMapTooltipMarkerProps = Omit<MMapBalloonMarkerProps, 'content'> & {content: string};
export class MMapTooltipMarker extends mappable.MMapComplexEntity<MMapTooltipMarkerProps> {
    static [mappable.optionsKeyVuefy] = MMapTooltipMarkerVuefyOptions;
    private _balloon: MMapBalloonMarker;

    protected _onAttach(): void {
        this._balloon = new MMapBalloonMarker(this._props);
        this.addChild(this._balloon);
    }

    protected _onUpdate(): void {
        this._balloon.update(this._props);
    }
}
