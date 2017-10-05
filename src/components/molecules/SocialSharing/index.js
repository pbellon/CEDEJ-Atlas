import React from 'react';
import styled from 'styled-components';
import { navbar } from 'utils/styles';
import {
  FACEBOOK_APP_ID,
  FACEBOOK_SDK_VERSION,
  TWEET_INTENT_URL,
  TWEET_TEXT,
  TWEET_HASHTAGS,
} from 'utils/constants';

import FacebookProvider, { Share } from 'react-facebook';
import { FacebookIcon, TwitterIcon } from 'components';

const getCurrentHref = () => window.location.href;

const Holder = styled.div`
  display: flex;
  height: ${navbar.height}px; 
  justify-content: space-around;
  align-items: center;
  padding: 0 50px;
`;

const twitterHref = () => {
  const url = getCurrentHref();
  return `${TWEET_INTENT_URL}?text=${
    encodeURIComponent(TWEET_TEXT)
  }&url=${
    encodeURIComponent(url)
  }&hashtags=${TWEET_HASHTAGS}`;
};

const openModal = (href, w, h) => {
  const ww = window.innerWidth;
  const wh = window.innerHeight;
  const wstyle = `
  height=${h},width=${w},top=${(wh / 2) - (h / 2)},left=${(ww / 2) - (w / 2)},
    toolbar=0,location=0
  `;
  window.open(href, name, wstyle);
};

const shareTwitter = () => {
  const href = twitterHref();
  openModal(href, 600, 320);
};

const SocialSharing = () => (
  <Holder>
    <FacebookProvider
      appId={FACEBOOK_APP_ID}
      version={FACEBOOK_SDK_VERSION}
    >
      <Share>
        <FacebookIcon width={25} height={25} />
      </Share>
    </FacebookProvider>
    <TwitterIcon onClick={shareTwitter} width={25} height={25} />
  </Holder>
);

export default SocialSharing;
