import React from 'react';

import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Side = styled.div`
  position: fixed;
  top: ${({top})=>top}px;
  z-index: ${(props)=>(props.zIndex || 0)};
  padding: 15px;
  bottom: 0px;
  background: #aaa;
  transition: right .5s ease-out;
  width: ${({width})=>width}px;
  right: ${({opened, width})=>(opened ? 0 : -width)}px;
`;

const Sidebar = (props)=>{
  return (
    <Side {...props}>
      <Link to={ '/page/about' }>À propos</Link>
    </Side>
  );
};
export default Sidebar;
