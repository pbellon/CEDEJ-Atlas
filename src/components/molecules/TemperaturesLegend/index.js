import React from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import createFragment from 'react-addons-create-fragment';

import {
  AridityLegendNames,
  TemperatureLegendRow,
  TemperatureLegendRows,
} from 'components';

import { visibleTypes } from 'utils';

import * as patternUtils from 'utils/patterns';

const TemperaturesLegend = ({
  t,
  print,
  filters: {
    temperatures: { summer, winter },
    aridity,
  },
  layers: {
    temperatures: { visible: showTemperaturesLegend },
    aridity: { visible: showAridity },
  },
}) => {
  const layers = {
    temperatures: { visible: showTemperaturesLegend },
    aridity: { visible: showAridity },
  };

  const hasVisibleAridity = showAridity && visibleTypes(aridity).length > 0;
  const hasVisibleTemperaturesLegend = showTemperaturesLegend && (
    visibleTypes(winter).length > 0 && visibleTypes(summer).length > 0
  );

  const patterns = patternUtils.initPatterns();

  const temperatureRows = hasVisibleTemperaturesLegend ? TemperatureLegendRows({
    temperatures: { summer, winter },
    t,
    aridity,
    patterns,
    layers,
  }) : null;

  const tempsRowsFragment = createFragment({ temperatures: temperatureRows });

  const aridityNamesRows = hasVisibleAridity ? AridityLegendNames({
    t,
    aridity,
    print,
  }) : null;

  const aridityNamesFragment = createFragment({ aridity: aridityNamesRows });

  return (
    <tbody>
      {[
        aridityNamesFragment,
        tempsRowsFragment,
        !hasVisibleTemperaturesLegend && hasVisibleAridity ? (
          <TemperatureLegendRow
            layers={layers}
            key={'aridity-row'}
            aridity={aridity}
            patterns={patterns}
            t={t}
          />
        ) : null,
      ]}
    </tbody>
  );
};

TemperaturesLegend.propTypes = {
  t: PropTypes.func,
  print: PropTypes.bool,
  layers: PropTypes.object,
  filters: PropTypes.object,
};

export default translate('atlas')(TemperaturesLegend);
