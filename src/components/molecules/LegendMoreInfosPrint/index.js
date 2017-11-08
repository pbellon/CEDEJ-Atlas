import React from 'react';
import { translate } from 'react-i18next';
import styled from 'styled-components';
import Markdown from 'react-markdown';

import { Heading } from 'components';
import formats from 'utils/formats';
import { LegendInfos } from 'content';

const Holder = styled.div`
  margin-top: 1em;
  padding: 15px;
  max-width: ${formats.A4px[1]}px
`;

const Bold = styled.span`
  font-weight: bold;
`;

const LegendMoreInfosPrint = ({ t }) => (
  <Holder>
    <Heading level={2}>
      <Bold>{ t('moreInfos.title') }</Bold>
    </Heading>
    <Markdown source={LegendInfos.localized()} />
  </Holder>
);

export default translate('legend')(LegendMoreInfosPrint);
