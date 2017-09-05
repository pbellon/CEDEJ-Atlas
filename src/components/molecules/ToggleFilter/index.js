import React, { Component }  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { palette } from 'styled-theme';

import { Checkbox } from 'components';
import { fromLayers } from 'store/selectors';
import { startRender } from 'store/actions';

const noop = ()=>null;

const ToggleFilter = ({ toggled, onToggle, label, disabled, render})=>(
  <div>
    <Checkbox disabled={ disabled }
      label={ label }
      onBeforeChange={ render }
      onChange={ disabled ? noop : onToggle }
      checked={ toggled }/>
  </div>
);

const mapStateToProps = (state, ownProps)=>({
  disabled: !fromLayers.layerByName(state, ownProps.layer.name).visible
});

const mapDispatchToProps = dispatch => ({ 
  render: ()=> dispatch(startRender())
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleFilter);
