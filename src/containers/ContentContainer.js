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
const Container = styled.div`
  max-width: 60%;
  margin: auto;
  padding-top: ${({noTopPadding})=>noTopPadding?0:50}px;
  padding-left: 30px;
  padding-right: 15px;
  @media (max-width: 1500px){
    max-width: 70%;
  }
  @media (max-width: 1100px){
    max-width: 80%;
  }
`;
const ContentContainer = ({ children, ...props }) => (
  <Holder {...props }>
    <Container>
      <Content>
      { 
        children
      }
      </Content>
    </Container>
    <Placeholder/>
  </Holder>
);

ContentContainer.propTypes = {
  children: PropTypes.node,
};

ContentContainer.defaultProps = {
  verticalAlign: false,
}

export default ContentContainer;
