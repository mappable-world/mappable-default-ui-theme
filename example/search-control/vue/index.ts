import type {Feature, SearchResponse} from '@mappable-world/mappable-types';
import {LOCATION, MARGIN, initialMarkerProps, findSearchResultBoundsRange} from '../common';

window.map = null;

main();
async function main() {
    const [mappableVue] = await Promise.all([mappable.import('@mappable-world/mappable-vuefy'), mappable.ready]);
    const vuefy = mappableVue.vuefy.bindTo(Vue);

    const {createApp, ref} = Vue;

    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls} = vuefy.module(mappable);

    const {MMapDefaultMarker} = vuefy.module(await mappable.import('@mappable-world/mappable-default-ui-theme'));
    const {MMapSearchControl} = vuefy.module(await mappable.import('@mappable-world/mappable-default-ui-theme'));

    const app = createApp({
        components: {
            MMap,
            MMapDefaultSchemeLayer,
            MMapDefaultFeaturesLayer,
            MMapControls,
            MMapDefaultMarker,
            MMapSearchControl
        },
        setup() {
            const refMap = (ref: any) => {
                window.map = ref?.entity;
            };

            const location = ref(LOCATION);

            const searchMarkersProps = ref([initialMarkerProps]);

            const updateMapLocation = (searchResult: SearchResponse) => {
                if (searchResult.length !== 0) {
                    let center;
                    let zoom;
                    let bounds;

                    if (searchResult.length === 1) {
                        center = searchResult[0].geometry?.coordinates;
                        zoom = 12;
                    } else {
                        bounds = findSearchResultBoundsRange(searchResult);
                    }

                    location.value = {
                        center,
                        zoom,
                        bounds,
                        duration: 400
                    };
                }
            };

            const searchResultHandler = (searchResult: SearchResponse) => {
                searchMarkersProps.value = searchResult;
                updateMapLocation(searchResult);
            };

            const onClickSearchMarkerHandler = (clickedMarker: Feature) => {
                searchMarkersProps.value = searchMarkersProps.value.filter((marker) => marker !== clickedMarker);
            };

            return {location, MARGIN, refMap, searchResultHandler, searchMarkersProps, onClickSearchMarkerHandler};
        },
        template: `
            <MMap :location="location" :margin="MARGIN" :ref="refMap">
                <MMapDefaultSchemeLayer />
                <MMapDefaultFeaturesLayer />
                <MMapControls position="top">
                    <MMapSearchControl :searchResult="searchResultHandler" />
                </MMapControls>

                <MMapDefaultMarker
                    v-for="marker in searchMarkersProps"
                    :key="marker.geometry.coordinates"
                    :title="marker.properties.name"
                    :subtitle="marker.properties.description"
                    :coordinates="marker.geometry.coordinates"
                    :onClick="()=>onClickSearchMarkerHandler(marker)"
                    size="normal"
                    iconName="fallback"
                />
            </MMap>`
    });
    app.mount('#app');
}
