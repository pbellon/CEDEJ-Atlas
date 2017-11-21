import React from 'react';
import styled from 'styled-components';

// icons to use.
import AboutIcon from 'react-icons/lib/md/help-outline';
import AtlasIcon from 'react-icons/lib/md/public';
import ContributeIcon from 'react-icons/lib/md/comment';
import HomeIcon from 'react-icons/lib/md/home';
import ProjectIcon from 'react-icons/lib/md/assignment';

import { NavItem } from 'components';

const Nav = styled.ul`
  list-style: none;
  margin: 0; 
  padding: 0;
  display: flex;
`;


const NavbarTabs = () => (
  <Nav>
    <NavItem
      isHome
      to={'/'}
      icon={<HomeIcon />}
      title={'Accueil'}
    />
    <NavItem
      to={'/map'}
      icon={<AtlasIcon />}
      title={'Carte numérique mondiale des zones arides'}
    />

    <NavItem
      icon={<ProjectIcon />}
      title={'Le projet'}
      to={'/page/project'}
    />
    <NavItem
      icon={<AboutIcon />}
      to={'/page/about'}
      title={'À propos'}
    />
    { /*
    <NavItem
      icon={<ContributeIcon />}
      to={'/page/contribute'}
      title={'Participer'}
    /> */ }
  </Nav>
);

export default NavbarTabs;
