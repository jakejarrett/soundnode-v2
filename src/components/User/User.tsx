import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import { useSoundCloud } from '../../hooks/useSoundCloud';
import { SoundCloudUser } from '../../util/Soundcloud';
import { IoIosArrowDown } from 'react-icons/io';

const UserComponent = styled.div({
    float: 'right',
    '-webkit-app-region': 'no-drag',
    '& > div': {
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        margin: '0 10px',

        '& span': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            marginRight: 10
        },

        '& img': {
            marginRight: 10,
            marginLeft: 4,
            width: 30,
            height: 30,
            borderRadius: '100%',
        },

    },


    '& p': {
        fontWeight: 'bold',
        fontSize: '0.8rem',
        cursor: 'pointer',
        padding: '5px 10px',
        borderLeft: '4px solid transparent',

        // '&:hover': {
        //     borderLeftColor: 'var(--soundcloud-orange)'
        // }
    }
});

const Dropdown = styled.div({
    position: 'absolute',
    top: 50,
    right: 58,
    width: 150,
    background: 'rgba(0, 0, 0, 0.8)',
    boxShadow: '0 0 5px 0 #000000',
    borderRadius: '0 0 10px 10px',
    backdropFilter: 'blur(15px)',
    borderTopWidth: 1,
    borderTopColor: 'rgba( 255, 255, 255, 0.7)',
    padding: '0 20px',
});

const ClickableDiv = styled.div({
    cursor: 'pointer',
    padding: '10px',

    '&:hover': {
        background: 'rgba(0, 0, 0, 0.5)',
    }
})

export const User = () => {
    const logout = () => ipcRenderer.send('logout');
    const soundcloud = useSoundCloud();
    const [user, setUser] = React.useState<SoundCloudUser | null>(null);
    const [dropdownShown, showDropdown] = React.useState<boolean>(false);
    const dropdown = useRef<HTMLDivElement | null>(null);
    const toggleDropdown = () => {
        showDropdown(!dropdownShown);
    }
    const listener = (e: MouseEvent) => {
        if (!dropdown.current?.contains(e.target as Node) && e.target !== dropdown.current) {
            showDropdown(false);
        }
    }

    React.useEffect(() => {
        soundcloud.me.get().then(user => {
            if (typeof user !== 'number') {
                setUser(user);
            }

        });

    }, [soundcloud.me]);

    useEffect(() => {
        if (dropdownShown) {
            document.addEventListener('click', listener);
        } else {
            document.removeEventListener('click', listener);
        }

        return () => {
            document.removeEventListener('click', listener);
        }
    }, [dropdownShown]);

    return user == null ? null : (<UserComponent>
        <ClickableDiv onClick={toggleDropdown} style={{ ...(dropdownShown ? { background: 'rgba(0, 0, 0, 0.5)' } : undefined)}}>
            <img src={user.avatar_url} alt={`${user.username}'s avatar.`} />
            <span>{user.username}</span>
            <IoIosArrowDown size={'1em'} />
        </ClickableDiv>

        {dropdownShown ? (
            <Dropdown ref={ref => dropdown.current = ref}>
                <p onClick={logout}>Logout</p>

            </Dropdown>
        ) : null}

    </UserComponent>)
};