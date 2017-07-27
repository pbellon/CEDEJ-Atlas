import React, { PropTypes } from 'react'
import styled, { css } from 'styled-components'
import { font, palette } from 'styled-theme'
import { Link as RouterLink } from 'react-router-dom'

export const styles = css`
  font-family: ${font('primary')};
  text-decoration: none;
  font-weight: 500;
  color: ${palette({ grayscale: 0 }, 1)};

  &:hover {
    text-decoration: underline;
  }

  &.active {
    color: ${palette({primary: 0}, 1)};
  }
`

const StyledLink = styled(({ theme, reverse, palette, ...props }) =>
  <RouterLink {...props} />
)`${styles}`
const Anchor = styled.a`${styles}`

const Link = ({ ...props }) => {
  if (props.to) {
    return <StyledLink {...props} />
  }
  return <Anchor {...props} />
}

Link.propTypes = {
  palette: PropTypes.string,
  reverse: PropTypes.bool,
  to: PropTypes.string,
}

Link.defaultProps = {
  palette: 'primary',
}

export default Link
