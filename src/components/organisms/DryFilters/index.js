import React from 'react';
import PropTypes from 'prop-types';
import { layerContextTypes } from 'atlas-prop-types';
import { CircleSizesFilters, CircleTypesFilters } from 'components';

const DryFilters = (props, { layer }) => (
  <div>
    <CircleSizesFilters {...props} layer={layer} />
    <CircleTypesFilters {...props} layer={layer} />
  </div>
);

DryFilters.contextTypes = layerContextTypes;

export default DryFilters;
