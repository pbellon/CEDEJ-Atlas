import React from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Navbar, Sidebar, Button, Link } from 'components'

import { toggleSidebar as _toggleSidebar } from 'store/actions'; 
import { fromSidebar } from 'store/selectors';

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
      <Route path={ '/map' } render={()=>(
        <Button onClick={ toggleSidebar }>{ sidebarOpened ? '>' : '<' }</Button>
      )}/>
      <Link to={ '/page/about' }>À propos</Link>
    </Sidebar>
    </div>
);

const mapStateToProps = (state = fromSidebar.initialState)=>({
  sidebarOpened: fromSidebar.isOpened(state)
});

const mapDispatchToProps = (dispatch)=>({
  toggleSidebar:()=>(dispatch(_toggleSidebar()))
}); 

export default connect(mapStateToProps, mapDispatchToProps)(AppTemplate);
