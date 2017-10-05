import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  LegendCategoryName,
  Reduced,
  Td,
  Th,
  TrName,
  TrNameContent,
  CircleSizesSymbol,
  PrintCircleMonthRangeLegend,
} from 'components';

import * as circlesUtils from 'utils/circles';

const CircleSizesLegend = styled(Td).attrs({
  colSpan: 4,
})`
  text-align: left;
  & > .cols {
    display: flex;
    align-items: center;
    svg {
      flex-grow: 0;
      flex-shrink: 0;
      width: 40px;
    }
    span {
      padding-left: 1em;
    }
  }
`;

const CircleTypeSymbol = styled.span`
  background-color: ${({ circle }) => circlesUtils.colorByValue(circle)};
  width: 10px;
  height: 10px;
  border: 1px solid black;
  border-radius: 100%;
  display: inline-block;
`;

const CircleTypeRow = ({ circle, print }) => {
  return (
    <tr>
      <td colSpan={5}>
        <span data-tip data-for={`tooltip-circle-${circle}`}>
          <CircleTypeSymbol circle={circle} />&nbsp;
          <Reduced>
            { !print ? (
                circlesUtils.droughtRegime(circle)
              ) : circlesUtils.droughtFullRegime(circle)
            }
          </Reduced>
        </span>
      </td>
    </tr>
  );
};
CircleTypeRow.propTypes = {
  circle: PropTypes.string,
  print: PropTypes.bool,
};

const NormalWeight = styled.span`font-weight: normal`;

const CirclesLegend = ({ filters, circleSizes, print }) => {
  const types = filters.circles.types;
  const visibleTypes = Object.keys(types)
    .map(k => types[k])
    .filter(t => t.visible);

  const isVisible = t => types[t].visible;
  const hasTypes = (types, ctrl) => {
    let i = 0;
    for (i; i < types.length; i += 1) {
      if (ctrl[types[i]].visible) {
        return true;
      }
    }
    return false;
  };

  return (
    <tbody>
      <tr>
        <TrName style={{ paddingTop: '5px' }}>
          <TrNameContent>Sécheresse</TrNameContent>
        </TrName>
      </tr>
      <tr>
        <Th align={'left'} style={{ marginTop: '-5px' }}>
          <LegendCategoryName>
            <span data-tip data-for="tooltip-nb-months">Nombre de mois secs</span>
            { print && (
              <NormalWeight>
                &nbsp;recevant moins de 30mm de précipitations
              </NormalWeight>
            )}
          </LegendCategoryName>
        </Th>
        { !print && (
          <CircleSizesLegend>
            <div className={'cols'}>
              <CircleSizesSymbol width={40} height={40} />
              <Reduced>Valeur exacte disponible au clic sur chaque cercle</Reduced>
            </div>
          </CircleSizesLegend>
        )}
      </tr>
      { print && (
        <tr>
          <td colSpan={5}>
            <PrintCircleMonthRangeLegend sizes={circleSizes} />
          </td>
        </tr>
      )}
      { visibleTypes.length > 0 && (
        <tr>
          <Th colSpan={2} align={'left'} style={{ marginTop: '-5px' }}>
            <LegendCategoryName>
              <span data-tip data-for="tooltip-regime">
                Périodes des sécheresses
              </span>
              { print && (
                <NormalWeight>&nbsp;et régimes des précipitations</NormalWeight>
              )}
            </LegendCategoryName>
          </Th>
        </tr>
      )}
      { hasTypes(['A', 'B'], types) && (
        <tr><Th colSpan={3} align={'left'}>
          <LegendCategoryName>
            <Reduced>Sécheresse d&#39;été dominante</Reduced>
          </LegendCategoryName>
        </Th></tr>
      )}
      {
        isVisible('A') && (
          <CircleTypeRow print={print} circle={'A'} />
        )
      }
      {
        isVisible('B') && (
          <CircleTypeRow print={print} circle={'B'} />
        )
      }

      { hasTypes(['C', 'D'], types) && (
        <tr><Th colSpan={3} align={'left'}>
          <LegendCategoryName>
            <Reduced>Sécheresse d&#39;hiver dominante</Reduced>
          </LegendCategoryName>
        </Th></tr>
      )}
      {
        isVisible('C') && (
          <CircleTypeRow print={print} circle={'C'} />
        )
      }
      {
        isVisible('D') && (
          <CircleTypeRow print={print} circle={'D'} />
        )
      }
      { hasTypes(['E', 'F'], types) && (
        <tr><Th align={'left'}>
          <LegendCategoryName>
            <Reduced>Régimes de transition</Reduced>
          </LegendCategoryName>
        </Th></tr>
      )}
      {
        isVisible('E') && (
          <CircleTypeRow print={print} circle={'E'} />
        )
      }
      {
        isVisible('F') && (
          <CircleTypeRow print={print} circle={'F'} />
        )
      }
    </tbody>
  );
};

CirclesLegend.propTypes = {
  print: PropTypes.bool,
  circleSizes: PropTypes.object,
  filters: PropTypes.object,
};

export default CirclesLegend;
