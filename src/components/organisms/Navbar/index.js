import React from 'react';
import { Route, Link } from 'react-router-dom';
import { Button } from 'components';
import styled from 'styled-components';

const Nav = styled.div`
  background:#bbb;
  padding-left: 15px;
  padding-right: 15px;
  height: ${(props)=>(props.height)}px;
  z-index: ${(props)=>(props.zIndex || 9)};
  position: fixed;
  line-height: ${({height})=>height}px;
  top: 0px;
  left:0px;
  right: 0px;
`;

const NavRight = styled.div`
  float: right;
`;

export default (props) => (
  <Nav {...props}>
    <Link to="/">Atlas des zones arides</Link>
    <Route match="/" exact render={()=>(
      <NavRight>
        <Button disabled={true}>EXPORTER</Button>
      </NavRight>
    )}/>
  </Nav>      
);
