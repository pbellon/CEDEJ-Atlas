import React from 'react';
import styled from 'styled-components';
import { sidebar, navbar } from 'utils/styles';

import { PartnersLogo } from 'components';

const FixedBar = styled.div`
  position: fixed;
  width: ${sidebar.width}px;
  top:${navbar.height}px;
  bottom:0;
  right:${({ visible }) => visible ? 0 : -400}px;
  z-index: 1000;
  transition-delay: ${({ visible }) => visible ? 0.33 : 0}s;
  transition-duration: ${({ visible }) => visible ? 0.33 : 0}s;
  transition-property: right;
  transition-timing-function: ease-in-out;
  display: flex;
  align-items:center;
  flex-direction: column;
  justify-content: space-around;
  & > div {
    max-height: 900px;
    flex-grow: 1;
    display: flex;
    justify-content: space-between;
    padding-top: 50px;
    padding-bottom: 50px;
  }
`;

const FixedPartnersLogo = (props) => (
  <FixedBar {...props}> 
    <PartnersLogo />
  </FixedBar>
);

export default FixedPartnersLogo;

