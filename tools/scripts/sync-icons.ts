import {updateIcons} from '../figma/update-icons';

async function main() {
    try {
        await updateIcons();
    } catch (error) {
        console.error(error.message || error.toString());
    }
}

main().catch(() => {
    process.exit(1);
});
