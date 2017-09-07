import React from 'react';
import styled from 'styled-components';
import { navbar } from 'utils/styles'; 

import { FacebookIcon, TwitterIcon } from 'components';

const Holder = styled.div`
  display: flex;
  height: ${navbar.height}px; 
  justify-content: space-around;
  align-items: center;
`;

const SocialSharing = ()=>(
  <Holder>
    <FacebookIcon width={25} height={25}/>
    <TwitterIcon width={25} height={25}/>
  </Holder>
);

export default SocialSharing;
