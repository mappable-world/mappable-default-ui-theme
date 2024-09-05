import {RulerType} from '@mappable-world/mappable-types/modules/ruler';
import {LOCATION, RULER_COORDINATES} from '../common';

window.map = null;

main();
async function main() {
    // For each object in the JS API, there is a React counterpart
    // To use the React version of the API, include the module @mappable-world/mappable-reactify
    const [mappableReact] = await Promise.all([mappable.import('@mappable-world/mappable-reactify'), mappable.ready]);
    const reactify = mappableReact.reactify.bindTo(React, ReactDOM);
    const {MMap, MMapDefaultSchemeLayer, MMapControls, MMapControlButton} = reactify.module(mappable);
    const {MMapDefaultRuler} = reactify.module(await mappable.import('@mappable-world/mappable-default-ui-theme'));
    const {useState, useCallback} = React;

    function App() {
        const [location] = useState(LOCATION);
        const [rulerCoordinates] = useState(RULER_COORDINATES);
        const [rulerType, setRulerType] = useState<RulerType>('ruler');
        const [editable, setEditable] = useState(true);

        const switchEditable = useCallback(() => setEditable((editable) => !editable), []);
        const switchType = useCallback(
            () => setRulerType((rulerType) => (rulerType === 'ruler' ? 'planimeter' : 'ruler')),
            []
        );
        const onFinish = useCallback(() => setEditable(false), []);

        return (
            // Initialize the map and pass initialization parameters
            <MMap location={location} showScaleInCopyrights={true} ref={(x) => (map = x)}>
                {/* Add a map scheme layer */}
                <MMapDefaultSchemeLayer />
                <MMapDefaultRuler type={rulerType} points={rulerCoordinates} editable={editable} onFinish={onFinish} />

                <MMapControls position="top right">
                    <MMapControlButton onClick={switchEditable} text="Switch edit ruler" />
                </MMapControls>
                <MMapControls position="top left">
                    <MMapControlButton onClick={switchType} text="Switch ruler type" />
                </MMapControls>
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
