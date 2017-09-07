import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { Button, Link } from 'components';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { navbar, sidebar } from 'utils/styles';
const Nav = styled.div`
  background:${palette('grayscale', 0)};
  padding-left: 15px;
  padding-right: 15px;
  height: ${navbar.height}px;
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

const ExportButton = styled(Button)`
  height: ${navbar.height}px;
  line-height: ${navbar.height}px;
  text-transform: uppercase;
  width: ${sidebar.width}px;
  position: absolute;
  right: 0;
`;

const Navbar =(props) => (
  <Nav {...props}>
    <Link style={{color: 'white'}} reverse={true} to="/">Atlas mondial des zones arides</Link>
    <Route path={ '/map' } render={ () => (
      <NavRight>
        <ExportButton
          reverse={true} disabled={true}>
          Exporter
        </ExportButton>
      </NavRight>
    ) }/>
  </Nav>      
);

Navbar.propTypes = {
  height: PropTypes.number,
  zIndex: PropTypes.number
};

Navbar.defaultProps = {
  height: navbar.height,
  zIndex: 10 
};

export default Navbar;
