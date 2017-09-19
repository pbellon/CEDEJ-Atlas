import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Markdown from 'react-markdown';

import { MarkdownContent } from 'components'

const Holder = styled.div`
  margin-top: 1em;
`;

const MoreInfoTitle = ()=><span>À propos de la légende</span>

const LegendMoreInfos = ({opened, show, hide}) => (
  <Holder>
    <Markdown source={ MarkdownContent.LegendInfos }/>
  </Holder>
);

export default LegendMoreInfos;
