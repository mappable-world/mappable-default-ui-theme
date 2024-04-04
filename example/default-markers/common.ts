import type {MMapLocationRequest, LngLatBounds, LngLat} from '@mappable-world/mappable-types';

const BOUNDS: LngLatBounds = [
    [54.58311, 25.9985],
    [56.30248, 24.47889]
];

export const LOCATION: MMapLocationRequest = {bounds: BOUNDS};
export const MARKER_LOCATION: LngLat = [(BOUNDS[0][0] + BOUNDS[1][0]) / 2, (BOUNDS[0][1] + BOUNDS[1][1]) / 2];
