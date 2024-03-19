export const makeChunks = <T>(input: T[], perChunk: number): T[][] => {
    return input.reduce<T[][]>((chunks, item, index) => {
        const chunkIndex = Math.floor(index / perChunk);
        if (!chunks[chunkIndex]) {
            chunks[chunkIndex] = [];
        }
        chunks[chunkIndex].push(item);
        return chunks;
    }, []);
};
