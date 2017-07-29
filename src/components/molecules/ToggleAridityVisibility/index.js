import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleAridityVisibility } from 'store/actions';
import { fromFilters } from 'store/selectors';
import { ToggleFilter } from 'components';

const ToggleAridityFilter = ({onToggle, toggled, aridity, label}, { layer })=>{
  return (
    <ToggleFilter
      layer={ layer }
      onToggle={ onToggle(aridity) } 
      toggled={ toggled } 
      label={ label }/>
  );
};

ToggleAridityFilter.contextTypes = {
  layer: PropTypes.object,
};

const mapStateToProps = (state, props)=>{
  const aridity = fromFilters.aridity(state, props.aridity);
  return {
    toggled: aridity.visible,
    label: props.label,
    aridity,
  };
}

const mapDispatchToProps = (dispatch)=>({
  onToggle: (aridity)=>{
    return ()=>dispatch(toggleAridityVisibility(aridity));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleAridityFilter);
