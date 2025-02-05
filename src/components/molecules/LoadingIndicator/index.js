import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { LoadingIcon } from 'components';

const Holder = styled.div`
  transition: opacity .33 ease-in-out;
  position: absolute;
  display: flex;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255,255,255,0.8);
  z-index: 800;
  opacity: ${({ isLoading }) => isLoading ? 1 : 0};
  pointer-events: ${({ isLoading }) => isLoading ? 'auto' : 'none'};
`;


const LoadingIndicator = ({ isLoading = false }) => (
  <Holder isLoading={isLoading}><LoadingIcon /></Holder>
);

LoadingIndicator.propTypes = {
  isLoading: PropTypes.bool,
};

export default LoadingIndicator;
