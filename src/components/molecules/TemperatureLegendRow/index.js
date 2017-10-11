import React from 'react';
import PropTypes from 'prop-types';
import { visibleTypes } from 'utils';
import { findByValue as findTemperature } from 'utils/temperatures';
import { AreaPattern, Td } from 'components';

const TemperatureLegendRow = ({
  name,
  temperature,
  patterns,
  aridity,
  layers: {
    aridity: { visible: showAridity },
  },
}) => {
  const temp = findTemperature(temperature);
  const visibleAridities = showAridity ? visibleTypes(aridity) : [];
  return (
    <tr>
      <Td align={'left'}>{ name }</Td>
      {
        visibleAridities.map((ar, key) => (
          <AreaPattern
            key={key}
            patterns={patterns}
            aridity={ar}
            temperature={temp}
          />
        ))
      }
      {
        (visibleAridities.length === 0) && (
          <AreaPattern temperature={temp} />
        )
      }
    </tr>
  );
};

TemperatureLegendRow.propTypes = {
  name: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  temperature: PropTypes.number,
  patterns: PropTypes.object,
  aridity: PropTypes.object,
  layers: PropTypes.object,
};

export default TemperatureLegendRow;
