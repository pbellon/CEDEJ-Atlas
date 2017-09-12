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
  PartnersLogo,
} from 'components';

const ContainerHolder = styled.div`
  position: fixed;
  top: ${navbar.height}px;
  right:0px;
  left: 0px;
  bottom:0px;
  z-index: ${({ zIndex = 0 }) => zIndex};
  overflow: visible;
`;

const Container = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  overflow: hidden;
  bottom: 0;
  top: 0;
`;


const AppTemplate = ({ children }) => (
  <div className="page-template">
    <Navbar/>
    <ContainerHolder>
      <Container>
        { children }
      </Container>
    </ContainerHolder>
  </div>
);

AppTemplate.propTypes = {
  children: PropTypes.node,
};

export default AppTemplate;
