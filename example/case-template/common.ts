import type {LngLat, LngLatBounds, MMapLocationRequest} from '@mappable-world/mappable-types';

const BOUNDS: LngLatBounds = [
    [54.58311, 25.9985],
    [56.30248, 24.47889]
];
export const CENTER: LngLat = [55.44279, 25.24107];

export const LOCATION: MMapLocationRequest = {bounds: BOUNDS};
