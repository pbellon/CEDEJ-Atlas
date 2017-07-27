import React from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import { Navbar, Sidebar, SidebarToggleButton, SidebarMenu } from 'components'

const Container = styled.div`
  position:relative;
  z-index: ${({zIndex=0})=>zIndex};
  top: ${({top=50})=>top}px;
`;


const AppTemplate = ({children})=>(
  <div>
    <Navbar/>
    <Container>
      { children }
    </Container>

    <Sidebar width={ 300 } zIndex={ 10 } top={ 50 }>
      <Route path={ '/map' } component={SidebarToggleButton}/>
      <SidebarMenu/>
    </Sidebar>
    </div>
);


export default AppTemplate;
