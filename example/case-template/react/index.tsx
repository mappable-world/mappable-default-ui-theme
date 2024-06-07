import {CENTER, LOCATION} from '../common';

window.map = null;

main();
async function main() {
    const [mappableReact] = await Promise.all([mappable.import('@mappable-world/mappable-reactify'), mappable.ready]);
    const reactify = mappableReact.reactify.bindTo(React, ReactDOM);

    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls} = reactify.module(mappable);

    const {MMapDefaultMarker, MMapZoomControl} = reactify.module(
        await mappable.import('@mappable-world/mappable-default-ui-theme')
    );

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('app')
    );

    function App() {
        return (
            <MMap location={LOCATION} ref={(x) => (map = x)}>
                <MMapDefaultSchemeLayer />
                <MMapDefaultFeaturesLayer />
                <MMapControls position="right">
                    <MMapZoomControl />
                </MMapControls>
                <MMapDefaultMarker coordinates={CENTER} size="normal" iconName="fallback" />
            </MMap>
        );
    }
}
