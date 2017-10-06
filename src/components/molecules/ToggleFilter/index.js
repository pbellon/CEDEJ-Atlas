import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AtlasPropTypes from 'atlas-prop-types';
import { Checkbox } from 'components';
import { fromLayers } from 'store/selectors';
import { startRender } from 'store/actions';
import { noop } from 'utils';


const ToggleFilter = ({
  id,
  toggled,
  onToggle,
  label,
  render,
  disabled,
}) => (
  <div>
    <Checkbox
      id={id}
      disabled={disabled}
      label={label}
      onBeforeChange={render}
      onChange={disabled ? noop : onToggle}
      checked={toggled}
    />
  </div>
);

ToggleFilter.contextTypes = AtlasPropTypes.layerContextTypes;

ToggleFilter.propTypes = {
  id: PropTypes.string.isRequired,
  toggled: PropTypes.bool,
  disabled: PropTypes.bool,
  render: PropTypes.func,
  onToggle: PropTypes.func,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
};

const mapStateToProps = (state, ownProps) => ({
  disabled: !fromLayers.isLayerVisible(state, ownProps.layer),
});

const mapDispatchToProps = dispatch => ({
  render: () => dispatch(startRender()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleFilter);
