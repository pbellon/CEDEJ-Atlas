import React from 'react';
import { toggleLegend } from 'store/actions';
import { fromFilters, fromLegend, fromLayers } from 'store/selectors';
import { connect } from 'react-redux';
import { AtlasLegend } from 'components';

const mapStateToProps = (state)=>({
  isOpened: fromLegend.isOpened(state),
  filters: fromFilters.filters(state),
  layers: fromLayers.layers(state), 
});

export default connect(mapStateToProps)(AtlasLegend);
