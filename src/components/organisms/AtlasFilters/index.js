import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import {
  LayerFilterGroup,
  AridityFilters,
  TemperaturesFilters,
  DryFilters,
  Heading,
} from 'components';

import { fromSidebar } from 'store/selectors';

const Container = styled.div`
  transition: opacity .5s ease;
  opacity: ${({ visible }) => visible ? 1 : 0};
  pointer-events:${({ visible }) => visible ? 'auto' : 'none'};
`;

const headingStyle = {
  marginBottom: '0.1rem',
  fontWeight: 'bold',
};

const AtlasFilters = ({ visible }) => (
  <Container visible={visible}>
    <Heading level={3} style={headingStyle}>Personnaliser la carte</Heading>
    <LayerFilterGroup
      layer={'aridity'}
      heading={'Aridité'}
    >
      <AridityFilters />
    </LayerFilterGroup>
    <LayerFilterGroup
      layer={'temperatures'}
      heading={'Températures'}
    >
      <TemperaturesFilters />
    </LayerFilterGroup>
    <LayerFilterGroup
      layer={'circles'}
      heading={'Sécheresse'}
      headingStyle={{ marginTop: 0 }}
    >
      <DryFilters />
    </LayerFilterGroup>
  </Container>
);

AtlasFilters.propTypes = {
  visible: PropTypes.bool,
};

export default connect(state => ({
  visible: fromSidebar.isOpened(state),
}))(AtlasFilters);
