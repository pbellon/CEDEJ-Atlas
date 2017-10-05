import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const Svg = styled.svg`
  cursor: pointer;
  & path {
    fill: ${palette('white', 0)};
    transition: fill .2s ease;
  }
  &:hover path {
    fill: ${palette('primary', 0)};
  }
`;

const SvgIcon = ({ children, ...props }) => (
  <Svg {...props}>
    { children }
  </Svg>
);

SvgIcon.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

export default SvgIcon;
