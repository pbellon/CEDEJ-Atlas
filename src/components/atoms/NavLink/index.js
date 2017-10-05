import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { palette } from 'styled-theme';

import { styles } from '../Link';

const StyledNavLink = styled(({ theme, reverse, palette, ...props }) =>
  <RouterNavLink exact activeClassName={'active'} {...props} />
)`
  ${styles}
  display:block;
  background-color:${palette('grayscale', 0)};
  padding: 0 15px;
  color: white;
  transition: background .2s ease;
  &.active {
    background-color: ${palette('primary', 2)};
    color: white;
    cursor: default;
  }
  &:hover {
    text-decoration: none;
  }
  &:hover:not(.active) {
    background: ${palette('grayscale', 1)};
  }
`;


const NavLink = ({ ...props }) => {
  return <StyledNavLink {...props} />;
};

NavLink.propTypes = {
  palette: PropTypes.string,
  reverse: PropTypes.bool,
  to: PropTypes.string.isRequired,
};

NavLink.defaultProps = {
  palette: 'primary',
};

export default NavLink;
