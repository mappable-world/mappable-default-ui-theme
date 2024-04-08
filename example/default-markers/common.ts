import type {LngLat, LngLatBounds, MMapLocationRequest} from '@mappable-world/mappable-types';
import {MMapDefaultMarkerProps} from '../../src';

const BOUNDS: LngLatBounds = [
    [54.58311, 25.9985],
    [56.30248, 24.47889]
];

export const LOCATION: MMapLocationRequest = {bounds: BOUNDS};

const CENTER: LngLat = [(BOUNDS[0][0] + BOUNDS[1][0]) / 2, (BOUNDS[0][1] + BOUNDS[1][1]) / 2];
const STEP = 0.3;

export const MARKER_LOCATIONS: MMapDefaultMarkerProps[] = [
    // no icon markers
    {coordinates: [CENTER[0] - STEP, CENTER[1]], size: 'normal'},
    {coordinates: CENTER},
    {coordinates: [CENTER[0] + STEP, CENTER[1]], size: 'micro'},
    // airport icon
    {iconName: 'airport', coordinates: [CENTER[0] - STEP, CENTER[1] + STEP], size: 'normal'},
    {iconName: 'airport', coordinates: [CENTER[0], CENTER[1] + STEP]},
    {iconName: 'airport', coordinates: [CENTER[0] + STEP, CENTER[1] + STEP], size: 'micro'},
    // color icon
    {color: 'steelblue', coordinates: [CENTER[0] - STEP, CENTER[1] - STEP], size: 'normal'},
    {color: 'steelblue', coordinates: [CENTER[0], CENTER[1] - STEP]},
    {color: 'steelblue', coordinates: [CENTER[0] + STEP, CENTER[1] - STEP], size: 'micro'}
];
