import React from 'react';

import { connect } from 'react-redux';

import { Button } from 'components';

import { toggleSidebar } from 'store/actions'; 
import { fromSidebar } from 'store/selectors';

const ToggleButton = ({ toggled, toggle})=>(
  <div>
    <Button onClick={ toggle }>{ toggled ? '>' : '<' }</Button>
  </div>
);
      
const mapStateToProps = (state = fromSidebar.initialState)=>({
  toggled: fromSidebar.isOpened(state)
});

const mapDispatchToProps = (dispatch)=>({
  toggle:()=>(dispatch(toggleSidebar()))
}); 

export default connect(mapStateToProps, mapDispatchToProps)(ToggleButton);
