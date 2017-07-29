import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components'; 

import { Filter, Label as GenericLabel } from 'components';
import { fromLayers } from 'store/selectors';
const Checkbox = styled.input.attrs({
  type: 'checkbox',
})`
`;

const Label = GenericLabel.extend`
  &.disabled { }
`;

const noop = ()=>null;

const ToggleFilter = ({ toggled, onToggle, label, disabled})=>{
  return (
    <Filter disabled={ disabled } active={ toggled }>
      <Checkbox disabled={ disabled } onChange={ disabled ? noop : onToggle } checked={ toggled }/>
      <Label onClick={ disabled ? noop : onToggle } className={ disabled ? 'disabled':'' }>{ label }</Label>
    </Filter>
  );
};


const mapStateToProps = (state, ownProps)=>({
  disabled: !fromLayers.layerByName(state, ownProps.layer.name).visible
});

export default connect(mapStateToProps)(ToggleFilter);
