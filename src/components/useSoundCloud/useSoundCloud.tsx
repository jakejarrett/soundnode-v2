import { useState } from 'react';
import { SoundCloud } from '../util/Soundcloud';
import { useConfig } from '../useConfig';

export const useSoundCloud = () => {
    const config = useConfig();
    const [soundcloud] = useState<SoundCloud>(new SoundCloud(config.clientId, config.accessToken));

    return soundcloud;
}