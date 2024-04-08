import {LOCATION, MARKER_LOCATIONS} from '../common';

window.map = null;

main();
async function main() {
    const [mappableVue] = await Promise.all([mappable.import('@mappable-world/mappable-vuefy'), mappable.ready]);
    const vuefy = mappableVue.vuefy.bindTo(Vue);

    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer} = vuefy.module(mappable);

    const {MMapDefaultMarker} = vuefy.module(await mappable.import('@mappable-world/mappable-default-ui-theme'));

    const app = Vue.createApp({
        components: {
            MMap,
            MMapDefaultSchemeLayer,
            MMapDefaultFeaturesLayer,
            MMapDefaultMarker
        },
        setup() {
            const refMap = (ref) => {
                window.map = ref?.entity;
            };
            return {LOCATION, refMap, MARKER_LOCATIONS};
        },
        template: `
            <MMap :location="LOCATION" :ref="refMap">
                <MMapDefaultSchemeLayer />
                <MMapDefaultFeaturesLayer />
                <MMapDefaultMarker v-for="(props, i) in MARKER_LOCATIONS" v-bind="props" :key="i" />
            </MMap>`
    });
    app.mount('#app');
}
