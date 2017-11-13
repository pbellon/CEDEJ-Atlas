import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { navbar, sidebar } from 'utils/styles';

import { SocialSharing, NavbarTabs, ChangeLanguageLink } from 'components';

const Nav = styled.div`
  background:${palette('grayscale', 0)};
  height: ${navbar.height}px;
  z-index: ${(props) => props.zIndex};
  position: fixed;
  line-height: ${navbar.height}px;
  top: 0px;
  left:0px;
  right: 0px;
  clear: both;
`;

const NavRight = styled.div`
  float: right;
  width: ${sidebar.width}px;
  display: flex;
  padding-right: 10px;
`;

const NavLeft = styled.div`
  display: flex;
  float: left;
`;

const Navbar = (props) => (
  <Nav {...props}>
    <NavLeft>
      <NavbarTabs match={props.match}/>
    </NavLeft>
    <NavRight>
      <SocialSharing />
      <ChangeLanguageLink />
    </NavRight>
  </Nav>
);

Navbar.propTypes = {
  height: PropTypes.number,
  zIndex: PropTypes.number,
};

Navbar.defaultProps = {
  height: navbar.height,
  zIndex: 10,
};

export default Navbar;
