import {MMapTooltipMarkerProps} from '../../src';
import {CENTER, LOCATION, TOOLTIP_TEXT} from '../common';

window.map = null;

main();
async function main() {
    const [mappableReact] = await Promise.all([mappable.import('@mappable-world/mappable-reactify'), mappable.ready]);
    const reactify = mappableReact.reactify.bindTo(React, ReactDOM);

    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls, MMapControlButton} =
        reactify.module(mappable);

    const {useState, useCallback} = React;

    const {MMapTooltipMarker} = reactify.module(await mappable.import('@mappable-world/mappable-default-ui-theme'));

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('app')
    );

    function App() {
        const [location] = useState(LOCATION);
        const [position, setPosition] = useState<MMapTooltipMarkerProps['position']>(undefined);

        const positionLeft = useCallback(() => setPosition('left'), []);
        const positionLeftTop = useCallback(() => setPosition('left top'), []);
        const positionLeftBottom = useCallback(() => setPosition('left bottom'), []);
        const positionBottom = useCallback(() => setPosition('bottom'), []);
        const positionTop = useCallback(() => setPosition('top'), []);
        const positionRightTop = useCallback(() => setPosition('right top'), []);
        const positionRightBottom = useCallback(() => setPosition('right bottom'), []);
        const positionRight = useCallback(() => setPosition('right'), []);

        return (
            <MMap location={location} ref={(x) => (map = x)}>
                <MMapDefaultSchemeLayer />
                <MMapDefaultFeaturesLayer />
                <MMapControls position="top right">
                    <MMapControlButton text="Left" onClick={positionLeft} />
                    <MMapControlButton text="Left Top" onClick={positionLeftTop} />
                    <MMapControlButton text="Left Bottom" onClick={positionLeftBottom} />
                    <MMapControlButton text="Bottom" onClick={positionBottom} />
                    <MMapControlButton text="Top" onClick={positionTop} />
                    <MMapControlButton text="Right Top" onClick={positionRightTop} />
                    <MMapControlButton text="Right Bottom" onClick={positionRightBottom} />
                    <MMapControlButton text="Right" onClick={positionRight} />
                </MMapControls>
                <MMapTooltipMarker coordinates={CENTER} draggable content={TOOLTIP_TEXT} position={position} />
            </MMap>
        );
    }
}
