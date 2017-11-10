import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Td, TrName, TrNameContent } from 'components';
import { getName, getPrecipitations } from 'utils/aridity';
import { visibleTypes } from 'utils';

const ATh = styled(Td)`
  font-size: 0.65rem;
  line-height: 0.7rem;
  .legend--print & {
    width: 60px;
    font-weight: bold;
  }
`;

const AridityName = ({ aridity }) => (
  <ATh
    width={40}
    data-tip
    data-for={`tooltip-aridity-${aridity.name}`}
  >
    { getName(aridity) }
  </ATh>
);
AridityName.propTypes = {
  aridity: PropTypes.object,
};

const ATd = styled(Td)`
  font-size: 0.6rem;
  line-height: 0.6rem;
`;

const AridityPrecipitations = ({ aridity }) => (
  <ATd>
    P/Etp<br />{ getPrecipitations(aridity) }
  </ATd>
);
AridityPrecipitations.propTypes = {
  aridity: PropTypes.object,
};

const AridityLegendNames = ({ aridity, print, t }) => {
  const visibleAridities = visibleTypes(aridity);
  if (!visibleAridities.length) { return null; }
  return [
    <tr>
      <TrName><TrNameContent>
        { t('legend.aridity') }
      </TrNameContent></TrName>
      { visibleAridities.map((aridity, key) => (
        <AridityName aridity={aridity} key={key} />
      ))}
    </tr>,
    print ? (
      <tr>
        <td />
        { visibleAridities.map((aridity, key) => (
          <AridityPrecipitations key={key} aridity={aridity} />
        ))}
      </tr>
    ) : null,
  ];
};

AridityLegendNames.propTypes = {
  aridity: PropTypes.object,
  print: PropTypes.bool,
};


export default AridityLegendNames;
