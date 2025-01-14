import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import * as circlesUtils from 'utils/circles';
import * as temperaturesUtils from 'utils/temperatures';
import * as aridityUtils from 'utils/aridity';

const Holder = styled.div`
`;

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
  temperatures: {
    properties: { Temperatur },
  },
}) => {
  const summerRange = temperaturesUtils.getSummerRange(Temperatur);
  const winterRange = temperaturesUtils.getWinterRange(Temperatur);
  return (
    <Info>
      <InfoRow
        title={'Températures en été'}
        info={
          <span>
            {(summerRange.length === 1) && (
              <span>Plus de { summerRange[0] } degrés</span>
            )}
            { (summerRange.length > 1) && (
              <span>Entre { summerRange[0] } et { summerRange[1] } degrés</span>
            )}
          </span>
        }
      />
      <InfoRow
        title={'Températures en hiver'}
        info={
          <span>
            {(winterRange.length === 1) && (
              <span>Moins de { winterRange[0] } degrés</span>
            )}
            { (winterRange.length > 1) && (
              <span>Entre { winterRange[0] } et { winterRange[1] } degrés</span>
            )}
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
  aridity: {
    properties: { d_TYPE },
  },
}) => (
  <Info>
    <InfoRow title={'Type d\'aridité'} info={aridityUtils.getName(d_TYPE)} />
  </Info>
);

AridityInfo.propTypes = {
  aridity: PropTypes.object,
};

const CirclesInfo = ({
  circles: {
    properties: {
      size_,
      colours,
    },
  },
}) => {
  const droughtMonths = circlesUtils.getDroughtMonths(size_);
  return (
    <Info>
      <InfoRow
        title={'Régime de précipitation'}
        info={
          <span>{ circlesUtils.droughtRegimeSingle(colours) }</span>
        }
      />
      <InfoRow
        title={'Nombre de mois de sécheresse'}
        info={
          <span>
            { size_ === '01' && (<span>Moins de &nbsp;</span>)}
            { droughtMonths.length > 1 && (
              <span>De { droughtMonths[0] } à { droughtMonths[1] }&nbsp;</span>
            )}
            { droughtMonths.length === 1 && (
              <span>{ droughtMonths[0] }&nbsp;</span>
            )}
            mois
          </span>
        }
      />
    </Info>
  );
};

CirclesInfo.propTypes = {
  circles: PropTypes.object,
};

const ContextualInfo = ({ data: { temperatures, aridity, circles } }) => {
  if (!temperatures && !aridity && !circles) { return null; }
  return (
    <Holder>
      <InfoList>
        { temperatures && (<TemperaturesInfo temperatures={temperatures} />) }
        { aridity && (<AridityInfo aridity={aridity} />) }
        { circles && (<CirclesInfo circles={circles} />) }
      </InfoList>
    </Holder>
  );
};

ContextualInfo.propTypes = {
  data: PropTypes.object,
};

export default ContextualInfo;
