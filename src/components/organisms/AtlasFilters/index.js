import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components'; 

import {
  LayerFilterGroup,
  AridityFilters,
  TemperaturesFilters,
  DryFilters,
} from 'components';
import { fromSidebar } from 'store/selectors';
// import { fromLayers } from 'store/selectors';

const Container = styled.div`
  transition: opacity .5s ease;
  opacity: ${({visible})=>visible?1:0};
  pointer-events:${({visible})=>visible?'auto':'none'};
`;

const AtlasFilters = ({visible})=>(
  <Container visible={visible}>
    <LayerFilterGroup layer={ 'temperatures' } 
      heading={'Aridité et températures'}>
      <AridityFilters/>
      <TemperaturesFilters/>
    </LayerFilterGroup>
    <LayerFilterGroup layer={ 'circles' } heading={'Sécheresse'}>
      <DryFilters/>
    </LayerFilterGroup>
  </Container>
);

export default connect(state => ({
  visible: fromSidebar.isOpened(state),
}))(AtlasFilters);
