import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fromFilters } from 'store/selectors';
import { updateTemperatureRange } from 'store/actions';
import { RangeSliderFilter } from 'components';

const CelciusFormatter = value =>`${value}℃`;
const TemperaturesFilters = ({winterFilter, summerFilter, updateFilter}, {layer})  => (
  <div>
    <RangeSliderFilter
      layer={layer}
      onChange={ updateFilter(winterFilter) } 
      tipFormatter={CelciusFormatter}  
      heading={ 'Températures d\'hiver' }
      min={0} max={30} step={10}
      filter={winterFilter}/>
    
    <RangeSliderFilter
      layer={layer}
      tipFormatter={CelciusFormatter}  
      min={10}
      max={30}
      step={10}
      onChange={ updateFilter(summerFilter) } 
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
});

const mapDispatchToProps = (dispatch)=>({
  updateFilter: (filter)=>{
    return (range)=>{
      dispatch(updateTemperatureRange(filter, range))
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TemperaturesFilters);
