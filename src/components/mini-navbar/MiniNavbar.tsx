import React from 'react';
import { NavLink } from 'react-router-dom';
import { NavbarContainer, NavItem } from './MiniNavbar.s';

const MiniNavbar: React.FC = () => (
    <NavbarContainer>
        <NavLink style={{ textDecoration: 'none' }} to="/">
            {' '}
            <NavItem>KRC-20</NavItem>
        </NavLink>
        <NavLink style={{ textDecoration: 'none' }} to="/swap">
            {' '}
            <NavItem>Swap</NavItem>
        </NavLink>
        {/* <NavLink style={{ textDecoration: 'none' }} to="/dca">
            {' '}
            <NavItem>DCA</NavItem>
        </NavLink> */}
    </NavbarContainer>
);

export default MiniNavbar;
