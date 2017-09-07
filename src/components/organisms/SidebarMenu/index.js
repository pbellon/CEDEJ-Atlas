import React from 'react';
import { Route } from 'react-router-dom';
import AtlasIcon from 'react-icons/lib/md/public';
import ProjectIcon from 'react-icons/lib/md/assignment';
import AboutIcon from 'react-icons/lib/md/help-outline';
import ContributeIcon from 'react-icons/lib/md/comment'; 
import { palette } from 'styled-theme';
import styled, { css } from 'styled-components';

import { NavLink as _NavLink, SocialSharing } from 'components';

const ItemColor = ({active})=>{
  return active ? palette('primary', 1) : palette('grayscale', 1);
};

const Blank = styled.span`
  display: inline-block;
  width: 1em;
`;

const Li = styled.li`
  margin:0;
  list-style: none;
  padding: 0;
  font-size: 0.9rem; 
`;

const NavLink = styled(_NavLink)`
  display:block;
  padding:12px;
  background-color:${palette('grayscale', 1)};
  color: white;
  transition: background .2s ease;
  &.active {
    background-color: ${palette('primary',2)};
    color: white;
    cursor: default;
  }
  &:hover {
    text-decoration: none;
  }
  &:hover:not(.active) {
    background: ${palette('grayscale', 0)};
  }
`;

const MenuItem = ({ to, icon, title}) => {
  return (
  <Li>
    <NavLink to={ to }>{icon}<Blank/>{title}</NavLink>
  </Li>
);
}

const Menu = styled.ul`
  list-style: none;
  margin: 0; 
  padding: 0;
`;


const SidebarMenu = ()=>(
  <div>
    <SocialSharing />
    <Menu>
      <MenuItem
        to={ '/map' }
        icon={<AtlasIcon/>}
        title={'Atlas'} />
      
      <MenuItem
        icon={<ProjectIcon/>}
        title={'Le projet'}
        to={ '/page/project' }/>

      <MenuItem
        icon={<AboutIcon/>}
        to={'/page/about'}
        title={'À propos'} />

      <MenuItem
        icon={<ContributeIcon/>}
        to={'/page/contribute'}
        title={'Participer'} />
    </Menu>
  </div>
);

export default SidebarMenu;
