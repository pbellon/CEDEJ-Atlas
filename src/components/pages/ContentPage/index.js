import React from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';
import { ContentContainer } from 'containers';
import { Content } from 'components';
import ReactMarkdown from 'react-markdown';

const content = {
  'about': Content.About,
  'project': Content.Project,
  'contribute': Content.Contribute
}

const ContentPage = ({match}) => {
  return (
    <ContentContainer>
      <Route path={'/page/:pageName'} render={({match})=>{
        const md = content[match.params.pageName];
        if(!md){
          return <Redirect to={ '/map'}/>
        } else {
          return (<ReactMarkdown source={content[match.params.pageName]}/>);
        }
      }}/>
    </ContentContainer>
  ); 

};

export default ContentPage;
