import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Navbar } from 'components';
import { navbar } from 'utils/styles';

const ContainerHolder = styled.div`
  position: fixed;
  top: ${navbar.height}px;
  right:0px;
  left: 0px;
  bottom:0px;
  z-index: ${({ zIndex = 0 }) => zIndex};
  overflow: visible;
`;

const Container = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  overflow: hidden;
  bottom: 0;
  top: 0;
`;


const PageTemplate = ({ children, match }) => {
  console.log('PageTemplate.match', match);
  return (
    <div className="page-template">
      <Navbar match={match}/>
      <ContainerHolder>
        <Container>
          { children }
        </Container>
      </ContainerHolder>
    </div>
  );
}

PageTemplate.propTypes = {
  children: PropTypes.node,
};

export default PageTemplate;
