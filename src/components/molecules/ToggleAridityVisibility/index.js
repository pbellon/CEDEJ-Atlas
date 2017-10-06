import React from 'react';
import PropTypes from 'prop-types';
import AtlasPropTypes from 'atlas-prop-types';
import { connect } from 'react-redux';
import { toggleAridityVisibility } from 'store/actions';
import { fromFilters } from 'store/selectors';
import { ToggleFilter } from 'components';

const ToggleAridityFilter = ({
  onToggle,
  toggled,
  aridity,
  label,
}, { layer }) => (
  <ToggleFilter
    layer={layer}
    id={`aridity-type-${aridity.name}-filter`}
    onToggle={onToggle(aridity)}
    toggled={toggled}
    label={label}
  />
);

ToggleAridityFilter.propTypes = {
  onToggle: PropTypes.func,
  toggle: PropTypes.func,
  toggled: PropTypes.bool,
  aridity: AtlasPropTypes.filter,
  label: AtlasPropTypes.label,
};

ToggleAridityFilter.contextTypes = {
  layer: AtlasPropTypes.layer,
};

const mapStateToProps = (state, props) => {
  const aridity = fromFilters.aridity(state, props.aridity);
  return {
    toggled: aridity.visible,
    label: props.label,
    aridity,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onToggle: (aridity) => (
    () => dispatch(toggleAridityVisibility(aridity))
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleAridityFilter);
