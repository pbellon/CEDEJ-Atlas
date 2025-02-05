import React from 'react';
import { Route } from 'react-router-dom';

import styled, {
  injectGlobal,
  ThemeProvider,
} from 'styled-components';
import {
  HomePage,
  ContentPage,
  PageTemplate,
  FixedPartnersLogo,
  SmallScreensWarning,
  TutorialModal,
  ExportModal,
} from 'components';
import { Atlas } from 'containers';
// https://github.com/diegohaz/arc/wiki/Styling
import { navbar } from 'utils/styles';
import theme from './themes/default';

injectGlobal`
  body {
    margin: 0;
  }
  html, body, div, *{
    box-sizing: border-box;
  }
  a {
    cursor: pointer;
  }
  strong a {
    font-weight: bold !important;
  }
  *[data-tip] {
    cursor: help;
    position: relative;
    &:after {
      content: ' ';
      position: absolute;
      bottom: -2px;
      left: 2px;
      right: 2px;
      border-bottom: 1px dashed #BBB;

    }
  }
  span[data-tip]:after {
    left: 0;
    right:0;
  }

  h6 {
    font-size: 0.85rem !important;
  }
`;

const AtlasHolder = styled.div`
  z-index: 10;
  position: fixed;
  top: ${navbar.height}px;
  bottom: 0;
  left: 0;
  right: 0;
`;

const OverlayHolder = styled.div`
  background: rgb(255,255,255);
  top: ${navbar.height}px;
  bottom: 0px;

  position: fixed;
  width: 100%;
  overflow: auto;
  padding-bottom: 50px;
  z-index: 20;
  transition: transform .2s ease-in-out;
  transform: translate(0, ${({ visible }) => visible ? 0 : '100vh'});

`;

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <PageTemplate>
        <SmallScreensWarning />
        <ExportModal />
        <AtlasHolder className="atlas-holder">
          <Atlas />
          <Route
            path="/map"
            exact
            children={(mapProps) => (
              <TutorialModal inMap={mapProps.match != null} />
            )}
          />
        </AtlasHolder>
        <Route
          path="/"
          exact
          children={(homeProps) => {
            const inHome = homeProps.match != null;
            return (
              <OverlayHolder className="home-page-holder" visible={inHome}>
                <HomePage />
              </OverlayHolder>
            );
          }}
        />
        <Route
          path="/page"
          children={(pageProps) => {
            const inPage = pageProps.match != null;
            return (
              <div>
                <OverlayHolder className="content-page-holder" visible={inPage}>
                  { inPage && (
                    <ContentPage />
                  )}
                </OverlayHolder>
                <FixedPartnersLogo visible={inPage} />
              </div>
            );
          }}
        />
      </PageTemplate>
    </ThemeProvider>
  );
};

export default App;
