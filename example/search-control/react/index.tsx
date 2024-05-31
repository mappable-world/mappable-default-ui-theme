import type {SearchResponse, Feature} from '@mappable-world/mappable-types';
import {LOCATION, MARGIN, initialMarkerProps, findSearchResultBoundsRange} from '../common';

window.map = null;

main();
async function main() {
    const [mappableReact] = await Promise.all([mappable.import('@mappable-world/mappable-reactify'), mappable.ready]);
    const reactify = mappableReact.reactify.bindTo(React, ReactDOM);

    const {useState, useCallback} = React;

    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls} = reactify.module(mappable);

    const {MMapDefaultMarker} = reactify.module(await mappable.import('@mappable-world/mappable-default-ui-theme'));
    const {MMapSearchControl} = reactify.module(await mappable.import('@mappable-world/mappable-default-ui-theme'));

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('app')
    );

    function App() {
        const [location, setLocation] = useState(LOCATION);
        const [searchMarkersProps, setSearchMarkersProps] = useState([initialMarkerProps]);

        const updateMapLocation = useCallback((searchResult: SearchResponse) => {
            if (searchResult.length !== 0) {
                let center;
                let zoom;
                let bounds;

                if (searchResult.length === 1) {
                    center = searchResult[0].geometry?.coordinates;
                    zoom = 12;
                } else {
                    bounds = findSearchResultBoundsRange(searchResult);
                }

                setLocation({
                    center,
                    zoom,
                    bounds,
                    duration: 400
                });
            }
        }, []);

        const searchResultHandler = useCallback((searchResult: SearchResponse) => {
            setSearchMarkersProps(searchResult);
            updateMapLocation(searchResult);
        }, []);

        const onClickSearchMarkerHandler = useCallback(
            (clickedMarker: Feature) => {
                setSearchMarkersProps(searchMarkersProps.filter((marker) => marker !== clickedMarker));
            },
            [searchMarkersProps]
        );

        return (
            <MMap location={location} margin={MARGIN} ref={(x) => (map = x)}>
                <MMapDefaultSchemeLayer />
                <MMapDefaultFeaturesLayer />
                <MMapControls position="top">
                    <MMapSearchControl searchResult={searchResultHandler} />
                </MMapControls>

                {searchMarkersProps.map((marker) => (
                    <MMapDefaultMarker
                        key={+marker.geometry.coordinates}
                        title={marker.properties.name}
                        subtitle={marker.properties.description}
                        coordinates={marker.geometry.coordinates}
                        onClick={() => onClickSearchMarkerHandler(marker)}
                        size="normal"
                        iconName="fallback"
                    />
                ))}
            </MMap>
        );
    }
}
