import React from 'react';
import styled from 'styled-components';
import { sidebar, navbar } from 'utils/styles';

import { PartnersLogo } from 'components';

const FixedBar = styled.div`
  position: fixed;
  width: ${sidebar.width}px;
  top:${navbar.height}px;
  bottom:0;
  right:${({visible})=>visible?0:-400}px;
  z-index: 1000;
  transition-delay: ${({visible})=>visible?.33:0}s;
  transition-duration: ${({visible})=>visible?.33:0}s;
  transition-property: right;
  transition-timing-function: ease-in-out;
  & > div {
    padding-top: 50px;
    padding-bottom: 50px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
`;

const FixedPartnersLogo = (props)=>(
  <FixedBar {...props}> 
    <PartnersLogo/>
  </FixedBar>
);

export default FixedPartnersLogo;

