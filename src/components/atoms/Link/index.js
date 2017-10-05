import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { font, palette } from 'styled-theme';
import { Link as RouterLink } from 'react-router-dom';

export const styles = css`
  font-family: ${font('primary')};
  text-decoration: none;
  font-weight: 500;
  color: ${palette({ grayscale: 0 }, 1)};

  &:hover {
    text-decoration: underline;
  }

  &.active {
    color: ${palette({ primary: 0 }, 1)};
  }
`;

const StyledLink = styled(({ theme, reverse, palette, ...props }) =>
  <RouterLink {...props} />
)`${styles}`;

const Anchor = styled.a`${styles}`;

const Link = ({ to, nodeKey, href, literal, ...props }) => {
  let _to = to;
  if(href && href.startsWith('/')){
    _to = href;
  }
  if (_to) {
    return <StyledLink to={ _to } {...props} />
  }
  return <Anchor href={href} {...props} />
};

Link.propTypes = {
  nodeKey: PropTypes.any,
  palette: PropTypes.string,
  reverse: PropTypes.bool,
  to: PropTypes.string,
};

Link.defaultProps = {
  palette: 'primary',
};

export default Link;
