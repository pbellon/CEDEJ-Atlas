import React from 'react';
import { Route } from 'react-router-dom';

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
  background:${palette('grayscale', 3)};
  margin:0;
  display:block;
  padding:15px;
  color: ${palette('grayscale', 0)};
  &.active {
    background: ${palette('grayscale',1)};
    color: ${palette('white', 0)};
  }
  &:hover {
    text-decoration: none;
  }
  &:hover:not(.active) {
    background: ${palette('grayscale', 2)};
  }
`;

const MenuItem = styled((props) => 
  <NavLink { ...props }/>
)`${LiStyle}`;

const Menu = styled.div``;


const SidebarMenu = ()=>(
  <Menu>
    <MenuItem to={ '/map' }>Atlas</MenuItem>
    <MenuItem to={ '/page/about' }>À propos</MenuItem>
    <MenuItem to={ '/page/contribute' }>Contribuez</MenuItem>
  </Menu>
)
export default SidebarMenu;
