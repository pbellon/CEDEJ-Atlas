import React from 'react';
import styled from 'styled-components';
import Markdown from 'react-markdown';

import { MarkdownContent, Heading } from 'components';
import formats from 'utils/formats';

const Holder = styled.div`
  margin-top: 1em;
  padding: 15px;
  max-width: ${formats.A4px[1]}px
`;

const Bold = styled.span`
  font-weight: bold;
`;

const MoreInfoTitle = () => <Bold>À propos de la légende</Bold>;

const LegendMoreInfos = () => (
  <Holder>
    <Heading level={2}><MoreInfoTitle /></Heading>
    <Markdown source={MarkdownContent.LegendInfos} />
  </Holder>
);

export default LegendMoreInfos;
