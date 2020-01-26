import React from 'react';
import styled from 'styled-components';
import { useSoundCloud } from '../useSoundCloud';
import { SoundCloudUser } from '../util/Soundcloud';
import { ipcRenderer } from 'electron';
import { Link } from 'react-router-dom';

const Sidebar = styled.div({
    position: "fixed",
    top: 'var(--navbar-height)',
    left: 0,
    height: 'calc(100vh - var(--navbar-height))',
    width: '160px',
    background: 'var(--section-background)',
    color: 'var(--body-foreground)',

    '& a': {
        color: 'var(--body-foreground)',
        textDecoration: 'none',
        fontWeight: 'bold',
        padding: 10,
        display: 'block',
        borderLeft: '4px solid var(--soundcloud-orange)',

        '&:hover': {
            backgroundColor: 'var(--soundcloud-orange)',
        },
    }
});

const User = styled.div({

    '& > div': {
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
        padding: '10px 10px 0 10px',
        flexWrap: 'wrap',
        marginTop: 10,

        '& span': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontWeight: 'bold',
            fontSize: '0.9rem',
        },

        '& img': {
            marginRight: 10,
            width: 30,
            height: 30,
            borderRadius: '100%',
        },

    },


    '& p': {
        fontWeight: 'bold',
        fontSize: '0.8rem',
        cursor: 'pointer',
        padding: 10,

        '&:hover': {
            backgroundColor: 'var(--soundcloud-orange)'
        }
    }
});

export const Navigation: React.FC<{}> = () => {
    const logout = () => ipcRenderer.send('logout');
    const soundcloud = useSoundCloud();
    const [user, setUser] = React.useState<SoundCloudUser | null>(null);
    React.useEffect(() => {
        soundcloud.me.get().then(user => {
            if (typeof user !== 'number') {
                setUser(user);
            }

        });

    }, [soundcloud.me]);

    return (
        <Sidebar>
            {user == null ? null : (
                <User>
                    <div>
                        <img src={user.avatar_url} alt={`${user.username}'s avatar.`} />
                        <span>{user.username}</span>
                    </div>

                    <p onClick={logout}>Logout</p>
                </User>
            )}
            <Link to="/" className={window.location.pathname === '/' ? 'active' : ''}>Stream</Link>
        </Sidebar>
    )
};