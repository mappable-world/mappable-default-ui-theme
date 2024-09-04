import {LOCATION, RULER_COORDINATES} from '../common';

window.map = null;

async function main() {
    // For each object in the JS API, there is a Vue counterpart
    // To use the Vue version of the API, include the module @mappable-world/mappable-vuefy
    const [mappableVue] = await Promise.all([mappable.import('@mappable-world/mappable-vuefy'), mappable.ready]);
    const vuefy = mappableVue.vuefy.bindTo(Vue);
    const {MMap, MMapDefaultSchemeLayer, MMapControls, MMapControlButton} = vuefy.module(mappable);
    const {MMapDefaultRuler} = vuefy.module(await mappable.import('@mappable-world/mappable-default-ui-theme'));

    const app = Vue.createApp({
        components: {MMap, MMapDefaultSchemeLayer, MMapControls, MMapControlButton, MMapDefaultRuler},
        setup() {
            const refMap = (ref) => {
                window.map = ref?.entity;
            };
            const editable = Vue.ref(true);

            const switchEditable = () => {
                editable.value = !editable.value;
            };

            const onFinish = () => {
                editable.value = false;
            };
            return {LOCATION, RULER_COORDINATES, refMap, editable, switchEditable, onFinish};
        },
        template: `
            <MMap :location="LOCATION" :showScaleInCopyrights="true" :ref="refMap">
                <MMapDefaultSchemeLayer />
                <MMapDefaultRuler type="ruler" :points="RULER_COORDINATES" :editable="editable" :onFinish="onFinish" />
                <MMapControls position="top right">
                    <MMapControlButton @click="switchEditable" text="Switch edit ruler" />
                </MMapControls>
            </MMap>`
    });
    app.mount('#app');
}
main();
