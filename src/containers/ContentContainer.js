import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Content } from 'components';
import { sidebar } from 'utils/styles';

const Holder = styled.div`
  display: flex;
`;

const Placeholder = styled.div`
  width: ${sidebar.width}px;
  flex-grow: 0;
  flex-shrink: 0;
`;

const ContentContainer = ({ children, ...props }) => (
  <Holder {...props }>
    <Content>
    { 
      children
    }
    </Content>
    <Placeholder/>
  </Holder>
);

ContentContainer.propTypes = {
  children: PropTypes.node,
};

export default ContentContainer;
