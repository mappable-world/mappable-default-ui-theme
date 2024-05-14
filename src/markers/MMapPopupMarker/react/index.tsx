import {MMapEntity} from '@mappable-world/mappable-types';
import {CustomReactify, OverrideProps, Prettify} from '@mappable-world/mappable-types/reactify/reactify';
import type TReact from 'react';
import {MMapPopupMarker as MMapPopupMarkerI, MMapPopupMarkerProps} from '../';

type MMapPopupMarkerReactifiedProps = Prettify<
    OverrideProps<
        MMapPopupMarkerProps,
        {
            /** The function of creating popup content */
            content: string | (() => TReact.ReactElement);
        }
    >
>;

type MMapPopupMarkerR = TReact.ForwardRefExoticComponent<
    Prettify<MMapPopupMarkerReactifiedProps & React.RefAttributes<MMapEntity<MMapPopupMarkerProps>>>
>;

export const MMapPopupMarkerReactifyOverride: CustomReactify<MMapPopupMarkerI, MMapPopupMarkerR> = (
    MMapPopupMarkerI,
    {reactify, React, ReactDOM}
) => {
    const MMapPopupMarkerReactified = reactify.entity(MMapPopupMarkerI);

    const MMapPopupMarker = React.forwardRef<MMapPopupMarkerI, MMapPopupMarkerReactifiedProps>((props, ref) => {
        const [popupElement] = React.useState(document.createElement('mappable'));
        const [content, setContent] = React.useState<React.ReactElement>();

        const popup = React.useMemo(() => {
            if (typeof props.content === 'string') {
                setContent(<>{props.content}</>);
            } else {
                setContent(props.content());
            }
            return () => popupElement;
        }, [props.content, popupElement]);

        return (
            <>
                <MMapPopupMarkerReactified {...props} content={popup} ref={ref} />
                {ReactDOM.createPortal(content, popupElement)}
            </>
        );
    });
    return MMapPopupMarker;
};
