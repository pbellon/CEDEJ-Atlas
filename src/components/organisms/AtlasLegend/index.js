import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { font, palette } from 'styled-theme'
import {
  ContextualInfo,
  TemperaturesLegend,
  CirclesLegend,
  LegendMoreInfos,
  LegendMoreInfosPrint,
  LegendToggleButton,
  LegendTooltips,
} from 'components'; 

import { visibleTypes, objToArray } from 'utils';
import { legend } from 'utils/styles';
import formats from 'utils/formats';

const Legend = styled.div`
  font-family: ${font('primary')};
  background: ${palette('white', 0)};
  position: absolute;
  z-index: 1000;
  top: 0;
  bottom: 0;
  left: 0;
  transform: translate(${({isOpened})=>isOpened ? 0: '-87%'}, 0);
  padding: 5px;
  padding-top: 0;
  max-width: ${legend.width}px;
  overflow: hidden;
  transition: transform .5s ease-in-out;
  
  &:hover {
    overflow: ${({isOpened})=>isOpened?'auto':'hidden'};
  }

  &.legend--print {
    font-family: Arial, sans-serif;
    max-width: 700px;
    position: static;
    top: auto;
    overflow: visible;
    [data-tip]:after {
      display: none;
    }
  }
`;

const Table = styled.table``;

const Holder = styled.div`
  padding-top: ${({print})=>print?0:30}px;
  overflow: auto;
`;

const LegendContent = ({ filters, layers, circleSizes, print })=>{
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
    <Holder print={print}>
      <Table>
        <TemperaturesLegend print={print} filters={ filters } layers={layers} />
        { showCircles && (
          <CirclesLegend print={print} filters={filters} circleSizes={circleSizes}/>
        )}
        { noData && (
          <tbody><tr><th>Pas de données à visualiser</th></tr></tbody>
        )}
      </Table>
      { !print && (
        <LegendMoreInfos/>
      )}
    </Holder>
  );
};

LegendContent.defaultProps = {
  print: false,
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
  print,
  circleSizes,
}) => {
  return (
    <div>
      <Legend 
        className={`legend ${print ? 'legend--print':''}`}
        isOpened={ isOpened }>
        { !print && (
          <LegendToggleButton style={visibilityButtonStyle} />
        )}
        
        <VisibleIfOpened isOpened={ isOpened }>
          <LegendContent
            circleSizes={circleSizes}
            print={ print }
            layers={ layers }
            filters={ filters }/>
        </VisibleIfOpened>
      </Legend>
      <LegendTooltips layers={layers} filters={filters}/>
    </div>
  );
};

AtlasLegend.propTypes = {
  layers: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  circleSizes: PropTypes.object.isRequired,
  print: PropTypes.bool,
  isOpened: PropTypes.bool,

};

AtlasLegend.defaultProps = {
  print: false,
  isOpened: true,
};

export default AtlasLegend;
