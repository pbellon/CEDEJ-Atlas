import React, { PropTypes } from 'react'
import styled, { css } from 'styled-components'
import { font, palette } from 'styled-theme'
import { NavLink as RouterNavLink } from 'react-router-dom'
import { styles } from '../Link';

const StyledNavLink = styled(({ theme, reverse, palette, ...props }) =>
  <RouterNavLink activeClassName={ 'active' } {...props} />
)`${styles}`


const NavLink = ({ ...props }) => {
  return <StyledNavLink {...props} />
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
