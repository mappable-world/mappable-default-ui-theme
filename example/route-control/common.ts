import type {
    LngLat,
    LngLatBounds,
    MMapCenterLocation,
    MMapZoomLocation,
    Margin,
    RouteOptions,
    Stroke,
    TruckParameters
} from '@mappable-world/mappable-types';

mappable.ready.then(() => {
    mappable.getDefaultConfig().setApikeys({
        search: '%APIKEY%',
        suggest: '%APIKEY%'
    });
});

export const LOCATION: MMapCenterLocation & MMapZoomLocation = {center: [55.274247, 25.197303], zoom: 12};

export const TRUCK_PARAMS: TruckParameters = {
    weight: 40,
    maxWeight: 40,
    axleWeight: 10,
    payload: 20,
    height: 4,
    width: 2.5,
    length: 16,
    ecoClass: 4,
    hasTrailer: true
};
export const MARGIN: Margin = [10, 10, 10, 10];
export const FROM_POINT_STYLE = Object.freeze({
    size: 'normal',
    color: {day: '#2E4CE5', night: '#D6FD63'},
    iconName: 'fallback'
});
export const TO_POINT_STYLE = Object.freeze({
    size: 'normal',
    color: {day: '#313133', night: '#C8D2E6'},
    iconName: 'fallback'
});
export const PREVIEW_POINT_STYLE = Object.freeze({
    size: 'normal',
    color: {day: '#2E4CE580', night: '#D6FD6380'},
    iconName: 'fallback'
});

export function computeBoundsForPoints(points: LngLat[]): LngLatBounds {
    const bounds = {maxX: points[0][0], minX: points[0][0], maxY: points[0][1], minY: points[0][1]};

    for (let i = 1; i < points.length; ++i) {
        const [x, y] = points[i];

        if (x < bounds.minX) {
            bounds.minX = x;
        }
        if (x > bounds.maxX) {
            bounds.maxX = x;
        }
        if (y < bounds.minY) {
            bounds.minY = y;
        }
        if (y > bounds.maxY) {
            bounds.maxY = y;
        }
    }

    return [
        [bounds.minX, bounds.minY],
        [bounds.maxX, bounds.maxY]
    ];
}

export const getStroke = (type: RouteOptions['type']): Stroke => {
    if (type === 'walking') {
        return [
            {width: 4, color: '#7D90F0', dash: [4, 8]},
            {width: 8, color: '#ffffff'}
        ];
    }
    return [
        {width: 6, color: '#34D9AD'},
        {width: 8, color: '#050D3366'}
    ];
};
