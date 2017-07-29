import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { RangeSlider, Heading } from 'components';
import { fromLayers } from 'store/selectors';
import { updateFilterRange } from 'store/actions';

const RangeSliderFilter = ({
  range,
  updateFilter,
  heading,
  disabled, 
  ...other
})=>{
  console.log('range', range);
  return (
    <div>
      { heading && (<Heading level={ 3 }>{ heading }</Heading>)}
      <RangeSlider disabled={ disabled }
        value={ range } 
        onChange={ (range)=>updateFilter(range) }
        {...other}
        />
    </div>
  );
};

const mapStateToProps = (state, ownProps)=>({
  disabled: !fromLayers.isLayerVisible(state, ownProps.layer),
  range: ownProps.filter.range,
  heading: ownProps.heading
});

const mapDispatchToProps = (dispatch)=>({
  updateFilter: (filter)=>(range)=>dispatch(updateFilterRange(filter, range))
})

export default connect(mapStateToProps, mapDispatchToProps)(RangeSliderFilter);
