import React from 'react';
import PropTypes from 'prop-types';
import { visibleTypes } from 'utils';
import { findByValue as findTemperature } from 'utils/temperatures';
import { TemperatureLegendPattern, Td } from 'components';

const TemperatureRow = ({
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
          <TemperatureLegendPattern
            key={key}
            patterns={patterns}
            aridity={ar}
            temperature={temp}
          />
        ))
      }
      {
        (visibleAridities.length === 0) && (
          <TemperatureLegendPattern temperature={temp} />
        )
      }
    </tr>
  );
};

TemperatureRow.propTypes = {
  name: PropTypes.string,
  temperature: PropTypes.number,
  patterns: PropTypes.object,
  aridity: PropTypes.object,
  layers: PropTypes.object,
};

export default TemperatureRow;
