import {MMapEntity} from '@mappable-world/mappable-types';
import {CustomReactify, OverrideProps, Prettify} from '@mappable-world/mappable-types/reactify/reactify';
import type TReact from 'react';
import {MMapDefaultMarkerProps, MarkerPopupProps, MMapDefaultMarker as MMapDefaultMarkerI} from '..';

type MMapDefaultMarkerReactifiedProps = Prettify<
    OverrideProps<
        MMapDefaultMarkerProps,
        {
            popup?: Omit<MarkerPopupProps, 'content'> & {
                /** The function of creating popup content */
                content: string | (() => TReact.ReactElement);
            };
        }
    >
>;

type MMapDefaultMarkerR = TReact.ForwardRefExoticComponent<
    Prettify<MMapDefaultMarkerReactifiedProps & React.RefAttributes<MMapEntity<MMapDefaultMarkerProps>>>
>;

export const MMapDefaultMarkerReactifyOverride: CustomReactify<MMapDefaultMarkerI, MMapDefaultMarkerR> = (
    MMapDefaultMarkerI,
    {reactify, React, ReactDOM}
) => {
    const MMapDefaultMarkerReactified = reactify.entity(MMapDefaultMarkerI);

    const MMapDefaultMarker = React.forwardRef<MMapDefaultMarkerI, MMapDefaultMarkerReactifiedProps>((props, ref) => {
        const [popupElement] = React.useState(document.createElement('mappable'));
        const [content, setContent] = React.useState<React.ReactElement>();

        const popup = React.useMemo(() => {
            if (props.popup === undefined) {
                return undefined;
            }

            if (typeof props.popup.content === 'string') {
                setContent(<>{props.popup.content}</>);
            } else if (typeof props.popup.content === 'function') {
                setContent(props.popup.content());
            }

            return {...props.popup, content: () => popupElement};
        }, [props.popup, popupElement]);

        return (
            <>
                <MMapDefaultMarkerReactified {...props} popup={popup} ref={ref} />
                {ReactDOM.createPortal(content, popupElement)}
            </>
        );
    });
    return MMapDefaultMarker;
};
