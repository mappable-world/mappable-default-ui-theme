import {LOCATION} from '../common';
window.map = null;

main();
async function main() {
    await mappable.ready;
    const {MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapControls} = mappable;

    mappable
        .getDefaultConfig()
        // @ts-ignore
        .setApikeys({search: 'pk_ZAROIlpukeMufiKGZFwyulaUQEXIjDySkgduDDiovkifzqXLsJweeFmxeoRwZNNc'});
    const {MMapSearchControl} = await mappable.import('@mappable-world/mappable-default-ui-theme');

    map = new MMap(document.getElementById('app'), {location: LOCATION});

    map.addChild(new MMapDefaultSchemeLayer({}));
    map.addChild(new MMapDefaultFeaturesLayer({}));

    map.addChild(
        new MMapControls({position: 'top'}).addChild(
            new MMapSearchControl({
                searchResult: (result) => {
                    console.log(result);
                }
            })
        )
    );
}
