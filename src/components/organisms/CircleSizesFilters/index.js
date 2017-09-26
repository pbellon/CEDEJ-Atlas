import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { fromFilters } from 'store/selectors';
import { toggleCircleSizeVisibility } from 'store/actions';
import { ToggleFilter, Heading } from 'components';
import * as circlesUtils from 'utils/circles';

const Holder = styled.div``;
const CircleSizesFilters = ({ onToggle, sizes, disabled, layer})=>(
  <Holder>
    <Heading
      style={{marginBottom:0}}
      level={6}>Nombre de mois secs</Heading>
    { Object.keys(sizes).map(key => {
      const size = sizes[key];
      return (
        <ToggleFilter key={key} layer={layer}
          toggled={size.visible}
          onToggle={onToggle(size)}
          label={circlesUtils.monthsDescription(key)}/>
      );
    })}
  </Holder>
);


const mapDispatchToProps = dispatch => ({
  onToggle: (type)=>()=>dispatch(toggleCircleSizeVisibility(type))
});

const mapStateToProps = (state, ownProps) => ({
  sizes: fromFilters.circlesSizes(state),
  layer: ownProps.layer
});


export default connect(mapStateToProps, mapDispatchToProps)(CircleSizesFilters);
