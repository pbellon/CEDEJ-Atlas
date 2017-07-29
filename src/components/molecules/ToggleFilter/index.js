import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { palette } from 'styled-theme';

import { Checkbox, Filter, Label as GenericLabel } from 'components';
import { fromLayers } from 'store/selectors';

const Label = GenericLabel.extend`
  &.disabled {
    color: ${palette('grayscale', 4)};
  }
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
