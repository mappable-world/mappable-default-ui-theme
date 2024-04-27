import {MMapTheme} from '@mappable-world/mappable-types';
import {LOCATION, MARKER_LOCATIONS} from '../common';

window.map = null;

main();
async function main() {
    const [mappableVue] = await Promise.all([mappable.import('@mappable-world/mappable-vuefy'), mappable.ready]);
    const vuefy = mappableVue.vuefy.bindTo(Vue);

    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls, MMapControlButton} =
        vuefy.module(mappable);

    const {MMapDefaultMarker} = vuefy.module(await mappable.import('@mappable-world/mappable-default-ui-theme'));

    const app = Vue.createApp({
        components: {
            MMap,
            MMapDefaultSchemeLayer,
            MMapDefaultFeaturesLayer,
            MMapDefaultMarker,
            MMapControls,
            MMapControlButton
        },
        setup() {
            const refMap = (ref: any) => {
                window.map = ref?.entity;
            };
            const theme = Vue.ref<MMapTheme>('light');

            const switchTheme = () => {
                theme.value = theme.value === 'light' ? 'dark' : 'light';
            };
            return {LOCATION, refMap, MARKER_LOCATIONS, theme, switchTheme};
        },
        template: `
            <MMap :location="LOCATION" :theme="theme" :ref="refMap">
                <MMapDefaultSchemeLayer />
                <MMapDefaultFeaturesLayer />
                <MMapControls position="top right">
                    <MMapControlButton text="Switch theme" :onClick="switchTheme" />
                </MMapControls>
                <MMapDefaultMarker v-for="(props, i) in MARKER_LOCATIONS" v-bind="props" :key="i" />
            </MMap>`
    });
    app.mount('#app');
}
