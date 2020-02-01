import React from 'react';
import styled from 'styled-components';
import { WindowActions } from '../WindowActions';
import { User } from '../User';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';

const HeaderbarOuter = styled.div({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    width: '100vw',
    height: 'var(--navbar-height)',
    background: 'linear-gradient(to bottom, var(--body-background), 10%, #101010)',
    borderTop: '2px solid var(--soundcloud-orange)',
    boxShadow: '0 0 10px 0 #000000',
    'zIndex': 100,
    '-webkit-app-region': 'drag',

    '& input': {
        color: 'white',
        '-webkit-app-region': 'no-drag',
        background: 'transparent',
        border: 0,
        borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
        borderRadius: 0,
        outline: 0,
        padding: '5px 10px',
        maxWidth: 300,
        width: '100%',
        margin: '0 0 0 10px',

        '&:focus, &:active': {
            borderBottomColor: 'var(--soundcloud-orange)',
        }
    }
});

const IconWrapper = styled.a({
    display: 'inline-block',
    margin: '0 10px 0 0',
})

const HeaderbarInner = styled.div({
    width: '100%',
});

interface ComponentProps {

}

export const Headerbar: React.FC<ComponentProps> = () => {
    return (
        <HeaderbarOuter>
            <HeaderbarInner className="window-actions-container">
                <WindowActions />
            </HeaderbarInner>
            <HeaderbarInner>
                <IconWrapper>
                    <IoIosArrowBack size="1em" />
                </IconWrapper>
                <IconWrapper>
                    <IoIosArrowForward size="1em" />
                </IconWrapper>
                <input placeholder="Search soundcloud" />
            </HeaderbarInner>
            <HeaderbarInner>
                <User />
            </HeaderbarInner>
        </HeaderbarOuter>
    )
};