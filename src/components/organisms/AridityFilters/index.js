import React from 'react';
import styled from 'styled-components';

import { ToggleAridityVisibility } from 'components';

const Cols = styled.div`
  display: flex;
  justify-content: space-around;
`;

const Col = styled.div`
  flex-grow: 1;
  flex-base: 1;
`;

const AridityFilters = () => (
  <Cols>
    <Col>
      <ToggleAridityVisibility label={'Hyper Aride'} aridity={'hyper'} />
      <ToggleAridityVisibility label={'Aride'} aridity={'arid'} />
    </Col>
    <Col>
      <ToggleAridityVisibility label={'Semi Aride'} aridity={'semi'} />
      <ToggleAridityVisibility label={'Sub Humide'} aridity={'subHumide'} />
    </Col>
  </Cols>
);

export default AridityFilters;
