import React from 'react';
import styled from 'styled-components';
import { navbar } from 'utils/styles';
import { FACEBOOK_APP_ID } from 'utils/constants';
import FacebookProvider, { Share } from 'react-facebook';
import { FacebookIcon, TwitterIcon } from 'components';

const Holder = styled.div`
  display: flex;
  height: ${navbar.height}px; 
  justify-content: space-around;
  align-items: center;
  padding: 0 50px;
`;

const SocialSharing = ()=>(
  <Holder>
    <FacebookProvider appId={FACEBOOK_APP_ID}>
      <Share>
        <FacebookIcon width={25} height={25}/>
      </Share>
    </FacebookProvider>
    <TwitterIcon width={25} height={25}/>
  </Holder>
);

export default SocialSharing;
