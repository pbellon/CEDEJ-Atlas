import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { injectGlobal, ThemeProvider } from 'styled-components';

import { HomePage, ContentPage, PageTemplate } from 'components';
// https://github.com/diegohaz/arc/wiki/Styling
import theme from './themes/default';

injectGlobal`
  body {
    margin: 0;
  }
  html, body, div, *{
    box-sizing: border-box;
  }
`;

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <PageTemplate>
        <Route path="/" component={HomePage} exact />
        <Route path="/page" component={ContentPage}/>
      </PageTemplate>
    </ThemeProvider>
  );
};

export default App;
