import React from 'react';
import styled from 'styled-components';
import { WindowActions } from '../WindowActions';

const HeaderbarOuter = styled.div({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    width: '100vw',
    height: 'var(--navbar-height)',
    background: 'black',
    borderTop: '2px solid var(--soundcloud-orange)',
    borderBottom: '1px solid var(--separator-dark-color)',
    boxShadow: '0 0 7px 0px #000',
    'zIndex': 100,
    '-webkit-app-region': 'drag',
});

interface ComponentProps {

}

export const Headerbar: React.FC<ComponentProps> = () => {
    return (
        <HeaderbarOuter>
            <WindowActions />
        </HeaderbarOuter>
    )
};