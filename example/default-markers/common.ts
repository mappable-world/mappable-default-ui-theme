import type {LngLat, LngLatBounds, MMapLocationRequest} from '@mappable-world/mappable-types';
import {MMapDefaultMarkerProps} from '../../src';

const BOUNDS: LngLatBounds = [
    [54.58311, 25.9985],
    [56.30248, 24.47889]
];

export const LOCATION: MMapLocationRequest = {bounds: BOUNDS};

const CENTER: LngLat = [(BOUNDS[0][0] + BOUNDS[1][0]) / 2, (BOUNDS[0][1] + BOUNDS[1][1]) / 2];
const STEP = 0.3;

const getCoordinates = (row: number, col: number): LngLat => [CENTER[0] + row * STEP, CENTER[1] + col * STEP];

export const MARKER_LOCATIONS: MMapDefaultMarkerProps[] = [
    // default marker
    {coordinates: getCoordinates(-3, 0.5), size: 'normal'},
    {coordinates: getCoordinates(-3, 0), size: 'small'},
    {coordinates: getCoordinates(-3, -0.5), size: 'micro'},
    // fallback color marker
    {coordinates: getCoordinates(-2, 0.5), size: 'normal', color: 'bluebell',iconName:'fallback'},
    {coordinates: getCoordinates(-2, 0), size: 'small', color: 'bluebell',iconName:'fallback'},
    {coordinates: getCoordinates(-2, -0.5), size: 'micro', color: 'bluebell',iconName:'fallback'},
    // color icon marker
    {coordinates: getCoordinates(-1, 0.5), size: 'normal', color: 'ceil', iconName: 'attraction'},
    {coordinates: getCoordinates(-1, 0), size: 'small', color: 'ceil', iconName: 'attraction'},
    {coordinates: getCoordinates(-1, -0.5), size: 'micro', color: 'ceil', iconName: 'attraction'},
    // title hint
    {coordinates: getCoordinates(0, 0.5), size: 'normal', color: 'darksalmon', iconName: 'restaurants',title:'Normal title'},
    {coordinates: getCoordinates(0, 0), size: 'small', color: 'darksalmon', iconName: 'restaurants',title:'Normal title'},
    {coordinates: getCoordinates(0, -0.5), size: 'micro', color: 'darksalmon', iconName: 'restaurants',title:'Normal title'},
    // title subtitle hint
    {coordinates: getCoordinates(1, 0.5), size: 'normal', color: 'green', iconName: 'beach',title:'Normal title',subtitle:'Normal subtitle'},
    {coordinates: getCoordinates(1, 0), size: 'small', color: 'green', iconName: 'beach',title:'Normal title',subtitle:'Normal subtitle'},
    {coordinates: getCoordinates(1, -0.5), size: 'micro', color: 'green', iconName: 'beach',title:'Normal title',subtitle:'Normal subtitle'},
    // hover hint
    {coordinates: getCoordinates(2, 0.5), size: 'normal', color: "pink", iconName: 'medicine',title:'Hover title',subtitle:'Hover subtitle',staticHint:false,},
    {coordinates: getCoordinates(2, 0), size: 'small', color: "pink", iconName: 'medicine',title:'Hover title',subtitle:'Hover subtitle',staticHint:false,},
    {coordinates: getCoordinates(2, -0.5), size: 'micro', color: "pink", iconName: 'medicine',title:'Hover title',subtitle:'Hover subtitle',staticHint:false,},
    // overflow hint
    {coordinates: getCoordinates(3, 0.5), size: 'normal', color: "orchid", iconName: 'auto',title:'Overflow title Overflow title',subtitle:'Overflow subtitle Overflow subtitle'},
    {coordinates: getCoordinates(3, 0), size: 'small', color: "orchid", iconName: 'auto',title:'Overflow title Overflow title',subtitle:'Overflow subtitle Overflow subtitle'},
    {coordinates: getCoordinates(3, -0.5), size: 'micro', color: "orchid", iconName: 'auto',title:'Overflow title Overflow title',subtitle:'Overflow subtitle Overflow subtitle'},
];
