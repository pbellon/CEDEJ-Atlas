import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fromSidebar } from 'store/selectors';
import { toggleSidebar } from 'store/actions';
import { Button } from 'components';
const Side = styled.div`
  position: fixed;
  top: ${({top})=>top}px;
  z-index: ${(props)=>(props.zIndex || 0)};
  padding: 15px;
  bottom: 0px;
  right: 0px;
  transform: translate(${({opened, width})=>(opened ? 0 : width-50)}px, 0);
  background: #aaa;
  transition: transform .5s ease-out;
  width: ${({width})=>width}px;
`;

const Sidebar = ({ children, onPress, ...props})=>(
  <Side {...props}>
    <Button onClick={ onPress }>
      { props.opened ? '>' : '<' }
    </Button>
    <Link to={ '/page/about' }>À propos</Link>
  </Side>
);

Sidebar.propTypes = {
  opened: PropTypes.bool,
  width: PropTypes.number.isRequired
}
const mapDispatchToProps = (dispatch)=>({
  onPress: ()=>dispatch(toggleSidebar())
})
const mapStateToProps = (state)=>({
  opened: fromSidebar.isOpened(state)
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
