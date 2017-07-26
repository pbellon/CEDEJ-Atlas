import React from 'react';
import { Route, Link } from 'react-router-dom';
import { Button } from 'components';
import styled from 'styled-components';

const Nav = styled.div`
  background:#bbb;
  padding: 15px;
`;

const NavRight = styled.div`
  float: right;
`;

export default () => (
  <Nav>
    <Link to="/">Atlas des zones arides</Link>
    <Route match="/" exact render={()=>(
      <NavRight>
        <Button disabled={true}>EXPORTER</Button>
      </NavRight>
    )}/>
  </Nav>      
);
