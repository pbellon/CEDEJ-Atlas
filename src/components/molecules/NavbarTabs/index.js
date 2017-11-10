import React from 'react';
import { translate } from 'react-i18next';
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


const NavbarTabs = ({ t, match:{ url }}) => (
  <Nav>
    <NavItem
      isHome
      to={`${url}`}
      icon={<HomeIcon />}
      title={t('home')}
    />
    <NavItem
      to={`${url}map`}
      icon={<AtlasIcon />}
      title={t('map')}
    />
    <NavItem
      icon={<ProjectIcon />}
      title={t('project')}
      to={`${url}page/project`}
    />
    <NavItem
      icon={<AboutIcon />}
      to={`${url}page/about`}
      title={t('about')}
    />
    <NavItem
      icon={<ContributeIcon />}
      to={`${url}page/contribute`}
      title={t('participate')}
    />
  </Nav>
);

export default translate('navbar')(NavbarTabs);
