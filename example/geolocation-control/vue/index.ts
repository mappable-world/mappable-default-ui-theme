import {LOCATION} from '../common';

window.map = null;

main();
async function main() {
    const [mappableVue] = await Promise.all([mappable.import('@mappable-world/mappable-vuefy'), mappable.ready]);
    const vuefy = mappableVue.vuefy.bindTo(Vue);

    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls} = vuefy.module(mappable);

    const {MMapGeolocationControl} = vuefy.module(await mappable.import('@mappable-world/mappable-default-ui-theme'));

    const app = Vue.createApp({
        components: {
            MMap,
            MMapDefaultSchemeLayer,
            MMapDefaultFeaturesLayer,
            MMapControls,
            MMapGeolocationControl
        },
        setup() {
            const refMap = (ref: any) => {
                window.map = ref?.entity;
            };
            const onClick = () => alert('Click!');
            return {LOCATION, refMap, onClick};
        },
        template: `
            <MMap :location="LOCATION" :ref="refMap">
                <MMapDefaultSchemeLayer />
                <MMapDefaultFeaturesLayer />
                <MMapControls position="right">
                    <MMapGeolocationControl />
                </MMapControls>
            </MMap>`
    });
    app.mount('#app');
}
