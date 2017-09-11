import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import styled from 'styled-components';
import { font, palette } from 'styled-theme'
import {
  ContextualInfo,
  TemperaturesLegend,
  CirclesLegend,
  LegendMoreInfos,
  LegendToggleButton,
  LegendTooltips,
} from 'components'; 

import { fromFilters, fromLegend, fromLayers } from 'store/selectors';
import { toggleLegend } from 'store/actions';
import { visibleTypes, objToArray } from 'utils';
import { legend } from 'utils/styles';

const Legend = styled.div`
  font-family: ${font('primary')};
  background: ${palette('white', 0)};
  position: absolute;
  z-index: 1000;
  top: 0;
  bottom: 0;
  left: ${({isOpened})=>isOpened?0:-(legend.width - 40)}px;
  padding: 5px;
  padding-top: 0;
  width: ${legend.width}px;
  overflow: hidden;
  transition: left .5s ease-in-out;
  &:hover {
    width: ${({isOpened})=>isOpened?(legend.width+14):legend.width}px;
    overflow: ${({isOpened})=>isOpened?'auto':'hidden'};
  }
`;

const Table = styled.table``;

const Holder = styled.div`
  padding-top: 30px;
  overflow: auto;
`;

const LegendContent = ({ filters, layers })=>{
  const {
    temperatures: { visible: showTemperatures },
    circles: { visible: showCircles },
  } = layers;
  const allTypes = {
    ...filters.circles.types,
    ...filters.temperatures,
    ...filters.aridity
  }; 
  const noFilters = visibleTypes(allTypes).length === 0; 
  const noData = ((!showTemperatures) && (!showCircles)) || (noFilters);
  return (
    <Holder>
      <Table>
        { showTemperatures && (
          <TemperaturesLegend filters={ filters } />
        )}
        { showCircles && (
          <CirclesLegend filters={ filters}/>
        )}
        { noData && (
          <tbody><tr><th>Pas de données à visualiser</th></tr></tbody>
        )}
      </Table>
      <LegendMoreInfos/>
    </Holder>
  );
};
const VisibleIfOpened = styled.div`
  transition: opacity .5s ease;
  opacity: ${({isOpened})=>isOpened?1:0};
  pointer-events: ${({isOpened})=>isOpened?'auto':'none'};
`;
const visibilityButtonStyle = {
  position: 'absolute',
  right: 0,
  left: 0,
};
const AtlasLegend = ({
  isOpened,
  filters,
  layers,
  toggleLegend 
}) => {
  return (
    <div>
      <Legend isOpened={ isOpened }>
        <LegendToggleButton
            style={visibilityButtonStyle} />
        
        <VisibleIfOpened isOpened={ isOpened }>
          <LegendContent layers={ layers } filters={ filters }/>
        </VisibleIfOpened>
      </Legend>
      <LegendTooltips/>
    </div>
  );
};

const mapStateToProps = (state)=>({
  isOpened: fromLegend.isOpened(state),
  filters: fromFilters.filters(state),
  layers: fromLayers.layers(state), 
});

const mapDispatchToProps = (dispatch)=>({
  toggleLegend: ()=>dispatch(toggleLegend()),
})
export default connect(mapStateToProps)(AtlasLegend);
