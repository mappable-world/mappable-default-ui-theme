import i18next from 'i18next';

await i18next.init({
    lng: 'en',
    // debug: true,
    resources: {
        en: {
            translation: {
                distance: {
                    meters: '{{value, number}} m',
                    kilometers: '{{value, number}} km'
                },
                area: {
                    squareMeters: '{{value, number}} m²',
                    squareKilometers: '{{value, number}} km²'
                }
            }
        }
    }
});
