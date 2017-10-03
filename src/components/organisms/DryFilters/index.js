import React from 'react';
import PropTypes from 'prop-types';

import { CircleSizesFilters, CircleTypesFilters } from 'components';

const DryFilters = (props, { layer }) => (
  <div>
    <CircleSizesFilters layer={layer} />
    <CircleTypesFilters layer={layer} />
  </div>
);

DryFilters.contextTypes = {
  layer: PropTypes.object,
};

export default DryFilters;
