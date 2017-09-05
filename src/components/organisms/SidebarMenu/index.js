import React from 'react';
import { Route } from 'react-router-dom';
import AtlasIcon from 'react-icons/lib/md/public';
import AboutIcon from 'react-icons/lib/md/assignment';
import ContributeIcon from 'react-icons/lib/md/comment'; 
import { palette } from 'styled-theme';
import styled, { css } from 'styled-components';

import { NavLink } from 'components';

const ItemColor = ({active})=>{
  return active ? palette('primary', 1) : palette('grayscale', 1);
};
const activeLinkStyle = {
  color: palette('white', 1)
};

const LiStyle = css`
  background-color:${palette('grayscale', 1)};
  margin:0;
  font-size: 0.9rem; 
  display:block;
  padding:12px;
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

const MenuItem = styled((props) => 
  <NavLink { ...props }/>
)`${LiStyle}`;

const Menu = styled.div``;


const SidebarMenu = ()=>(
  <Menu>
    <MenuItem
      to={ '/map' }><AtlasIcon/> Atlas</MenuItem>
    <MenuItem
      icon={ AboutIcon }
      to={ '/page/about' }><AboutIcon/> À propos</MenuItem>
    <MenuItem 
      icon={ ContributeIcon }
      to={ '/page/contribute' }><ContributeIcon/> Contribuez</MenuItem>
  </Menu>
)
export default SidebarMenu;
