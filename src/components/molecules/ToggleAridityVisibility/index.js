import React from 'react';
import { connect } from 'react-redux';
import { toggleAridityVisibility } from 'store/actions';
import { fromFilters } from 'store/selectors';
import { Checkbox, Label, Filter } from 'components';

const ToggleAridityFilter = ({onToggle, aridity, label})=>(
  <Filter onClick={ onToggle(aridity) }>
    <Checkbox
      toggled={ aridity.visible } label={ label }/>
  </Filter>
);

const mapStateToProps = (state, props)=>({
  aridity: fromFilters.aridity(state, props.aridity),
  label: props.label
});

const mapDispatchToProps = (dispatch)=>({
  onToggle: (aridity)=>{
    return ()=>dispatch(toggleAridityVisibility(aridity));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleAridityFilter);
