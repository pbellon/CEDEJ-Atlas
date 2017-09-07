import React from 'react';
import styled from 'styled-components';

import { FacebookIcon, TwitterIcon } from 'components';

const Holder = styled.div`
  display: flex;
  padding: 10px 50px;
  justify-content: space-around;
`;

const SocialSharing = ()=>(
  <Holder>
    <FacebookIcon width={25} height={25}/>
    <TwitterIcon width={25} height={25}/>
  </Holder>
);

export default SocialSharing;
