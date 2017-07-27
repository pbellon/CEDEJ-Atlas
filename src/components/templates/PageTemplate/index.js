import React from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import { Navbar, Sidebar, SidebarToggleButton, Link } from 'components'

const Container = styled.div`
  position:relative;
  z-index: ${({zIndex=0})=>zIndex};
  top: ${({top=50})=>top}px;
`;


const AppTemplate = ({sidebarOpened, children, toggleSidebar})=>(
  <div>
    <Navbar/>
    <Container>
      { children }
    </Container>

    <Sidebar width={ 300 } zIndex={ 10 } top={ 50 }>
      <Route path={ '/map' } component={SidebarToggleButton}/>
      <Link to={ '/page/about' }>À propos</Link>
    </Sidebar>
    </div>
);


export default AppTemplate;
