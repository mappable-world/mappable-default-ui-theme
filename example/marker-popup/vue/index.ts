import {MarkerSizeProps} from '../../src';
import {CENTER, LOCATION} from '../common';

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
            MMapControls,
            MMapControlButton,
            MMapDefaultMarker
        },
        setup() {
            const size = Vue.ref<MarkerSizeProps>('normal');
            const refMap = (ref: any) => {
                window.map = ref?.entity;
            };
            const setNormalSize = () => (size.value = 'normal');
            const setSmallSize = () => (size.value = 'small');
            const setMicroSize = () => (size.value = 'micro');

            return {LOCATION, CENTER, size, refMap, setNormalSize, setSmallSize, setMicroSize};
        },
        template: `
            <MMap :location="LOCATION" :ref="refMap">
                <MMapDefaultSchemeLayer />
                <MMapDefaultFeaturesLayer />
                <MMapDefaultMarker :coordinates="CENTER" iconName="fallback" :size="size">
                    <template #popupContent>
                        <span>Marker popup</span>
                    </template>
                </MMapDefaultMarker>
                <MMapControls position="top left">
                    <MMapControlButton text="Normal" :onClick="setNormalSize" />
                    <MMapControlButton text="Small" :onClick="setSmallSize" />
                    <MMapControlButton text="Micro" :onClick="setMicroSize" />
                </MMapControls>
            </MMap>`
    });
    app.mount('#app');
}
