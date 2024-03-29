import {updateFiles} from '../figma/update-files';

async function main() {
    try {
        await updateFiles();
    } catch (error) {
        console.error(error.message || error.toString());
    }
}

main().catch(() => {
    process.exit(1);
});
