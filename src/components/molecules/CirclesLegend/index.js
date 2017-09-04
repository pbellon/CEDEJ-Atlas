import React from 'react'; 
import styled from 'styled-components';

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

const CircleTypeRow = ({ circle })=> {
  return (
    <tr>
      <td colSpan={4}>
        <CircleTypeSymbol circle={ circle } />&nbsp;
        <Reduced>
          { circlesUtils.droughtRegime(circle) }
        </Reduced>
      </td>
    </tr>
  );
};

const NormalWeight = styled.span`font-weight: normal`;

const CirclesLegend = ({ filters })=>{
  const types = filters.circles.types;
  const hasTypes = (types, ctrl)=>{
    for(let i = 0; i < types.length; i+=1){
      if(Object.keys(ctrl).indexOf(types[i]) < 0){
        return false;
      }
    }
    return true;
  };
  if(!visibleTypes(types).length){ return null; }

  return (
    <tbody>
      <tr>
        <TrName style={{paddingTop: '5px'}}>
          <TrNameContent>Sécheresse</TrNameContent>
        </TrName>
      </tr>
      <tr>
        <Th colSpan={3} align={'left'} style={{marginTop:'-5px'}}>
          <LegendCategoryName>
            Nombre de mois secs&nbsp; 
            <NormalWeight>recevant moins de 30mm de précipitations</NormalWeight>
          </LegendCategoryName>
        </Th>
        <Td>
          <CirclesRangeSymbol width={40} height={40} /> 
        </Td>
      </tr>
      <tr>
        <Th colSpan={5} align={'left'} style={{marginTop:'-5px'}}>
          <LegendCategoryName>
            Périodes des sécheresses&nbsp; 
            <NormalWeight>et régime des précipitations</NormalWeight>
          </LegendCategoryName>
        </Th>
      </tr>
      { hasTypes(['A', 'B'], types) && (
        <tr><Th colSpan={3} align={ 'left' }>
          <LegendCategoryName>
            <Reduced>Sécheresse d'été dominante</Reduced>
          </LegendCategoryName>
        </Th></tr>
      )}
      {
        types['A'] && (
          <CircleTypeRow circle={ 'A' } />
        )
      }
      {
        types['B'] && (
          <CircleTypeRow circle={ 'B' } />
        )
      }

      { hasTypes(['C', 'D'], types) && (
        <tr><Th colSpan={3} align={'left'}>
          <LegendCategoryName>Sécheresse d'hiver dominante</LegendCategoryName>
        </Th></tr>
      )}
      {
        types['C'] && (
          <CircleTypeRow circle={ 'C' } />
        )
      }
      {
        types['D'] && (
          <CircleTypeRow circle={ 'D' } />
        )
      }
      { hasTypes(['E', 'F'], types) && (
        <tr><Th colSpan={3} align={ 'left' }>
          <LegendCategoryName>Régimes de transition</LegendCategoryName>
        </Th></tr>
      )}
      {
        types['E'] && (
          <CircleTypeRow circle={ 'E' } />
        )
      }
      {
        types['F'] && (
          <CircleTypeRow circle={ 'F' } />
        )
      }
    </tbody>
  );
};

export default CirclesLegend;
