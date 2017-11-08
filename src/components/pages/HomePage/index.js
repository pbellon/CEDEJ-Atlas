import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { font, palette } from 'styled-theme';
import {
  Content as GenericContent,
  Button as _Button,
  LoadingIcon,
  PartnersLogo,
  Markdown,
  Heading,
  Bold,
} from 'components';
import { fromAtlas } from 'store/selectors';

import Background from './background.png';

const HomeTitleDescription = 'Un portail élaboré par le [CEDEJ](http://cedej-eg.org/), une unité mixte française de recherche à l’étranger du [CNRS](http://www.cnrs.fr/) et du [Ministère de l\'Europe et des Affaires étrangères](http://www.diplomatie.gouv.fr/fr/)';


const HomeActionText = '**CRÉER votre carte personnalisée des zones arides  \n CONTRIBUER à l’actualisation de la base de données sur l’aridité**';

const Centered = styled.div`
  text-align: center;
  & p {
    text-align: center !important;
  }
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

const Holder = styled.div`
  font-family: ${font('primary')};
  position: absolute;
  max-width: 60%;
  margin: auto;
  left: 0;
  right: 0;
  top: 2em;
  bottom: 2em;
  z-index: 10;
  @media (max-width: 1200px){
    max-width: 80%;
  }

`;

const Top = styled.div`
  position: absolute;
  z-index: 11;
  top: 0;
  left: 0;
  right:0;

`;
const Bottom = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right:0;
`;
const BottomBar = styled.div`
  height: 100px;
  bottom: 0;
  position: absolute;
  left:0;
  right: 0;
  max-with: 500px;
  margin: auto;
`;
const Left = styled.div`
  position: absolute;
  left: 0;
`;

const Center = styled.div`
  position: absolute;
  left: 0;
  right: 0;
`;

const Copyright = styled.div`
  left: 6.75em;
  position: absolute;
  z-index: 200;
  bottom: 3.6em;
  font-family: ${font('primary')};
`;

const TitleHolder = styled.div`
  display:flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  left: 6.75em;
  top: 2em;
  font-family: ${font('primary')};
  z-index: 200;

`;

const MainTitle = styled(Heading)`
  display: block;
  width: 195px;
  font-size: 3em !important;
  line-height: 0.85em;
  margin: 0 !important;
  border-right: 2px solid ${palette('grayscale', 2)};
  text-transform: uppercase;
  & .grey {
    color: ${palette('grayscale', 2)};
  }
`;

const MainDescription = styled(Markdown)`
  width: 300px;
  font-size: 1.1em;
  padding-left: 1em;
`;

const HomeTitle = () => (
  <TitleHolder>
    <MainTitle level={1}>Aridity <span className={'grey'}>World</span> Map</MainTitle>
    <MainDescription source={HomeTitleDescription} />
  </TitleHolder>
);

const Content = styled(GenericContent)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const Middle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;


const HomePage = ({ isLoading, match}) => {
  return (
    <div>
      <AtlasBackground />
      <HomeTitle />
      <Copyright>
        <Bold>© CEDEJ - 2017</Bold>
      </Copyright>
      <Holder>
        <Content>
          <Middle>
            <Centered>
              <Markdown source={HomeActionText} />
              <Button to={`${match.url}map`}>
                { isLoading && (
                  <LoadingHolder>
                    <LoadingIcon reverse />Chargement de la carte
                  </LoadingHolder>
                )}
                { !isLoading && (
                  <span>Démarrer</span>
                )}
              </Button>
            </Centered>
          </Middle>
          <BottomBar>
            <Center style={{ maxWidth: '500px', margin: 'auto' }}>
              <PartnersLogo height={'120px'} horizontal />
            </Center>
          </BottomBar>
        </Content>
      </Holder>
    </div>
  );
};

HomePage.propTypes = {
  isLoading: PropTypes.bool,
};

const mapStateToProps = state => ({
  isLoading: fromAtlas.isRendering(state),
});

export default connect(mapStateToProps)(HomePage);
