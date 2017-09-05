import React from 'react';
import { connect } from 'react-redux';

import { toggleSidebar } from 'store/actions'; 
import { fromSidebar } from 'store/selectors';

import { ToggleButton } from 'components'; 
 
const SidebarToggleButton = (props) => (
  <ToggleButton align={'left'} {...props }>Masquer le menu</ToggleButton>
);
     
const mapStateToProps = (state = fromSidebar.initialState)=>({
  toggled: fromSidebar.isOpened(state)
});

const mapDispatchToProps = (dispatch)=>({
  toggle:()=>(dispatch(toggleSidebar()))
}); 

export default connect(mapStateToProps, mapDispatchToProps)(SidebarToggleButton);
