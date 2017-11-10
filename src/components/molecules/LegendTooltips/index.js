import React, { Component } from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import Tooltip from 'react-tooltip';
import styled from 'styled-components';
import { font } from 'styled-theme';
import * as circles from 'utils/circles';
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
  shouldComponentUpdate({ layers: toLayers, filters: toFilters }) {
    const {
      layers: {
        circles: { visible: circlesVisible },
        aridity: { visible: aridityVisible },
      },
      filters: {
        circles: { types },
        aridity,
      },
    } = this.props;

    const shouldUpdateTooltips = (
      circlesVisible !== toLayers.circles.visible
    ) || (
      aridityVisible !== toLayers.aridity.visible
    ) || (
      visibleTypes(types).length !== visibleTypes(toFilters.circles.types).length
    ) || (
      visibleTypes(aridity).length !== visibleTypes(toFilters.aridity).length
    );

    if (shouldUpdateTooltips) {
      updateTooltips();
    }

    return false;
  }
  render() {
    const { t } = this.props;
    const aridity = t('aridity', { returnObjects: true });
    const droughts = t('drought', { returnObjects: true });
    return (
      <Holder>
        <Tooltip id="tooltip-nb-months">
          <LegendTooltipContent>
            <span>
              {t('legend.drought.numberOfMonthsDescription')}
            </span>
          </LegendTooltipContent>
        </Tooltip>
        <Tooltip id="tooltip-regime" place="right">
          <LegendTooltipContent>
            <span>
              { t('legend.drought.periodsPrint') }
            </span>
          </LegendTooltipContent>
        </Tooltip>

        {
          Object.keys(aridity)
            .map((key) => {
              const { description } = aridity[key];
              if(!description){ return null; }
              return (
                <Tooltip
                  key={key}
                  place="right"
                  id={`tooltip-aridity-${key}`}
                >
                  <LegendTooltipContent>
                    <Markdown source={description} />
                  </LegendTooltipContent>
                </Tooltip>
              )
            })
        }
        {
          Object.keys(droughts).map(
            (key) => {
              const { regime_full } = droughts[key];
              if(!regime_full){ return null; }
              return (
                <Tooltip
                  key={key}
                  place="right"
                  className="custom-tooltip"
                  id={`tooltip-circle-${key}`}
                >
                  <LegendTooltipContent>
                    <Markdown source={regime_full} />
                  </LegendTooltipContent>
                </Tooltip>
              );
            }
          )
        }
      </Holder>
    );
  }
}

LegendTooltips.propTypes = {
  layers: PropTypes.object,
  filters: PropTypes.object,
};

export default translate('atlas',{wait: true})(LegendTooltips);
