import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { size, palette } from 'styled-theme';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { fromSidebar } from 'store/selectors';
import { toggleSidebar } from 'store/actions';
import { Link, Button } from 'components';
import { sidebar, navbar } from 'utils/styles';

const Side = styled.div`
  position: fixed;
  display: flex;
  overflow: auto;
  justify-content: space-between;
  flex-direction: column;
  top: ${navbar.height}px;
  z-index: ${(props)=>(props.zIndex || 0)};
  bottom: 0px;
  right: 0px;
  transform: translate(0, 0);
  background: ${palette('grayscale', 4)};
  transition: transform .5s ease-out;
  width: ${sidebar.width}px;

  &.closed {
    transform: translate(${sidebar.width - 50}px, 0);
  }
`;

const Sidebar = ({ children, opened, ...props})=>{
  const klass = opened ? '':'closed';
  return (
    <Side className={klass} {...props}>
      { children }
     </Side>
  );
};
Sidebar.propTypes = {
  opened: PropTypes.bool,
};

Sidebar.defaultProps = {
  zIndex: 5,
};

const mapStateToProps = (state)=>({
  opened: fromSidebar.isOpened(state)
});

export default connect(mapStateToProps)(Sidebar);
