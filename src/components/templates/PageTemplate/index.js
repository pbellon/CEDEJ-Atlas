import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import { size } from 'styled-theme';
import { navbar } from 'utils/styles'; 
import {
  Navbar,
  Sidebar,
  SidebarToggleButton,
  AtlasFilters,
  SidebarMenu,
  PartnersLogo,
} from 'components';

const Holder = styled.div`
  max-height:100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom:0;
  left: 0;
  right: 0;
  overflow: hidden;
`;

const ContainerHolder = styled.div`
  position: absolute;
  top: ${navbar.height}px;
  right:0px;
  left: 0px;
  bottom:0px;
  z-index: ${({ zIndex = 0 }) => zIndex};
`;

const Container = styled.div`
  position:absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  min-height: 100%;
  max-height: 100%;
  overflow: hidden;
  &:before {}
`;

const MapFilters = ()=>(
  <div>
    <SidebarToggleButton />
    <AtlasFilters />
  </div>
);

const AppTemplate = ({ children }) => (
  <Holder>
    <Navbar/>
    <ContainerHolder>
      <Container>
        { children }
      </Container>
    </ContainerHolder>

    <Sidebar zIndex={10}>
      <div>
        <Route path={'/map'}
          children={({match})=> match ? <MapFilters/> : <PartnersLogo /> }/>
      </div>
      <SidebarMenu />
    </Sidebar>
  </Holder>
);

AppTemplate.propTypes = {
  children: PropTypes.node,
};

export default AppTemplate;
