import {LOCATION, MARKER_LOCATIONS} from '../common';

window.map = null;

main();
async function main() {
    const [mappableReact] = await Promise.all([mappable.import('@mappable-world/mappable-reactify'), mappable.ready]);
    const reactify = mappableReact.reactify.bindTo(React, ReactDOM);

    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer} = reactify.module(mappable);

    const {useState} = React;

    const {MMapDefaultMarker} = reactify.module(await mappable.import('@mappable-world/mappable-default-ui-theme'));

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('app')
    );

    function App() {
        const [location] = useState(LOCATION);

        return (
            <MMap location={location} ref={(x) => (map = x)}>
                <MMapDefaultSchemeLayer />
                <MMapDefaultFeaturesLayer />
                {MARKER_LOCATIONS.map((props, i) => (
                    <MMapDefaultMarker {...props} key={i} />
                ))}
            </MMap>
        );
    }
}
