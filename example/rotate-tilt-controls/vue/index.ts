import {ENABLED_BEHAVIORS, LOCATION} from '../common';

window.map = null;

main();
async function main() {
    const [mappableVue] = await Promise.all([mappable.import('@mappable-world/mappable-vuefy'), mappable.ready]);
    const vuefy = mappableVue.vuefy.bindTo(Vue);
    const {MMap, MMapControls, MMapDefaultSchemeLayer} = vuefy.module(mappable);
    const {MMapRotateTiltControl, MMapTiltControl, MMapRotateControl, MMapZoomControl} = vuefy.module(
        await mappable.import('@mappable-world/mappable-default-ui-theme')
    );
    const app = Vue.createApp({
        components: {
            MMap,
            MMapControls,
            MMapDefaultSchemeLayer,
            MMapRotateTiltControl,
            MMapTiltControl,
            MMapRotateControl,
            MMapZoomControl
        },
        setup() {
            const refMap = (ref: any) => {
                window.map = ref?.entity;
            };
            return {LOCATION, ENABLED_BEHAVIORS, refMap};
        },
        template: `
            <MMap :location="LOCATION" :behaviors="ENABLED_BEHAVIORS" :showScaleInCopyrights="true" :ref="refMap">
                <MMapDefaultSchemeLayer />
                <MMapControls position="right">
                    <MMapRotateTiltControl />
                    <MMapRotateControl />
                    <MMapTiltControl />
                </MMapControls>
            </MMap>`
    });
    app.mount('#app');
}
