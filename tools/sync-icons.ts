import {fetchFigmaIcons} from './figma/figma-api';

async function main() {
    try {
        console.info('Start update figma icons');
        await fetchFigmaIcons();
        console.info('Update figma icons succeed!');
    } catch (error) {
        console.error(error.message || error.toString());
    }
}

main().catch(() => {
    process.exit(1);
});
