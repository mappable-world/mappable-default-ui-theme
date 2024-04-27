import {LOCATION, MARKER_LOCATIONS} from '../common';
import {MMapTheme} from '@mappable-world/mappable-types';

window.map = null;

main();
async function main() {
    const [mappableReact] = await Promise.all([mappable.import('@mappable-world/mappable-reactify'), mappable.ready]);
    const reactify = mappableReact.reactify.bindTo(React, ReactDOM);

    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls, MMapControlButton} =
        reactify.module(mappable);

    const {useState, useCallback} = React;

    const {MMapDefaultMarker} = reactify.module(await mappable.import('@mappable-world/mappable-default-ui-theme'));

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('app')
    );

    function App() {
        const [location] = useState(LOCATION);
        const [theme, setTheme] = useState<MMapTheme>('light');

        const switchTheme = useCallback(() => {
            setTheme(theme === 'light' ? 'dark' : 'light');
        }, [theme]);

        return (
            <MMap location={location} theme={theme} ref={(x) => (map = x)}>
                <MMapDefaultSchemeLayer />
                <MMapDefaultFeaturesLayer />
                <MMapControls position="top right">
                    <MMapControlButton text="Switch theme" onClick={switchTheme} />
                </MMapControls>
                {MARKER_LOCATIONS.map((props, i) => (
                    <MMapDefaultMarker {...props} key={i} />
                ))}
            </MMap>
        );
    }
}
