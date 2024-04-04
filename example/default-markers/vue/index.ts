import {LOCATION, MARKER_LOCATION} from '../common';

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
            return {LOCATION, refMap, MARKER_LOCATION};
        },
        template: `
            <MMap :location="LOCATION" :ref="refMap">
                <MMapDefaultSchemeLayer />
                <MMapDefaultFeaturesLayer />
                <MMapDefaultMarker iconName="building" color="bluebell" :coordinates="MARKER_LOCATION"/>
            </MMap>`
    });
    app.mount('#app');
}
