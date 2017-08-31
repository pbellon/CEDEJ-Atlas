import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { size } from 'styled-theme';
const Holder = styled.div`
  display: flex;
`;


const Placeholder = styled.div`
  width: ${size('sidebar.width')}px;
  flex-grow: 0;
  flex-shrink: 0;
`;

const Content = styled.div`
  padding-left: 15px;
  padding-right: 15px;
`;

const ContentContainer = ({ children }) => (
  <Holder>
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
