import React from 'react';
import styled from 'styled-components';

const Holder = styled.div`
  display: flex;
`;


const Placeholder = styled.div`
  width: 300px;
  flex-grow: 0;
  flex-shrink: 0;
`;

const Content = styled.div`
  padding-left: 15px;
  padding-right: 15px;
`;

const ContentContainer = ({ children })=>(
  <Holder>
    <Content>{ children }</Content>
    <Placeholder/>
  </Holder>
);
export default ContentContainer;
