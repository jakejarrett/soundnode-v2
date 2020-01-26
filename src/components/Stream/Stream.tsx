import React from 'react';
import { StreamResponse } from "../util/Soundcloud"
import { useSoundCloud } from '../useSoundCloud';

export const Stream = () => {
    const soundcloud = useSoundCloud();
    const [streamResponse, setStreamResponse] = React.useState<StreamResponse | null>(null);

    React.useEffect(() => {
        soundcloud.stream.get().then(setStreamResponse);
    }, [soundcloud.stream]);

    return streamResponse == null ? null : (
        <>
            {
                streamResponse.collection.map(entity => {
                    return <div>
                        <p>{entity.type}</p>
                        <p>{entity.type}</p>
                    </div>
                })
            }
        </>
    )
};