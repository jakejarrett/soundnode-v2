import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

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
        padding: '5px 10px',
        display: 'block',
        borderLeft: '4px solid transparent',
        fontSize: '0.8rem',

        '&:hover': {
            borderLeftColor: 'var(--soundcloud-orange)',
        },
    },

    '& h5': {
        textTransform: 'uppercase',
        fontSize: '0.8rem',
        margin: '15px 10px 10px',
        opacity: 0.7,
        // borderLeft: '4px solid transparent',
    }
});

const getActive = (path: string) => {
    switch (path) {
        case "/discover": {
            return 
        }
    }
}

export const Navigation: React.FC<{}> = () => {
    const { pathname } = useLocation();
    const paths = ["discover", "search"];
    const potentials = paths.filter(path => path === pathname.split("/")[1]);
    console.log(potentials)

    return (
        <Sidebar>
            <h5>Discover</h5>
            <Link to="/" className={(pathname === '/' || potentials.length === 0) ? 'active' : ''}>Stream</Link>
            <Link to="/discover" className={pathname === '/discover' ? 'active' : ''}>Discover</Link>
        </Sidebar>
    )
};