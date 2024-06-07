import {ENABLED_BEHAVIORS, LOCATION} from '../common';

window.map = null;

main();
async function main() {
    const [mappableVue] = await Promise.all([mappable.import('@mappable-world/mappable-vuefy'), mappable.ready]);
    const vuefy = mappableVue.vuefy.bindTo(Vue);

    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls} = vuefy.module(mappable);

    const {MMapGeolocationControl, MMapRotateControl, MMapRotateTiltControl, MMapTiltControl, MMapZoomControl} =
        vuefy.module(await mappable.import('@mappable-world/mappable-default-ui-theme'));

    const app = Vue.createApp({
        components: {
            MMap,
            MMapDefaultSchemeLayer,
            MMapDefaultFeaturesLayer,
            MMapControls,
            MMapGeolocationControl,
            MMapRotateControl,
            MMapRotateTiltControl,
            MMapTiltControl,
            MMapZoomControl
        },
        setup() {
            const refMap = (ref: any) => {
                window.map = ref?.entity;
            };
            return {LOCATION, ENABLED_BEHAVIORS, refMap};
        },
        template: `
            <MMap :location="LOCATION" :behaviors="ENABLED_BEHAVIORS" :ref="refMap">
                <MMapDefaultSchemeLayer />
                <MMapDefaultFeaturesLayer />
                <MMapControls position="left">
                    <MMapZoomControl />
                    <MMapGeolocationControl />
                </MMapControls>
                <MMapControls position="bottom">
                    <MMapZoomControl />
                </MMapControls>
                <MMapControls position="right">
                    <MMapRotateTiltControl />
                    <MMapRotateControl />
                    <MMapTiltControl />
                </MMapControls>
            </MMap>`
    });
    app.mount('#app');
}
