import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AtlasPropTypes from 'atlas-prop-types';
import { Checkbox } from 'components';
import { startRender } from 'store/actions';
import { noop } from 'utils';


class ToggleFilter extends Component {
  static contextTypes = AtlasPropTypes.layerContextTypes;
  static propTypes = {
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
 
  render() {
    const {
      id,
      toggled,
      onToggle,
      label,
      render,
    } = this.props;
    const { layer } = this.context;
    const disabled = !layer.visible;
    return (
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
  }
}

const mapDispatchToProps = dispatch => ({
  render: () => dispatch(startRender()),
});

export default connect(null, mapDispatchToProps)(ToggleFilter);
