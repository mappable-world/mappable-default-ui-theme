import {ENABLED_BEHAVIORS, LOCATION} from '../common';

window.map = null;

main();
async function main() {
    const [mappableReact] = await Promise.all([mappable.import('@mappable-world/mappable-reactify'), mappable.ready]);
    const reactify = mappableReact.reactify.bindTo(React, ReactDOM);

    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls} = reactify.module(mappable);

    const {MMapGeolocationControl, MMapRotateControl, MMapRotateTiltControl, MMapTiltControl, MMapZoomControl} =
        reactify.module(await mappable.import('@mappable-world/mappable-default-ui-theme'));

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('app')
    );

    function App() {
        const location = React.useMemo(() => LOCATION, []);
        const behaviors = React.useMemo(() => ENABLED_BEHAVIORS, []);

        return (
            <MMap location={location} behaviors={behaviors} ref={(x) => (map = x)}>
                <MMapDefaultSchemeLayer />
                <MMapDefaultFeaturesLayer />
                <MMapControls position="left">
                    <MMapZoomControl />
                    <MMapGeolocationControl zoom={11} />
                </MMapControls>
                <MMapControls position="bottom">
                    <MMapZoomControl />
                </MMapControls>
                <MMapControls position="right">
                    <MMapRotateTiltControl />
                    <MMapRotateControl />
                    <MMapTiltControl />
                </MMapControls>
            </MMap>
        );
    }
}
