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
    {coordinates: [CENTER[0] - STEP, CENTER[1] + STEP / 2], size: 'normal'},
    {coordinates: [CENTER[0], CENTER[1] + STEP / 2]},
    {coordinates: [CENTER[0] + STEP, CENTER[1] + STEP / 2], size: 'micro'},
    // airport icon
    {
        iconName: 'fallback',
        coordinates: [CENTER[0] - STEP, CENTER[1] - STEP / 2],
        size: 'normal',
        title: 'Normal title',
        subtitle: 'Normal subtitle'
    },
    {
        iconName: 'fallback',
        coordinates: [CENTER[0], CENTER[1] - STEP / 2],
        title: 'Normal title',
        subtitle: 'Normal subtitle'
    },
    {
        iconName: 'fallback',
        coordinates: [CENTER[0] + STEP, CENTER[1] - STEP / 2],
        size: 'micro',
        title: 'Normal title',
        subtitle: 'Normal subtitle'
    },
    // color
    {color: 'steelblue', coordinates: [CENTER[0] - STEP, CENTER[1] + STEP], size: 'normal'},
    {color: 'steelblue', coordinates: [CENTER[0], CENTER[1] + STEP]},
    {color: 'steelblue', coordinates: [CENTER[0] + STEP, CENTER[1] + STEP], size: 'micro'},
    // color and icon
    {
        color: 'pink',
        iconName: 'attraction',
        coordinates: [CENTER[0] - STEP, CENTER[1] - STEP],
        size: 'normal',
        title: 'Overflow title Overflow title Overflow title Overflow title',
        subtitle: 'Overflow subtitle Overflow subtitle Overflow subtitle Overflow subtitle'
    },
    {
        color: 'pink',
        iconName: 'attraction',
        coordinates: [CENTER[0], CENTER[1] - STEP],
        title: 'Overflow title Overflow title Overflow title Overflow title',
        subtitle: 'Overflow subtitle Overflow subtitle Overflow subtitle Overflow subtitle'
    },
    {
        color: 'pink',
        iconName: 'attraction',
        coordinates: [CENTER[0] + STEP, CENTER[1] - STEP],
        size: 'micro',
        title: 'Overflow title Overflow title Overflow title Overflow title',
        subtitle: 'Overflow subtitle Overflow subtitle Overflow subtitle Overflow subtitle'
    },
    // new group
    {
        color: 'darksalmon',
        iconName: 'beach',
        coordinates: [CENTER[0] - STEP, CENTER[1] - STEP * 1.5],
        size: 'normal',
        title: 'Normal title'
    },
    {
        color: 'darksalmon',
        iconName: 'beach',
        coordinates: [CENTER[0], CENTER[1] - STEP * 1.5],
        title: 'Normal title'
    },
    {
        color: 'darksalmon',
        iconName: 'beach',
        coordinates: [CENTER[0] + STEP, CENTER[1] - STEP * 1.5],
        size: 'micro',
        title: 'Normal title'
    }
];
