import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Slider, Heading } from 'components';


const RangeFilter = ({ filter, updateFilter, heading })=>(
  <div>
    { heading && (<Heading level={ 3 }>{ heading }</Heading>)}
    <Slider range={ filter.range } onChange={ updateFilter(filter) }/>
  </div>
)

const mapDispatchToProps = (dispatch)=>({
  updateFilter: (filter)=>(range)=>dispatch(updateFilterRange(filter, range))
})

export default connect(null, mapDispatchToProps)(RangeFilter);
