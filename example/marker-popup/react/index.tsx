import {MarkerSizeProps} from '../../src';
import {CENTER, LOCATION} from '../common';

window.map = null;

main();
async function main() {
    const [mappableReact] = await Promise.all([mappable.import('@mappable-world/mappable-reactify'), mappable.ready]);
    const reactify = mappableReact.reactify.bindTo(React, ReactDOM);

    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls, MMapControlButton} =
        reactify.module(mappable);

    const {useState, useCallback, useMemo} = React;

    const {MMapDefaultMarker} = reactify.module(await mappable.import('@mappable-world/mappable-default-ui-theme'));

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('app')
    );

    function App() {
        const [location] = useState(LOCATION);
        const [size, setSize] = useState<MarkerSizeProps>('normal');
        const popup = useMemo(() => ({content: () => <span>Marker popup</span>}), []);

        return (
            <MMap location={location} ref={(x) => (map = x)}>
                <MMapDefaultSchemeLayer />
                <MMapDefaultFeaturesLayer />

                <MMapDefaultMarker coordinates={CENTER} iconName="fallback" size={size} popup={popup} />

                <MMapControls position="top left">
                    <MMapControlButton text="Normal" onClick={useCallback(() => setSize('normal'), [])} />
                    <MMapControlButton text="Small" onClick={useCallback(() => setSize('small'), [])} />
                    <MMapControlButton text="Micro" onClick={useCallback(() => setSize('micro'), [])} />
                </MMapControls>
            </MMap>
        );
    }
}
