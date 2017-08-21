import React from 'react';
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
const Holder = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255,255,255,0.8);
  z-index: 800;
  opacity: ${({ isLoading })=>isLoading?1:0};
  pointer-events: ${({isLoading})=>isLoading?'auto':'none'};
`;

const Spinner = styled.div`
  text-align: center;
  width: 100%;
`;

const Dot = styled.div`
  width: 1em;
  height: 1em;
  background-color: ${palette('primary', 0)};
  border-radius: 100%;
  display: inline-block;
  animation: ${bounce} 1.4s infinite ease-in-out both;
  animation-delay: ${({delay=0})=>delay}s;
`;



const LoadingIcon = ()=>(
  <Spinner>
    <Dot delay={-0.32}/>
    <Dot delay={ -0.16}/>
    <Dot/>
  </Spinner>
);

const LoadingIndicator = ({isLoading=false})=>(
  <Holder isLoading={ isLoading }><LoadingIcon/></Holder>
);

export default LoadingIndicator;
