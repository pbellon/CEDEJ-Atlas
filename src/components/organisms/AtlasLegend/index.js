import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import styled from 'styled-components';
import { font, palette } from 'styled-theme'
import {
  ContextualInfo,
  TemperaturesLegend,
  CirclesLegend,
  LegendToggleButton,
} from 'components'; 

import { fromAtlas, fromFilters, fromLegend } from 'store/selectors';
import { toggleLegend } from 'store/actions';

const Legend = styled.div`
  font-family: ${font('primary')};
  background: white;
  position: absolute;
  z-index: 1000;
  top: 0;
  left: ${({isOpened})=>isOpened?0:-360}px;
  padding: 5px;
  padding-top: 0;
  width: 400px;
  transition: left .5s ease-in-out;
`;

const Table = styled.table``;

const Holder = styled.div`
  padding-top: 30px;
`;

const LegendContent = ({ filters })=>{
  return (
    <Holder>
      <Table>
        <TemperaturesLegend filters={ filters } />
        <CirclesLegend filters={ filters}/>
      </Table>
    </Holder>
  );
};

const visibilityButtonStyle = {
  position: 'absolute',
  right: 0,
  left: 0,
};
const AtlasLegend = ({
  isOpened,
  showContextualInfo,
  contextualData,
  filters,
  toggleLegend 
}) => {
  return (
    <Legend isOpened={ isOpened }>
      <LegendToggleButton
        align={'right'}
        style={visibilityButtonStyle} />
      <LegendContent filters={ filters }/>
      { contextualData && (
        <ContextualInfo visible={ showContextualInfo } data={ contextualData }/>
      )}
    </Legend>
  );
};

const mapStateToProps = (state)=>({
  isOpened: fromLegend.isOpened(state),
  filters: fromFilters.filters(state),
  showContextualInfo: fromAtlas.isContextualInfoVisible(state),
  contextualData: fromAtlas.contextualInfo(state)
});

const mapDispatchToProps = (dispatch)=>({
  toggleLegend: ()=>dispatch(toggleLegend()),
})
export default connect(mapStateToProps)(AtlasLegend);
