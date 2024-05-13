import type {MMapPopupPositionProps} from '../../src';
import {ACTION, CUSTOM_POPUP_COORDS, DESCRIPTION, LOCATION, POPUP_TEXT, TEXT_POPUP_COORDS, TITLE} from '../common';

window.map = null;

main();
async function main() {
    const [mappableVue] = await Promise.all([mappable.import('@mappable-world/mappable-vuefy'), mappable.ready]);
    const vuefy = mappableVue.vuefy.bindTo(Vue);

    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls, MMapControlButton} =
        vuefy.module(mappable);

    const {MMapPopupMarker} = vuefy.module(await mappable.import('@mappable-world/mappable-default-ui-theme'));

    const app = Vue.createApp({
        components: {
            MMap,
            MMapDefaultSchemeLayer,
            MMapDefaultFeaturesLayer,
            MMapControls,
            MMapControlButton,
            MMapPopupMarker
        },
        setup() {
            const refMap = (ref: any) => {
                window.map = ref?.entity;
            };
            const position = Vue.ref<MMapPopupPositionProps>(undefined);
            const showCustom = Vue.ref(true);

            const positionLeft = () => (position.value = 'left');
            const positionLeftTop = () => (position.value = 'left top');
            const positionLeftBottom = () => (position.value = 'left bottom');
            const positionBottom = () => (position.value = 'bottom');
            const positionTop = () => (position.value = 'top');
            const positionRightTop = () => (position.value = 'right top');
            const positionRightBottom = () => (position.value = 'right bottom');
            const positionRight = () => (position.value = 'right');

            const customPopupAction = () => {
                alert('Click on action button!');
            };

            return {
                ACTION,
                CUSTOM_POPUP_COORDS,
                DESCRIPTION,
                LOCATION,
                POPUP_TEXT,
                TEXT_POPUP_COORDS,
                TITLE,
                position,
                showCustom,
                refMap,
                positionLeft,
                positionLeftTop,
                positionLeftBottom,
                positionBottom,
                positionTop,
                positionRightTop,
                positionRightBottom,
                positionRight,
                customPopupAction
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

                <MMapPopupMarker :coordinates="TEXT_POPUP_COORDS" :draggable="true" :position="position">
                    <template #content>
                        {{POPUP_TEXT}}
                    </template>
                </MMapPopupMarker>

                <MMapPopupMarker :coordinates="CUSTOM_POPUP_COORDS" :draggable="true" :position="position" :show="showCustom">
                    <template #content>
                        <span class="popup">
                            <span class="header">
                                <span class="header_title">{{TITLE}}</span>
                                <button class="header_close" @click="showCustom=false"></button>
                            </span>
                            <span class="description">{{DESCRIPTION}}</span>
                            <button class="action" @click="customPopupAction">
                                {{ACTION}}
                            </button>
                        </span>
                    </template>
                </MMapPopupMarker>
            </MMap>`
    });
    app.mount('#app');
}
