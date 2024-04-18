import type TReact from 'react';
import {CustomReactify, Prettify, OverrideProps} from '@mappable-world/mappable-types/reactify/reactify';
import {MMapEntity} from '@mappable-world/mappable-types';
import {MMapBalloonMarker as MMapBalloonMarkerI, MMapBalloonMarkerProps} from '../';

type MMapBalloonMarkerReactifiedProps = Prettify<
    OverrideProps<
        MMapBalloonMarkerProps,
        {
            /** The function of creating balloon content */
            content: () => TReact.ReactElement;
        }
    >
>;

type MMapBalloonMarkerR = TReact.ForwardRefExoticComponent<
    Prettify<MMapBalloonMarkerReactifiedProps & React.RefAttributes<MMapEntity<MMapBalloonMarkerProps>>>
>;

export const MMapBalloonMarkerReactifyOverride: CustomReactify<MMapBalloonMarkerI, MMapBalloonMarkerR> = (
    MMapBalloonMarkerI,
    {reactify, React, ReactDOM}
) => {
    const MMapBalloonMarkerReactified = reactify.entity(MMapBalloonMarkerI);

    const MMapBalloonMarker = React.forwardRef<MMapBalloonMarkerI, MMapBalloonMarkerReactifiedProps>((props, ref) => {
        const [balloonElement] = React.useState(document.createElement('mappable'));
        const [content, setContent] = React.useState<React.ReactElement>();

        const balloon = React.useMemo(() => {
            setContent(props.content());
            return () => balloonElement;
        }, [props.content, balloonElement]);

        return (
            <>
                <MMapBalloonMarkerReactified {...props} content={balloon} ref={ref} />
                {ReactDOM.createPortal(content, balloonElement)}
            </>
        );
    });
    return MMapBalloonMarker;
};
