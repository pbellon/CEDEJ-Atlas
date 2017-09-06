import React from 'react';
import styled from 'styled-components';

import { FacebookIcon, TwitterIcon } from 'components';

const Holder = styled.div`
  display: flex;
  padding: 15px 50px;
  justify-content: space-around;
`;

const SocialSharing = ()=>(
  <Holder>
    <FacebookIcon width={30} height={30}/>
    <TwitterIcon width={30} height={30}/>
  </Holder>
);

export default SocialSharing;
