import {generateIconsTypes} from '../icons/generate-types';
import {updateIcons} from '../icons/update-icons';

async function main() {
    try {
        const icons = await updateIcons();
        await generateIconsTypes(icons);
    } catch (error) {
        console.error(error.message || error.toString());
    }
}

main().catch(() => {
    process.exit(1);
});
