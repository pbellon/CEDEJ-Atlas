import React from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';
import { MarkdownContentContainer } from 'containers';
import { MarkdownContent } from 'components';
import ReactMarkdown from 'react-markdown';

const content = {
  'about': MarkdownContent.About,
  'project': MarkdownContent.Project,
  'contribute': MarkdownContent.Contribute
}

const MarkdownContentPage = ({match}) => {
  return (
    <MarkdownContentContainer>
      <Route path={'/page/:pageName'} render={({match})=>{
        const md = content[match.params.pageName];
        if(!md){
          return <Redirect to={ '/map'}/>
        } else {
          return (<ReactMarkdown source={content[match.params.pageName]}/>);
        }
      }}/>
    </MarkdownContentContainer>
  ); 

};

export default MarkdownContentPage;
