import React from 'react'; 
import styled from 'styled-components';
import Markdown from 'react-markdown';
import Tooltip from 'react-tooltip';
import {
  LegendCategoryName, 
  Reduced,
  Td,
  Th,
  TrName,
  TrNameContent,
  CirclesRangeSymbol,
} from 'components';

import { visibleTypes } from 'utils'; 

import * as circlesUtils from 'utils/circles';

const CircleTypeSymbol = styled.span`
  background-color: ${({ circle })=>circlesUtils.colorByValue(circle)};
  width: 10px;
  height: 10px;
  border: 1px solid black;
  border-radius: 100%;
  display: inline-block;
`;

const CircleTooltipContent = styled.div`
  font-weight: normal;
  max-width: 400px;
`;


const CircleTypeRow = ({ circle })=> {
  return (
    <tr>
      <td colSpan={2} >
        <span data-tip data-for={`tooltip-circle-${circle}`}>
          <CircleTypeSymbol circle={ circle } />&nbsp;
          <Reduced>
            { circlesUtils.droughtRegime(circle) }
          </Reduced>
        </span>
      </td>
    </tr>
  );
};

const NormalWeight = styled.span`font-weight: normal`;

const CirclesLegend = ({ filters })=>{
  const types = filters.circles.types;
  const visibleTypes = Object.keys(types)
    .map(k => types[k])
    .filter(t => t.visible);
  const isVisible = t =>types[t].visible;
  const hasTypes = (types, ctrl)=>{
    let i = 0;
    for(i; i < types.length; i+=1){
      if(ctrl[types[i]].visible){
        return true;
      }
    }
    return false;
  };

  return (
    <tbody>
      <tr>
        <TrName style={{paddingTop: '5px'}}>
          <TrNameContent>Sécheresse</TrNameContent>
        </TrName>
      </tr>
      <tr>
        <Th align={'left'} style={{marginTop:'-5px'}}>
          <LegendCategoryName>
            <span data-tip data-for="tooltip-nb-months">Nombre de mois secs</span>
          </LegendCategoryName>
        </Th>
        <Td>
          <CirclesRangeSymbol width={40} height={40} /> 
        </Td>
      </tr>
      { visibleTypes.length > 0 && (
        <tr>
          <Th colSpan={2} align={'left'} style={{marginTop:'-5px'}}>
            <LegendCategoryName>
              <span data-tip data-for="tooltip-regime">
                Périodes des sécheresses
              </span>
            </LegendCategoryName>
          </Th>
        </tr>
      )}
      { hasTypes(['A', 'B'], types) && (
        <tr><Th colSpan={3} align={ 'left' }>
          <LegendCategoryName>
            <Reduced>Sécheresse d'été dominante</Reduced>
          </LegendCategoryName>
        </Th></tr>
      )}
      {
        isVisible('A') && (
          <CircleTypeRow circle={ 'A' } />
        )
      }
      {
        isVisible('B') && (
          <CircleTypeRow circle={ 'B' } />
        )
      }

      { hasTypes(['C', 'D'], types) && (
        <tr><Th colSpan={3} align={'left'}>
          <LegendCategoryName>
            <Reduced>Sécheresse d'hiver dominante</Reduced>
          </LegendCategoryName>
        </Th></tr>
      )}
      {
        isVisible('C') && (
          <CircleTypeRow circle={ 'C' } />
        )
      }
      {
        isVisible('D') && (
          <CircleTypeRow circle={ 'D' } />
        )
      }
      { hasTypes(['E', 'F'], types) && (
        <tr><Th align={ 'left' }>
          <LegendCategoryName>
            <Reduced>Régimes de transition</Reduced>
          </LegendCategoryName>
        </Th></tr>
      )}
      {
        isVisible('E') && (
          <CircleTypeRow circle={ 'E' } />
        )
      }
      {
        isVisible('F') && (
          <CircleTypeRow circle={ 'F' } />
        )
      }
    </tbody>
  );
};

export default CirclesLegend;
