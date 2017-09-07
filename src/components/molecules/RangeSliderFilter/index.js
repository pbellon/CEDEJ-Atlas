import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { RangeSlider, Heading } from 'components';
import { fromLayers } from 'store/selectors';
import { startRender } from 'store/actions';
const noop = (v)=>`${v}`;

const RangeSliderFilter = ({
  range,
  render,
  onChange,
  updateFilter,
  heading,
  headingStyle,
  disabled,
  tipFormatter=noop,
  ...other
})=>{
  const applyHeadingStyle = {
    marginTop: '0.2em',
    ...headingStyle
  };
  return (
    <div>
    { heading && (<Heading level={ 6 } style={applyHeadingStyle}>{ heading }</Heading>)}
    <RangeSlider
      tipFormatter={tipFormatter}
      disabled={ disabled }
      defaultValue={ range }
      onChange={ render }
      onAfterChange={ onChange }
      {...other}
    />
    </div>
  );
};

const mapStateToProps = (state, ownProps)=>({
  disabled: !fromLayers.isLayerVisible(state, ownProps.layer),
  range: ownProps.range || ownProps.filter.range,
  tipFormatter: ownProps.tipFormatter,
  heading: ownProps.heading,
  onChange: ownProps.onChange
});

const mapDispatchToProps = dispatch => ({
  render: ()=>dispatch(startRender())
});

export default connect(mapStateToProps, mapDispatchToProps)(RangeSliderFilter);
