import {RulerType} from '@mappable-world/mappable-types/modules/ruler';
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
            const rulerType = Vue.ref<RulerType>('ruler');

            const switchEditable = () => {
                editable.value = !editable.value;
            };
            const switchType = () => {
                rulerType.value = rulerType.value === 'ruler' ? 'planimeter' : 'ruler';
            };

            const onFinish = () => {
                editable.value = false;
            };
            return {LOCATION, RULER_COORDINATES, refMap, editable, rulerType, switchEditable, switchType, onFinish};
        },
        template: `
            <MMap :location="LOCATION" :showScaleInCopyrights="true" :ref="refMap">
                <MMapDefaultSchemeLayer />
                <MMapDefaultRuler :type="rulerType" :points="RULER_COORDINATES" :editable="editable" :onFinish="onFinish" />
                <MMapControls position="top right">
                    <MMapControlButton @click="switchEditable" text="Switch edit ruler" />
                </MMapControls>
                <MMapControls position="top left">
                    <MMapControlButton @click="switchType" text="Switch ruler type" />
                </MMapControls>
            </MMap>`
    });
    app.mount('#app');
}
main();
