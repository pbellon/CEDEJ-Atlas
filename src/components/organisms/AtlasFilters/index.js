import React from 'react';
import styled from 'styled-components'; 

import {
  LayerFilterGroup,
  AridityFilters,
  TemperaturesFilters,
  MonthsDryFilter,
} from 'components';

// import { fromLayers } from 'store/selectors';

const Container = styled.div``;

const AtlasFilters = ()=>(
  <Container>
    <LayerFilterGroup layer={ 'temperatures' } 
      heading={'Aridité et températures'}>
      <AridityFilters/>
      <TemperaturesFilters/>
    </LayerFilterGroup>
   { /*
    <LayerFilterGroup layer={fromLayers.circles()} heading={'Sécheresse'}>
      <MonthsDryFilter/>
    </LayerFilterGroup>
    */ }
  </Container>
);

export default AtlasFilters;
