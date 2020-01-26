import { useState } from 'react';
import { Config, Configuration } from '../util/Configuration';

export const useConfig = () => {
    const { config } = new Configuration();
    const [configuration] = useState<Config>(config);
    return configuration;
}