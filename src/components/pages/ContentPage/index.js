import React from 'react';

import { Route, Redirect } from 'react-router-dom';
import { ContentContainer } from 'containers';
import { MarkdownContent, Markdown } from 'components';

const content = {
  about: MarkdownContent.About,
  project: MarkdownContent.Project,
  // contribute: MarkdownContent.Contribute,
};

const ContentPage = () => {
  return (
    <ContentContainer>
      <Route
        path={'/page/:pageName'}
        render={({ match }) => {
          const md = content[match.params.pageName];
          let res;
          if (!md) {
            res = <Redirect to={'/map'} />;
          } else {
            res = <Markdown source={content[match.params.pageName]} />;
          }
          return res;
        }}
      />
    </ContentContainer>
  );
};

export default ContentPage;
