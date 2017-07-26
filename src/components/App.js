import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { injectGlobal, ThemeProvider } from 'styled-components';

import { HomePage, ContentPage, Navbar, Sidebar } from 'components';

// https://github.com/diegohaz/arc/wiki/Styling
import theme from './themes/default';

injectGlobal`
  body {
    margin: 0;
  }
`;

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <div>  
        <Navbar/>
        <Route path="/" component={HomePage} exact />
        <Route path="/page" component={ContentPage}/>
        <Sidebar/>
      </div>
    </ThemeProvider>
  );
};

export default App;
