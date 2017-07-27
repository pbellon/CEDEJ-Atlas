import React from 'react';
import PropTypes from 'prop-types';
import { Route, Link } from 'react-router-dom';
import { Button } from 'components';
import styled from 'styled-components';

const Nav = styled.div`
  background:#bbb;
  padding-left: 15px;
  padding-right: 15px;
  height: ${(props)=>(props.height)}px;
  z-index: ${(props)=>(props.zIndex)};
  position: fixed;
  line-height: ${({height})=>height}px;
  top: 0px;
  left:0px;
  right: 0px;
`;

const NavRight = styled.div`
  float: right;
`;

const Navbar =(props) => (
  <Nav {...props}>
    <Link to="/">Atlas des zones arides</Link>
    <Route match="/map" exact render={()=>(
      <NavRight>
        <Button disabled={true}>EXPORTER</Button>
      </NavRight>
    )}/>
  </Nav>      
);

Navbar.propTypes = {
  height: PropTypes.number,
  zIndex: PropTypes.number
};

Navbar.defaultProps = {
  height: 50,
  zIndex: 10 
};

export default Navbar;
