import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import styled from 'styled-components';
import { font, palette } from 'styled-theme'
import {
  ContextualInfo,
  TemperaturesLegend,
  CirclesLegend,
} from 'components'; 

import { fromAtlas, fromFilters } from 'store/selectors';


const Legend = styled.div`
  font-family: ${font('primary')};
  background: white;
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  padding: 5px;
  padding-top: 0;
  max-width: 400px;
`;

const Table = styled.table``;
const LegendContent = ({ filters })=>{
  return (
    <div>
      <Table>
        <TemperaturesLegend filters={ filters } />
        <CirclesLegend filters={ filters}/>
      </Table>
    </div>
  );
}
const AtlasLegend = ({ showContextualInfo, contextualData, filters }) => {
  return (
    <Legend>
      <LegendContent filters={ filters }/>
      { contextualData && (
        <ContextualInfo visible={ showContextualInfo } data={ contextualData }/>
      )}
    </Legend>
  );
};

const mapStateToProps = (state)=>({
  filters: fromFilters.filters(state),
  showContextualInfo: fromAtlas.isContextualInfoVisible(state),
  contextualData: fromAtlas.contextualInfo(state)
});

export default connect(mapStateToProps)(AtlasLegend);
