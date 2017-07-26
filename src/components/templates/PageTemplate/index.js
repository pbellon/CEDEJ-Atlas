import React from 'react';
import styled from 'styled-components';

import { Navbar, Sidebar } from 'components'; 
const Container = styled.div`
  position:relative;
  z-index: ${({zIndex})=>zIndex};
  top: ${({top})=>(top)}px;
`;


const AppTemplate = ({children})=>(
  <div>
    <Navbar zIndex={ 20 } height={ 50 }/>
    <Container top={ 50 } zIndex={ 0 }>
      { children }
    </Container>

    <Sidebar opened={ true } width={ 300 } zIndex={ 10 } top={ 50 }/>
  </div>
);

export default AppTemplate;
