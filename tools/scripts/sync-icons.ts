import {generateIconsDocsList} from '../icons/generate-docs';
import {generateIconsTypes} from '../icons/generate-types';
import {getUniqNames} from '../icons/get-uniq-names';
import {updateIcons} from '../icons/update-icons';

async function main() {
    try {
        const iconsDescription = await updateIcons();
        const iconNames = getUniqNames(iconsDescription);
        await generateIconsTypes(iconNames);
        await generateIconsDocsList(iconNames);
    } catch (error) {
        console.error(error.message || error.toString());
    }
}

main().catch(() => {
    process.exit(1);
});
