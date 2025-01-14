import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { ifProp } from 'styled-tools';

import * as icons from './icons';

export const fontSize = ({ height }) => height ? `${height / 16}rem` : '1.25em';

const Wrapper = styled.span`
  display: inline-block;
  font-size: ${fontSize};
  color: ${ifProp('palette', palette({ grayscale: 0 }, 1), 'currentcolor')};
  width: 1em;
  height: 1em;
  margin: 0.1em;
  box-sizing: border-box;

  & > svg {
    width: 100%;
    height: 100%;
    fill: currentcolor;
    stroke: currentcolor;
  }
`;

const Icon = ({ icon, ...props }) => {
  const SvgIcon = icons[icon];

  return <Wrapper {...props}><SvgIcon /></Wrapper>;
};

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  height: PropTypes.number,
  palette: PropTypes.string,
  reverse: PropTypes.bool,
};

export default Icon;
