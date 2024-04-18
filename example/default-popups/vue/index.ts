import {CUSTOM_POPUP_COORDS, DEFAULT_POPUP_COORDS, LOCATION} from '../common';

window.map = null;

main();
async function main() {
    const [mappableVue] = await Promise.all([mappable.import('@mappable-world/mappable-vuefy'), mappable.ready]);
    const vuefy = mappableVue.vuefy.bindTo(Vue);

    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls, MMapControlButton} =
        vuefy.module(mappable);

    const {MMapBalloonMarker, MMapDefaultPopupMarker} = vuefy.module(
        await mappable.import('@mappable-world/mappable-default-ui-theme')
    );

    const app = Vue.createApp({
        components: {
            MMap,
            MMapDefaultSchemeLayer,
            MMapDefaultFeaturesLayer,
            MMapControls,
            MMapControlButton,
            MMapBalloonMarker,
            MMapDefaultPopupMarker
        },
        setup() {
            const location = Vue.ref(LOCATION);
            const showDefaultPopup = Vue.ref(true);
            const showCustomPopup = Vue.ref(true);
            const refMap = (ref: any) => {
                window.map = ref?.entity;
            };

            const toggleDefaultPopup = () => (showDefaultPopup.value = !showDefaultPopup.value);
            const toggleCustomPopup = () => (showCustomPopup.value = !showCustomPopup.value);
            const actionCallback = () => alert('Click on action button!');
            const onCloseCustomPopup = () => (showCustomPopup.value = false);
            const onCloseDefaultPopup = () => (showDefaultPopup.value = false);

            return {
                location,
                refMap,
                toggleCustomPopup,
                toggleDefaultPopup,
                onCloseCustomPopup,
                onCloseDefaultPopup,
                actionCallback,
                showCustomPopup,
                showDefaultPopup,
                CUSTOM_POPUP_COORDS,
                DEFAULT_POPUP_COORDS
            };
        },
        template: `
            <MMap :location="location" :ref="refMap">
                <MMapDefaultSchemeLayer />
                <MMapDefaultFeaturesLayer />
                <MMapControls position="top right">
                    <MMapControlButton text="Toggle custom popup" :onClick="toggleCustomPopup" />
                    <MMapControlButton text="Toggle default popup" :onClick="toggleDefaultPopup" />
                </MMapControls>
                <MMapBalloonMarker :show="showCustomPopup" :coordinates="CUSTOM_POPUP_COORDS">
                    <template #content>
                        <div class="custom-popup">
                            <div class="title">Title</div>
                            <button :onClick="onCloseCustomPopup">close</button>
                            <div class="content">Custom popup content</div>
                        </div>
                    </template>
                </MMapBalloonMarker>
                <MMapDefaultPopupMarker
                    :show="showDefaultPopup"
                    :coordinates="DEFAULT_POPUP_COORDS"
                    title="Default popup marker"
                    description="Description for default popup"
                    action="Make an action"
                    :onAction="actionCallback"
                    :onClose="onCloseDefaultPopup"
                />
            </MMap>`
    });
    app.mount('#app');
}
