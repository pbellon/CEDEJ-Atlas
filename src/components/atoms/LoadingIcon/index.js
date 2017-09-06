import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

import { palette } from 'styled-theme'; 


// took from http://tobiasahlin.com/spinkit/
const bounce = keyframes`
0%, 80%, 100% {
  transform: scale(0);
} 40% {
  transform: scale(1.0);
}
`;

const Spinner = styled.div`
  text-align: center;
  width: 100%;
`;

const color = (reverse)=>reverse?'white':palette('primary', 0)

const Dot = styled.div`
  width: 1em;
  height: 1em;
  background-color: ${({reverse})=>color(reverse)};
  border-radius: 100%;
  display: inline-block;
  animation: ${bounce} 1.4s infinite ease-in-out both;
  animation-delay: ${({delay=0})=>delay}s;
`;

const LoadingIcon = ({reverse})=>(
  <Spinner>
    <Dot reverse={reverse} delay={-0.32}/>
    <Dot reverse={reverse} delay={ -0.16}/>
    <Dot reverse={reverse} />
  </Spinner>
);

LoadingIcon.propTypes = {
  reverse: PropTypes.bool
};

LoadingIcon.defaultProps = {
  reverse: false
};

export default LoadingIcon;
