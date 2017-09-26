import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import styled from 'styled-components';

import { CircleSizesFilters, CircleTypesFilters } from 'components';
import { fromFilters } from 'store/selectors';
import { updateDryMonthsRange } from 'store/actions';

const Holder = styled.div``;
const DryFilters = ({ updateMonths, monthRange, toggleCircleTypeVisibility }, { layer })=>(
  <Holder>
    <CircleSizesFilters layer={layer} />
    <CircleTypesFilters layer={ layer} />
  </Holder>
);

DryFilters.contextTypes = {
  layer: PropTypes.object
};

const mapDispatchToProps = dispatch => ({
  updateMonths: (range)=>dispatch(updateDryMonthsRange(range)),
});

const mapStateToProps = state => ({
  monthRange: fromFilters.dryMonths(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(DryFilters);
