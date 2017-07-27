import React from 'react';

import { Switch, Route } from 'react-router-dom';
import { ContentContainer } from 'containers';
import { Content } from 'components';
import ReactMarkdown from 'react-markdown';


const ContentPage = ({match}) => {
  return (
    <ContentContainer>
      <h1>Content</h1>
      <Route match={'/page/about'} render={()=>(
        <ReactMarkdown source={Content.About}/>
        )}/>
    </ContentContainer>
  ); 

};

export default ContentPage;
