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
            const positionLeftTop = () => (position.value = 'left top');
            const positionLeftBottom = () => (position.value = 'left bottom');
            const positionBottom = () => (position.value = 'bottom');
            const positionTop = () => (position.value = 'top');
            const positionRightTop = () => (position.value = 'right top');
            const positionRightBottom = () => (position.value = 'right bottom');
            const positionRight = () => (position.value = 'right');

            return {
                LOCATION,
                CENTER,
                TOOLTIP_TEXT,
                position,
                refMap,
                positionLeft,
                positionLeftTop,
                positionLeftBottom,
                positionBottom,
                positionTop,
                positionRightTop,
                positionRightBottom,
                positionRight
            };
        },
        template: `
            <MMap :location="LOCATION" :ref="refMap">
                <MMapDefaultSchemeLayer />
                <MMapDefaultFeaturesLayer />
                <MMapControls position="top right">
                    <MMapControlButton text="Left" :onClick="positionLeft" />
                    <MMapControlButton text="Left Top" :onClick="positionLeftTop" />
                    <MMapControlButton text="Left Bottom" :onClick="positionLeftBottom" />
                    <MMapControlButton text="Bottom" :onClick="positionBottom" />
                    <MMapControlButton text="Top" :onClick="positionTop" />
                    <MMapControlButton text="Right Top" :onClick="positionRightTop" />
                    <MMapControlButton text="Right Bottom" :onClick="positionRightBottom" />
                    <MMapControlButton text="Right" :onClick="positionRight" />
                </MMapControls>
                <MMapTooltipMarker :coordinates="CENTER" :draggable="true" :content="TOOLTIP_TEXT" :position="position" />
            </MMap>`
    });
    app.mount('#app');
}
