import React from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components'; 

import { MarkdownContent, Button } from 'components';
import { ContentContainer } from 'containers';
import Background from './background.png';

const AtlasBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('${Background}');
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 5;
  &:before {
    content: ' ';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 6;
    background: rgba(255,255,255,0.5);
  }
`;

const HomePage = () => {
  return (
    <div>
      <AtlasBackground />
      <ContentContainer style={{position: 'relative', zIndex: 10}}>
        <ReactMarkdown source={ MarkdownContent.Home }/>
        <Button to='/map'>GO</Button>
      </ContentContainer>
    </div>
  );
};

export default HomePage;
