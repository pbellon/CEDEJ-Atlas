import React from 'react';
import Markdown from 'react-markdown';
import Tooltip from 'react-tooltip';
import styled from 'styled-components';
import { font } from 'styled-theme';
import * as circles from 'utils/circles';
import * as aridity from 'utils/aridity';

const LegendTooltipContent = styled.div`
  max-width: 400px;
  font-weight: normal;
`;
const Holder = styled.div`
  position: relative;
  z-index: 2000;
  font-family: ${font('primary')};
`;

const LegendTooltips = ()=>(
  <Holder>
    <Tooltip id="tooltip-nb-months">
      <LegendTooltipContent>
        <span>
          Recevant moins de 30mm de précipitations
        </span>
      </LegendTooltipContent>
    </Tooltip>
    <Tooltip id="tooltip-regime" place="right">
      <LegendTooltipContent>
        <span>
          Et régime des précipitations
        </span>
      </LegendTooltipContent>
    </Tooltip>

    { aridity.allAridity()
        .map(({ value, description }, key) => (
          <Tooltip
            key={key}
            place="right"
            id={`tooltip-aridity-${value}`}>
            <LegendTooltipContent>
              <Markdown source={description}/>
            </LegendTooltipContent>
          </Tooltip>
        )
    )}
    { circles.allDroughtRegimes()
        .map(({value, regime_full}, key) => (
          <Tooltip 
            key={key}
            place="right"
            class="custom-tooltip"
            id={`tooltip-circle-${value}`}>
            <LegendTooltipContent>
              <Markdown source={regime_full}/>
            </LegendTooltipContent>
          </Tooltip>
      ))
    }
  </Holder>
);

export default LegendTooltips;
