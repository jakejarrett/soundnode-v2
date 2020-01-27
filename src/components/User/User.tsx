import React from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import { useSoundCloud } from '../useSoundCloud';
import { SoundCloudUser } from '../util/Soundcloud';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const UserComponent = styled.div({
    float: 'right',
    '-webkit-app-region': 'no-drag',
    '& > div': {
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
        padding: '0 20px',
        flexWrap: 'wrap',
        marginTop: 10,

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

        '&:hover': {
            borderLeftColor: 'var(--soundcloud-orange)'
        }
    }
});

export const User = () => {
    const logout = () => ipcRenderer.send('logout');
    const soundcloud = useSoundCloud();
    const [user, setUser] = React.useState<SoundCloudUser | null>(null);
    const [dropdownShown, showDropdown] = React.useState<boolean>(false);
    const toggleDropdown = () => {
        showDropdown(!dropdownShown);
    }

    React.useEffect(() => {
        soundcloud.me.get().then(user => {
            if (typeof user !== 'number') {
                setUser(user);
            }

        });

    }, [soundcloud.me]);

    return user == null ? null : (<UserComponent>
        <div>
            <img src={user.avatar_url} alt={`${user.username}'s avatar.`} />
            <span>{user.username}</span>
            <FontAwesomeIcon icon={faChevronDown} size={'xs'} onClick={toggleDropdown} />
        </div>

        {dropdownShown ? (
            <div>
                <p onClick={logout}>Logout</p>

            </div>
        ) : null}

    </UserComponent>)
};