import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Holder = styled.div`
  display: flex;
`;


const Placeholder = styled.div`
  width: 300px;
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
