import React from 'react';
import styled from 'styled-components';
import { sidebar, navbar } from 'utils/styles';

import { PartnersLogo } from 'components';

const FixedBar = styled.div`
  position: fixed;
  width: ${sidebar.width}px;
  top:${navbar.height}px;
  bottom:0;
  right:0;
  z-index: 1000;
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

const FixedPartnersLogo = ()=>(
  <FixedBar> 
    <PartnersLogo/>
  </FixedBar>
);

export default FixedPartnersLogo;

