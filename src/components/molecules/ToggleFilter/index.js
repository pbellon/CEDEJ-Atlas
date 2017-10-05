import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Checkbox } from 'components';
import { fromLayers } from 'store/selectors';
import { startRender } from 'store/actions';
import { noop } from 'utils';

const ToggleFilter = ({ toggled, onToggle, label, disabled, render }) => (
  <div>
    <Checkbox
      disabled={disabled}
      label={label}
      onBeforeChange={render}
      onChange={disabled ? noop : onToggle}
      checked={toggled}
    />
  </div>
);

ToggleFilter.propTypes = {
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
  disabled: !fromLayers.layerByName(state, ownProps.layer.name).visible,
});

const mapDispatchToProps = dispatch => ({
  render: () => dispatch(startRender()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleFilter);
