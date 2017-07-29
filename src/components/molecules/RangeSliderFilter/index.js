import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { RangeSlider, Heading } from 'components';
import { fromLayers } from 'store/selectors';


const RangeSliderFilter = ({
  range,
  onChange,
  updateFilter,
  heading,
  disabled, 
  ...other
})=>{
  console.log('range', range);
  return (
    <div>
    { heading && (<Heading level={ 3 }>{ heading }</Heading>)}
    <RangeSlider
    disabled={ disabled }
    value={ range } 
    onChange={ onChange }
    {...other}
    />
    </div>
  );
};

const mapStateToProps = (state, ownProps)=>({
  disabled: !fromLayers.isLayerVisible(state, ownProps.layer),
  range: ownProps.range || ownProps.filter.range,
  heading: ownProps.heading,
  onChange: ownProps.onChange
});


export default connect(mapStateToProps)(RangeSliderFilter);
