import React from 'react';

import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Side = styled.div`
  position: absolute;
  top: 0px;
  transition: right .5s ease-out;
  width: ${(props)=>(props.width)}px;
  right: ${(props)=>(props.opened ? 0 : -props.width)}px;
`;

const Sidebar = ()=>{
  return (
    <Side opened={ true } width={ 300 }>
      <Link to={ '/page/about' }>À propos</Link>
    </Side>
  );
};
export default Sidebar;
