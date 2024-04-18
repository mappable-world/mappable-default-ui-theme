import {CUSTOM_POPUP_COORDS, DEFAULT_POPUP_COORDS, LOCATION} from '../common';

window.map = null;

main();
async function main() {
    const [mappableReact] = await Promise.all([mappable.import('@mappable-world/mappable-reactify'), mappable.ready]);
    const reactify = mappableReact.reactify.bindTo(React, ReactDOM);

    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls, MMapControlButton} =
        reactify.module(mappable);

    const {useState, useCallback} = React;

    const {MMapBalloonMarker, MMapDefaultPopupMarker} = reactify.module(
        await mappable.import('@mappable-world/mappable-default-ui-theme')
    );

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('app')
    );

    function App() {
        const [location] = useState(LOCATION);
        const [showDefaultPopup, setShowDefaultPopup] = useState(true);
        const [showCustomPopup, setShowCustomPopup] = useState(true);

        const toggleDefaultPopup = useCallback(() => setShowDefaultPopup((prev) => !prev), [showDefaultPopup]);
        const toggleCustomPopup = useCallback(() => setShowCustomPopup((prev) => !prev), [showCustomPopup]);
        const actionCallback = useCallback(() => alert('Click on action button!'), []);
        const contentCallback = useCallback(
            () => (
                <div className="custom-popup">
                    <div className="title">Title</div>
                    <button onClick={onCloseCustomPopup}>close</button>
                    <div className="content">Custom popup content</div>
                </div>
            ),
            []
        );
        const onCloseCustomPopup = useCallback(() => setShowCustomPopup(false), [showCustomPopup]);
        const onCloseDefaultPopup = useCallback(() => setShowDefaultPopup(false), [showDefaultPopup]);

        return (
            <MMap location={location} ref={(x) => (map = x)}>
                <MMapDefaultSchemeLayer />
                <MMapDefaultFeaturesLayer />
                <MMapControls position="top right">
                    <MMapControlButton text="Toggle custom popup" onClick={toggleCustomPopup} />
                    <MMapControlButton text="Toggle default popup" onClick={toggleDefaultPopup} />
                </MMapControls>

                <MMapBalloonMarker show={showCustomPopup} coordinates={CUSTOM_POPUP_COORDS} content={contentCallback} />

                <MMapDefaultPopupMarker
                    show={showDefaultPopup}
                    coordinates={DEFAULT_POPUP_COORDS}
                    title="Default popup marker"
                    description="Description for default popup"
                    action="Make an action"
                    onAction={actionCallback}
                    onClose={onCloseDefaultPopup}
                />
            </MMap>
        );
    }
}
