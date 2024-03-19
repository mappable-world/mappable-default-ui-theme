import {Api as FigmaApi, Node, isNodeType} from 'figma-api';

type ComponentOptions = {
    fileId: string;
    canvasName: string;
};

export const getComponents = async (options: ComponentOptions, api: FigmaApi): Promise<Node<'COMPONENT'>[]> => {
    const file = await api.getFile(options.fileId);

    const canvas = file.document.children.find((child) => child.name === options.canvasName) as Node<'CANVAS'>;
    if (!canvas) {
        throw new Error(`Canvas "${options.canvasName}" not found!`);
    }

    return canvas.children.reduce((components, child) => {
        if (!isNodeType(child, 'GROUP')) {
            return components;
        }
        const newComponents = child.children.filter((child) => isNodeType(child, 'INSTANCE')) as Node<'COMPONENT'>[];
        return components.concat(newComponents);
    }, [] as Node<'COMPONENT'>[]);
};
