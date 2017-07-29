import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import styled from 'styled-components';

import { RangeSliderFilter } from 'components';
import { fromFilters } from 'store/selectors';
import { updateDryMonthsRange } from 'store/actions';
const Holder = styled.div``;
const DryFilters = ({ updateMonths, monthRange, toggleCircleTypeVisibility }, { layer })=>(
  <Holder>
    <RangeSliderFilter
      layer={ layer }
      min={1}
      max={12}
      step={1}
      range={ monthRange }
      heading={ 'Nombre de mois secs' }
      onChange={ updateMonths }/>

  </Holder>
);

DryFilters.contextTypes = {
  layer: PropTypes.object
};

const mapDispatchToProps = dispatch => ({
  updateMonths: (range)=>dispatch(updateDryMonthsRange(range)),
  toggleCircleTypeVisibility: (type)=>dispatch(toggleCircleTypeVisibility(type))
});

const mapStateToProps = state => ({
  monthRange: fromFilters.dryMonths(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(DryFilters);
