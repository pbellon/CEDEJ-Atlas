import React from 'react';
import { Route } from 'react-router-dom';

import { palette } from 'styled-theme';
import { NavLink } from 'components'; 
import styled from 'styled-components';

const ItemColor = ({active})=>{
  return active ? palette('primary', 1) : palette('grayscale', 0);
};

const Li = styled.li`
  background:${(props)=>ItemColor(props)};
  margin:0;
  padding:15px;
  list-style:none;
`;

const MenuItem = ({children, to})=>(
  <Route path={ to } children={ ({match})=>(
    <Li active={ match != null }>
      <NavLink to={ to }>{ children }</NavLink>
    </Li>
  )}/>
);

const Menu = styled.ul`
  margin: 0;
  padding:0;
  list-style:none;
`;


const SidebarMenu = ()=>(
  <Menu>
    <MenuItem to={ '/map' }>Atlas</MenuItem>
    <MenuItem to={ '/page/about' }>À propos</MenuItem>
    <MenuItem to={ '/page/contribute' }>Contribuez</MenuItem>
  </Menu>
)
export default SidebarMenu;
