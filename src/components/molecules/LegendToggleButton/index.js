import React from 'react';
import { connect } from 'react-redux';

import { toggleLegend } from 'store/actions'; 
import { fromLegend } from 'store/selectors';

import { ToggleButton } from 'components'; 

const LegendToggleButton = (props) => (
  <ToggleButton align={'right'} {...props }>Masquer la légende</ToggleButton>
);

const mapStateToProps = (state = fromLegend.initialState)=>({
  toggled: fromLegend.isOpened(state)
});

const mapDispatchToProps = (dispatch)=>({
  toggle:()=>(dispatch(toggleLegend()))
}); 

export default connect(mapStateToProps, mapDispatchToProps)(LegendToggleButton);
