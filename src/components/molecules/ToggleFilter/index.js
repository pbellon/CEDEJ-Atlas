import React, { Component }  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { palette } from 'styled-theme';

import { Checkbox, Filter, Label as GenericLabel } from 'components';
import { fromLayers } from 'store/selectors';
import { startRender } from 'store/actions';


const Label = GenericLabel.extend`
  &.disabled {
    color: ${palette('grayscale', 4)};
  }
`;

const noop = ()=>null;

const ToggleFilter = ({ toggled, onToggle, label, disabled, render})=>(
  <Filter disabled={ disabled } active={ toggled }> 
    <Checkbox disabled={ disabled }
      label={ label }
      onBeforeChange={ render }
      onChange={ disabled ? noop : onToggle }
      checked={ toggled }/>
  </Filter>
);

const mapStateToProps = (state, ownProps)=>({
  disabled: !fromLayers.layerByName(state, ownProps.layer.name).visible
});

const mapDispatchToProps = dispatch => ({ 
  render: ()=> dispatch(startRender())
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleFilter);
