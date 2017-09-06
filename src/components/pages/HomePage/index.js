import React from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components'; 

import { MarkdownContent, Button as _Button, LoadingIcon } from 'components';
import { ContentContainer } from 'containers';
import { fromAtlas } from 'store/selectors'; 

import Background from './background.png';
const Centered = styled.div`
  display: flex;
  justify-content: center; 
`;
const Button = styled(_Button)`
  height: auto;
  min-height: 2.5em;
  color: white !important;
  &:hover {
    text-decoration: none !important;
  }
`;

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
    background: rgba(255,255,255,0.8);
  }
`;

const LoadingHolder = styled.span`
  padding: 0.5rem 0;
  display: block;
`;

const HomePage = ({isLoading}) => {
  return (
    <div>
      <AtlasBackground />
      <ContentContainer verticalAlign={true} style={{zIndex: 10}}>
        <ReactMarkdown source={ MarkdownContent.Home }/>
        <Centered>
          <Button to='/map'>
            { isLoading && (
              <LoadingHolder>
                <LoadingIcon reverse={true}/>Chargement de la carte
              </LoadingHolder>
            )}
            { !isLoading && (
              <span>Démarrer</span>
            )}
          </Button>
        </Centered>
      </ContentContainer>
    </div>
  );
};

const mapStateToProps = state => ({
  isLoading: fromAtlas.isRendering(state)
});

export default connect(mapStateToProps)(HomePage);
