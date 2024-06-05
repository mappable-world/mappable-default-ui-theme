import type {MMapLocationRequest, LngLatBounds, BehaviorType} from '@mappable-world/mappable-types';

const BOUNDS: LngLatBounds = [
    [54.58311, 25.9985],
    [56.30248, 24.47889]
];

export const LOCATION: MMapLocationRequest = {bounds: BOUNDS};
export const ENABLED_BEHAVIORS: BehaviorType[] = ['drag', 'scrollZoom', 'dblClick', 'mouseTilt', 'mouseRotate'];
