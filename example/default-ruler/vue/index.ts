import {LOCATION, RULER_COORDINATES} from '../common';

window.map = null;

async function main() {
    // For each object in the JS API, there is a Vue counterpart
    // To use the Vue version of the API, include the module @mappable-world/mappable-vuefy
    const [mappableVue] = await Promise.all([mappable.import('@mappable-world/mappable-vuefy'), mappable.ready]);
    const vuefy = mappableVue.vuefy.bindTo(Vue);
    const {MMap, MMapDefaultSchemeLayer, MMapControls} = vuefy.module(mappable);
    const {MMapDefaultRuler} = vuefy.module(await mappable.import('@mappable-world/mappable-default-ui-theme'));

    const app = Vue.createApp({
        components: {MMap, MMapDefaultSchemeLayer, MMapControls, MMapDefaultRuler},
        setup() {
            const refMap = (ref) => {
                window.map = ref?.entity;
            };
            return {LOCATION, RULER_COORDINATES, refMap};
        },
        template: `
            <MMap :location="LOCATION" :showScaleInCopyrights="true" :ref="refMap">
                <MMapDefaultSchemeLayer />
                <MMapDefaultRuler type="ruler" :points="RULER_COORDINATES" />
            </MMap>`
    });
    app.mount('#app');
}
main();
