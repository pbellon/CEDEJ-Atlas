import React from 'react';
import { translate } from 'react-i18next';

import styled from 'styled-components';
import PropTypes from 'prop-types';

import * as circlesUtils from 'utils/circles';
import * as temperaturesUtils from 'utils/temperatures';
import * as aridityUtils from 'utils/aridity';

const InfoList = styled.ul`
  list-style: none;
  margin: 0;
  padding:0;
`;
const Info = styled.li`
  margin: 0;
  padding: 0;
`;

const InfoRow = ({ title, info }) => (
  <div><b>{ title }:</b>&nbsp;{ info }</div>
);

InfoRow.propTypes = {
  title: PropTypes.string,
  info: PropTypes.node,
};

const TemperaturesInfo = ({
  t,
  temperatures: {
    properties: { Temperatur },
  },
}) => {
  const summerRange = temperaturesUtils.getSummerRange(Temperatur);
  const [ s0, s1 ] = summerRange.length > 1 ? summerRange : [ summerRange[0], null ];
  const winterRange = temperaturesUtils.getWinterRange(Temperatur);
  const [ w0, w1 ] = winterRange.length > 1 ? winterRange : [ winterRange[0], null ];
  
  return (
    <Info>
      <InfoRow
        title={t('popup.summerTemperatures')}
        info={
          <span>
            { t('popup.summerRange', { count:summerRange.length, s0, s1 }) }
          </span>
        }
      />
      <InfoRow
        title={t('popup.winterTemperatures')}
        info={
          <span>
            { t('popup.winterRange', { count:winterRange.length, w0, w1 }) }
          </span>
        }
      />
    </Info>
  );
};

TemperaturesInfo.propTypes = {
  temperatures: PropTypes.object,
};

const AridityInfo = ({
  t,
  aridity: {
    properties: { d_TYPE },
  },
}) => (
  <Info>
    <InfoRow title={t('popup.aridityType')} info={aridityUtils.getName(d_TYPE)} />
  </Info>
);

AridityInfo.propTypes = {
  aridity: PropTypes.object,
};

const CirclesInfo = ({
  t,
  circles: {
    properties: {
      size_,
      colours,
    },
  },
}) => {
  const dRange = circlesUtils.getDroughtMonths(size_);
  const [ d0, d1 ] = dRange.length > 1 ? dRange : [dRange[0]];
  return (
    <Info>
      <InfoRow
        title={t('popup.precipitationRegimeLabel')}
        info={
          <span>{ circlesUtils.droughtRegimeSingle(colours) }</span>
        }
      />
      <InfoRow
        title={t('popup.droughtMonthsLabel')}
        info={
          <span>
            {
                t(`popup.droughtMonths_${size_ === '01' ? 0 : dRange.length}`, { d0,d1 })
            }
          </span>
        }
      />
    </Info>
  );
};

CirclesInfo.propTypes = {
  circles: PropTypes.object,
};

const Holder = styled.div`
  min-width: 280px;
`;

const ContextualInfo = ({ t, data: { temperatures, aridity, circles } }) => {
  if (!temperatures && !aridity && !circles) { return null; }
  return (
    <Holder>
      <InfoList>
        { temperatures && (<TemperaturesInfo t={t} temperatures={temperatures} />) }
        { aridity && (<AridityInfo t={t} aridity={aridity} />) }
        { circles && (<CirclesInfo t={t} circles={circles} />) }
      </InfoList>
    </Holder>
  );
};

ContextualInfo.propTypes = {
  data: PropTypes.object,
};

export default translate('atlas')(ContextualInfo);
