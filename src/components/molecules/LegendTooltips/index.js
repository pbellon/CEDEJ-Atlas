import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import Tooltip from 'react-tooltip';
import styled from 'styled-components';
import { font } from 'styled-theme';
import * as circles from 'utils/circles';
import * as aridity from 'utils/aridity';
import { visibleTypes, updateTooltips } from 'utils'; 

const LegendTooltipContent = styled.div`
  max-width: 400px;
  font-weight: normal;
`;
const Holder = styled.div`
  position: relative;
  z-index: 2000;
  font-family: ${font('primary')};
`;

class LegendTooltips extends Component {
  shouldComponentUpdate({layers:toLayers,filters:toFilters}){
    const {
      layers:{
        circles:{visible:circlesVisible},
        aridity:{visible:aridityVisible}
      },
      filters:{
        circles:{types},
        aridity
      }
    } = this.props;
    let shouldUpdateTooltips = (
      circlesVisible != toLayers.circles.visible
    ) || (
      aridityVisible != toLayers.aridity.visible
    ) || (
      visibleTypes(types).length != visibleTypes(toFilters.circles.types).length
    ) || (
      visibleTypes(aridity).length != visibleTypes(toFilters.aridity).length
    );

    if(shouldUpdateTooltips){
      updateTooltips();
    }

    return false;
  }
  render(){
    return (
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
  }
}
export default LegendTooltips;
