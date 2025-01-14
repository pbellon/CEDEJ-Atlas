import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { connect } from 'react-redux';
import { fromSidebar } from 'store/selectors';
import { sidebar, navbar } from 'utils/styles';

const Side = styled.div`
  position: fixed;
  overflow: hidden;
  top: ${navbar.height}px;
  z-index: ${(props) => (props.zIndex || 0)};
  bottom: 0px;
  right: 0px;
  transform: translate(0, 0);
  background: ${palette('grayscale', 4)};
  transition: transform .5s ease-in-out;
  width: ${sidebar.width}px;

  &.closed {
    transform: translate(${sidebar.width - 40}px, 0);
  }

  h4 + div h6:first-child {
    margin-top: 0;
  } 
`;

const Sidebar = ({ children, opened, ...props }) => {
  const klass = opened ? '' : 'closed';
  return (
    <Side className={klass} {...props}>
      { children }
    </Side>
  );
};
Sidebar.propTypes = {
  opened: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

Sidebar.defaultProps = {
  zIndex: 5,
};

const mapStateToProps = (state) => ({
  opened: fromSidebar.isOpened(state),
});

export default connect(mapStateToProps)(Sidebar);
