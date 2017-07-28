import React from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import { Navbar, Sidebar, SidebarToggleButton, SidebarMenu } from 'components'

const Holder = styled.div`
  max-height:100%;
  position: absolute;
  top: 0;
  bottom:0;
  left: 0;
  right: 0;
  overflow: hidden;
`;

const Container = styled.div`
  position:absolute;
  z-index: ${({zIndex=0})=>zIndex};
  top: ${({top=50})=>top}px;
  bottom: 0;
  left: 0;
  right: 0;
`;


const AppTemplate = ({children})=>(
  <Holder>
    <Navbar/>
    <Container>
      { children }
    </Container>

    <Sidebar width={ 300 } zIndex={ 10 } top={ 50 }>
      <div><Route path={ '/map' } component={SidebarToggleButton}/></div>
      <SidebarMenu/>
    </Sidebar>
  </Holder>
);


export default AppTemplate;
