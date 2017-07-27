import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { fromSidebar } from 'store/selectors';
import { toggleSidebar } from 'store/actions';
import { Link, Button } from 'components';

const Side = styled.div`
  position: fixed;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  top: ${({top})=>top}px;
  z-index: ${(props)=>(props.zIndex || 0)};
  bottom: 0px;
  right: 0px;
  transform: translate(${({opened, width})=>(opened ? 0 : width-50)}px, 0);
  background: #aaa;
  transition: transform .5s ease-out;
  width: ${({width})=>width}px;
`;

const Sidebar = ({ children , ...props})=>(
  <Side {...props}>
    { children }
   </Side>
);

Sidebar.propTypes = {
  opened: PropTypes.bool,
  width: PropTypes.number.isRequired
};

Sidebar.defaultProps = {
  zIndex: 5,
  width: 300
};

const mapStateToProps = (state)=>({
  opened: fromSidebar.isOpened(state)
});

export default connect(mapStateToProps)(Sidebar);
