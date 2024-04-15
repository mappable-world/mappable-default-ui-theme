import {MMapTooltipMarkerProps} from '../../src';
import {CENTER, LOCATION, TOOLTIP_TEXT} from '../common';

window.map = null;

main();
async function main() {
    const [mappableVue] = await Promise.all([mappable.import('@mappable-world/mappable-vuefy'), mappable.ready]);
    const vuefy = mappableVue.vuefy.bindTo(Vue);

    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls, MMapControlButton} =
        vuefy.module(mappable);

    const {MMapTooltipMarker} = vuefy.module(await mappable.import('@mappable-world/mappable-default-ui-theme'));

    const app = Vue.createApp({
        components: {
            MMap,
            MMapDefaultSchemeLayer,
            MMapDefaultFeaturesLayer,
            MMapControls,
            MMapControlButton,
            MMapTooltipMarker
        },
        setup() {
            const refMap = (ref: any) => {
                window.map = ref?.entity;
            };
            const position = Vue.ref<MMapTooltipMarkerProps['position']>(undefined);

            const positionLeft = () => (position.value = 'left');
            const positionBottom = () => (position.value = 'bottom');
            const positionTop = () => (position.value = 'top');
            const positionRight = () => (position.value = 'right');

            return {
                LOCATION,
                CENTER,
                TOOLTIP_TEXT,
                position,
                refMap,
                positionLeft,
                positionBottom,
                positionTop,
                positionRight
            };
        },
        template: `
            <MMap :location="LOCATION" :ref="refMap">
                <MMapDefaultSchemeLayer />
                <MMapDefaultFeaturesLayer />
                <MMapControls position="top right">
                    <MMapControlButton text="Left" :onClick="positionLeft" />
                    <MMapControlButton text="Bottom" :onClick="positionBottom" />
                    <MMapControlButton text="Top" :onClick="positionTop" />
                    <MMapControlButton text="Right" :onClick="positionRight" />
                </MMapControls>
                <MMapTooltipMarker :coordinates="CENTER" :draggable="true" :text="TOOLTIP_TEXT" :position="position" />
            </MMap>`
    });
    app.mount('#app');
}
