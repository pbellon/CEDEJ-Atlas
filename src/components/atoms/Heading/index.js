import React from 'react';
import PropTypes from 'prop-types';

import styled, { css } from 'styled-components';
import { font, palette } from 'styled-theme';

export const fontSize = ({ level }) => `${0.75 + (1 * (1 / level))}rem`;

const styles = css`
  text-transform: ${({ uppercase })=>uppercase?'uppercase':'none'};
  font-family: ${font('primary')};
  font-weight: 500;
  font-size: ${fontSize};
  margin: 0;
  margin-top: 0.55714em;
  margin-bottom: 0.27142em;
  color: ${palette({ grayscale: 0 }, 1)};
`;

const Heading = styled(({ level, children, reverse, palette, theme, uppercase, ...props }) =>
  React.createElement(`h${level}`, props, children)
)`${styles}`;

Heading.propTypes = {
  uppercase: PropTypes.bool,
  level: PropTypes.number,
  children: PropTypes.node,
  palette: PropTypes.string,
  reverse: PropTypes.bool,
};

Heading.defaultProps = {
  level: 1,
  palette: 'grayscale',
  uppercase: false,
};

export default Heading;
