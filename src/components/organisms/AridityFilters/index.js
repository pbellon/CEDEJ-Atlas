import React from 'react';
import { translate } from 'react-i18next';
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

const AridityFilters = ({ t }) => (
  <Cols>
    <Col>
      <ToggleAridityVisibility label={t('aridity.Hyper.name')} aridity={'hyper'} />
      <ToggleAridityVisibility label={t('aridity.Aride.name')} aridity={'arid'} />
    </Col>
    <Col>
      <ToggleAridityVisibility label={t('aridity.Semi.name')} aridity={'semi'} />
      <ToggleAridityVisibility label={t('aridity.Sub_humide.name')} aridity={'subHumide'} />
    </Col>
  </Cols>
);

export default translate('atlas')(AridityFilters);
