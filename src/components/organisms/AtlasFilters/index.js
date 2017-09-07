import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components'; 

import {
  LayerFilterGroup,
  AridityFilters,
  TemperaturesFilters,
  DryFilters,
  Heading,
} from 'components';
import { fromSidebar } from 'store/selectors';
// import { fromLayers } from 'store/selectors';

const Container = styled.div`
  padding: 0 15px;
  transition: opacity .5s ease;
  opacity: ${({visible})=>visible?1:0};
  pointer-events:${({visible})=>visible?'auto':'none'};
`;

const AtlasFilters = ({visible})=>(
  <Container visible={visible}>
    <Heading level={3} style={{marginBottom: '0.1rem', fontWeight:'bold'}}>Personnaliser la carte</Heading>
    <LayerFilterGroup layer={ 'temperatures' } 
      heading={'Aridité et températures'}>
      <AridityFilters/>
      <TemperaturesFilters/>
    </LayerFilterGroup>
    <LayerFilterGroup
      layer={ 'circles' }
      heading={'Sécheresse'}
      headingStyle={{marginTop:0}}>
      <DryFilters/>
    </LayerFilterGroup>
  </Container>
);

export default connect(state => ({
  visible: fromSidebar.isOpened(state),
}))(AtlasFilters);
