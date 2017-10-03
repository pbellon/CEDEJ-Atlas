import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { NavLink, HomeNavLink } from 'components';

const Blank = styled.span`
  display: inline-block;
  width: 0.5em;
`;

const Item = styled.li`
  margin:0;
  list-style: none;
  text-align: center;
`;

const IconHolder = styled.span`
  & svg {
    margin-bottom: 3px;
  }
`;

const NavItem = ({ to, icon, title, isHome}) => {
  const Link = isHome ? HomeNavLink : NavLink; 
  return (
    <Item>
      <Link to={ to }>
        <IconHolder>{icon}</IconHolder><Blank/>{title}
      </Link>
    </Item>
  );
};

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  isHome: PropTypes.bool,
};

export default NavItem;
