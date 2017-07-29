import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { Button as _B } from 'components';

import { toggleSidebar } from 'store/actions'; 
import { fromSidebar } from 'store/selectors';

const Button = styled(_B)`
  height: 30px;
  line-height: 30px;
`;

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
