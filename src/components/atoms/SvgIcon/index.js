import React from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const Svg = styled.svg`
  cursor: pointer;
  & path {
    fill: ${palette('grayscale', 1)};
    transition: fill .2s ease;
    &:hover {
      fill: ${palette('primary', 0)};
    }
  }
`;

const SvgIcon = ({ children, ...props })=>(
  <Svg {...props}>
    { children }
  </Svg>
);

export default SvgIcon;
