import React from 'react';

import { Route, Redirect } from 'react-router-dom';
import { ContentContainer } from 'containers';
import { Markdown } from 'components';
import { About, Project, Contribute } from 'content';

const content = {
  about: About,
  project: Project,
  contribute: Contribute,
};

const ContentPage = ({ pageName }) => {
  const md = content[pageName];
  if (!md) {
    return <Redirect to='/map' />;
  } else {
    return (
      <ContentContainer>
        <Markdown source={md.localized()} />
      </ContentContainer>
    );
  }
};

export default ContentPage;
