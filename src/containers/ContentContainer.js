import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Content } from 'components';
import { sidebar } from 'utils/styles';

const Holder = styled.div`
  display: flex;
  align-items: ${({verticalAlign})=>verticalAlign ? 'center' : 'flex-start'};
  position: ${({verticalAlign})=>verticalAlign ? 'absolute' : 'static'};
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const Placeholder = styled.div`
  width: ${sidebar.width}px;
  flex-grow: 0;
  flex-shrink: 0;
`;

const ContentContainer = ({ children, ...props }) => (
  <Holder {...props }>
    <Content noTopPadding={ props.verticalAlign }>
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

ContentContainer.defaultProps = {
  verticalAlign: false,
}

export default ContentContainer;
