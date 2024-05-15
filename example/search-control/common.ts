import type {MMapLocationRequest, LngLatBounds, SearchResponse, Margin, Feature} from '@mappable-world/mappable-types';

mappable.ready.then(() => {
    mappable
        .getDefaultConfig()
        .setApikeys({search: 'pk_ZAROIlpukeMufiKGZFwyulaUQEXIjDySkgduDDiovkifzqXLsJweeFmxeoRwZNNc'});
});

const BOUNDS: LngLatBounds = [
    [54.58311, 25.9985],
    [56.30248, 24.47889]
];
export const LOCATION: MMapLocationRequest = {bounds: BOUNDS};
export const MARGIN: Margin = [30, 30, 30, 30];

export const initialMarkerProps = {
    properties: {
        name: 'Dubai',
        description: 'United Arab Emirates'
    },
    geometry: {
        type: 'Point',
        coordinates: [55.289311, 25.229762]
    }
} as Feature;

export const findSearchResultBoundsRange = (searchResult: SearchResponse) => {
    let minLng: number | null = null;
    let maxLng: number | null = null;
    let minLat: number | null = null;
    let maxLat: number | null = null;

    searchResult.forEach((searchResultElement) => {
        const [lng, lat] = searchResultElement.geometry.coordinates;

        if (lng < minLng || minLng === null) {
            minLng = lng;
        }

        if (lng > maxLng || maxLng === null) {
            maxLng = lng;
        }

        if (lat < minLat || minLat === null) {
            minLat = lat;
        }

        if (lat > maxLat || maxLat === null) {
            maxLat = lat;
        }
    });

    return [
        [minLng, maxLat],
        [maxLng, minLat]
    ] as LngLatBounds;
};
