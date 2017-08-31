import React from 'react';
import ReactMarkdown from 'react-markdown';
import { MarkdownContent, Button } from 'components';
import { ContentContainer } from 'containers';

const HomePage = () => {
  return (
    <ContentContainer>
      <ReactMarkdown source={ MarkdownContent.Home }/>
      <Button to='/map'>GO</Button>
    </ContentContainer>
  );
};

export default HomePage;
