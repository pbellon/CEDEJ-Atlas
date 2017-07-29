import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fromFilters } from 'store/selectors';
import { RangeSliderFilter } from 'components';

const TemperaturesFilters = ({winterFilter, summerFilter}, {layer})  => (
  <div>
    <RangeSliderFilter
      layer={layer}
      heading={ 'Températures d\'hiver' }
      min={0} max={30} step={10}
      filter={winterFilter}/>
    
    <RangeSliderFilter
      layer={layer}
      min={0}
      max={30}
      step={10}
      heading={ 'Températures d\'été '}
      filter={ summerFilter }/>
  </div>
);

TemperaturesFilters.contextTypes = {
  layer: PropTypes.object,
};

const mapStateToProps = (state, ownProps)=>({
  winterFilter: fromFilters.winterTemperatures(state),
  summerFilter: fromFilters.summerTemperatures(state),
})
export default connect(mapStateToProps)(TemperaturesFilters);
