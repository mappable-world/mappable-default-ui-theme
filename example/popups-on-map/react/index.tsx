import type {MMapPopupPositionProps} from '../../src';
import {ACTION, CUSTOM_POPUP_COORDS, DESCRIPTION, LOCATION, POPUP_TEXT, TEXT_POPUP_COORDS, TITLE} from '../common';
window.map = null;

main();
async function main() {
    const [mappableReact] = await Promise.all([mappable.import('@mappable-world/mappable-reactify'), mappable.ready]);
    const reactify = mappableReact.reactify.bindTo(React, ReactDOM);

    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls, MMapControlButton} =
        reactify.module(mappable);

    const {useState, useCallback} = React;

    const {MMapPopupMarker} = reactify.module(await mappable.import('@mappable-world/mappable-default-ui-theme'));

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('app')
    );

    function App() {
        const [position, setPosition] = useState<MMapPopupPositionProps>(undefined);
        const [showCustom, setShowCustom] = useState(true);

        const positionLeft = useCallback(() => setPosition('left'), []);
        const positionLeftTop = useCallback(() => setPosition('left top'), []);
        const positionLeftBottom = useCallback(() => setPosition('left bottom'), []);
        const positionBottom = useCallback(() => setPosition('bottom'), []);
        const positionTop = useCallback(() => setPosition('top'), []);
        const positionRightTop = useCallback(() => setPosition('right top'), []);
        const positionRightBottom = useCallback(() => setPosition('right bottom'), []);
        const positionRight = useCallback(() => setPosition('right'), []);

        const customPopupContent = useCallback(
            () => (
                <span className="popup">
                    <span className="header">
                        <span className="header_title">{TITLE}</span>
                        <button className="header_close" onClick={() => setShowCustom(false)}></button>
                    </span>
                    <span className="description">{DESCRIPTION}</span>
                    <button className="action" onClick={() => alert('Click on action button!')}>
                        {ACTION}
                    </button>
                </span>
            ),
            []
        );

        return (
            <MMap location={LOCATION} ref={(x) => (map = x)}>
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
                <MMapPopupMarker coordinates={TEXT_POPUP_COORDS} draggable position={position} content={POPUP_TEXT} />
                <MMapPopupMarker
                    coordinates={CUSTOM_POPUP_COORDS}
                    draggable
                    position={position}
                    show={showCustom}
                    content={customPopupContent}
                />
            </MMap>
        );
    }
}
