import React from 'react';
import styled from 'styled-components';

import { Navbar, Sidebar } from 'components'; 
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

    <Sidebar width={ 300 } zIndex={ 10 } top={ 50 }/>
  </div>
);

export default AppTemplate;
