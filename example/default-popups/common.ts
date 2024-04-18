import type {LngLat, MMapLocationRequest} from '@mappable-world/mappable-types';

const CENTER: LngLat = [55.442795, 25.24107];
export const LOCATION: MMapLocationRequest = {center: CENTER, zoom: 14};

export const CUSTOM_POPUP_COORDS: LngLat = [CENTER[0] - 0.02, CENTER[1]];
export const DEFAULT_POPUP_COORDS: LngLat = [CENTER[0] + 0.02, CENTER[1]];
