import React from 'react';
import styled from 'styled-components';
import { RangeFilter } from 'components';

const Holder = styled.div``;
const WinterTemperaturesFilter = ()=>(
  <Holder>
    <RangeFilter 
      heading={ 'Températures d\'hiver' }
      filter={ fromFilters.temperatures.winter() }/>
    <RangeFilter
      heading={ 'Températures d\'été '}
      filter={ fromFilter.temperatures.summer() }/>

  </Holder>
);

export default WinterTemperaturesFilter;
