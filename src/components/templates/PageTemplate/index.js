import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import styled from 'styled-components';

import {
  Navbar,
  Sidebar,
  SidebarToggleButton,
  AtlasFilters,
  SidebarMenu,
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
  top: 50px;
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


const AppTemplate = ({ children }) => (
  <Holder>
    <Navbar/>
    <ContainerHolder>
      <Container>
        { children }
      </Container>
    </ContainerHolder>

    <Sidebar width={300} zIndex={10} top={50}>
      <div>
        <Route path={'/map'} render={()=>(
          <div>
            <SidebarToggleButton />
            <AtlasFilters />
          </div>
        )}/>
      </div>
      <SidebarMenu />
    </Sidebar>
  </Holder>
);

AppTemplate.propTypes = {
  children: PropTypes.node,
};

export default AppTemplate;
