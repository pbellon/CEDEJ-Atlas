import React from 'react';
import { Route } from 'react-router-dom';
import AboutIcon from 'react-icons/lib/md/help-outline';
import AtlasIcon from 'react-icons/lib/md/public';
import ContributeIcon from 'react-icons/lib/md/comment'; 
import HomeIcon from 'react-icons/lib/md/home'; 
import ProjectIcon from 'react-icons/lib/md/assignment';
import { palette } from 'styled-theme';
import styled, { css } from 'styled-components';

import { NavLink as _NavLink, SocialSharing } from 'components';

const ItemColor = ({active})=>{
  return active ? palette('primary', 1) : palette('grayscale', 1);
};

const Blank = styled.span`
  display: inline-block;
  width: 0.5em;
`;

const Li = styled.li`
  margin:0;
  list-style: none;
  text-align: center;
`;

const NavLink = styled(_NavLink)`
  display:block;
  background-color:${palette('grayscale', 0)};
  padding: 0 15px;
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
    background: ${palette('grayscale', 1)};
  }
`;

const HomeNavLink = styled(NavLink)`
  background-color: ${palette('white', 2)};
  color: ${palette('grayscale', 0)};
  &:hover:not(.active){
    background-color: ${palette('white', 0)};
  }
  &.active {
    color: #000;
    background-color: ${palette('grayscale', 4)};
  }
`;

const IconHolder = styled.span`
  & svg {
    margin-bottom: 3px;
  }
`;
const NavItem = ({ to, icon, title, isHome}) => {
  const Link = isHome ? HomeNavLink : NavLink; 
  return (
    <Li>
      <Link to={ to }>
        <IconHolder>{icon}</IconHolder><Blank/>{title}
      </Link>
    </Li>
  );
}
const Nav = styled.ul`
  list-style: none;
  margin: 0; 
  padding: 0;
  display: flex;
`;


const NavbarTabs = ()=>(
  <Nav>
    <NavItem
      isHome={true}
      to={ '/' }
      icon={<HomeIcon/>}
      title={'Atlas mondial des zones arides'}/>
    <NavItem
      to={ '/map' }
      icon={<AtlasIcon/>}
      title={'Atlas'} />
    
    <NavItem
      icon={<ProjectIcon/>}
      title={'Le projet'}
      to={ '/page/project' }/>

    <NavItem
      icon={<AboutIcon/>}
      to={'/page/about'}
      title={'À propos'} />

    <NavItem
      icon={<ContributeIcon/>}
      to={'/page/contribute'}
      title={'Participer'} />
  </Nav>
);

export default NavbarTabs;
