import {LOCATION, RULER_COORDINATES} from '../common';

window.map = null;

main();
async function main() {
    // For each object in the JS API, there is a React counterpart
    // To use the React version of the API, include the module @mappable-world/mappable-reactify
    const [mappableReact] = await Promise.all([mappable.import('@mappable-world/mappable-reactify'), mappable.ready]);
    const reactify = mappableReact.reactify.bindTo(React, ReactDOM);
    const {MMap, MMapDefaultSchemeLayer} = reactify.module(mappable);
    const {MMapDefaultRuler} = reactify.module(await mappable.import('@mappable-world/mappable-default-ui-theme'));
    const {useState} = React;

    function App() {
        const [location, setLocation] = useState(LOCATION);

        return (
            // Initialize the map and pass initialization parameters
            <MMap location={location} showScaleInCopyrights={true} ref={(x) => (map = x)}>
                {/* Add a map scheme layer */}
                <MMapDefaultSchemeLayer />
                <MMapDefaultRuler type="ruler" points={RULER_COORDINATES} />
            </MMap>
        );
    }

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('app')
    );
}
