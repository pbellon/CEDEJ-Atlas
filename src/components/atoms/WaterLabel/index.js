import React from 'react';
import styled from 'styled-components'; 

const oceanFontSize = ({ feature: { properties: { scalerank } } }) => {
  switch (scalerank) {
    case 0: return '1.75em';
    case 1: return '1.5em';
    case 2: return '1.15em';
    default: return '1em';
  }
};

const oceanFontStyle = ({ feature: { properties: { featurecla } } }) => (
  featurecla === 'sea' ? 'italic' : 'normal'
);

const OceanLabel = styled.span`
  font-size: ${oceanFontSize};
  font-weight: bold;
  font-style: ${oceanFontStyle};
  color: #111583;
`;

const opacity = 0.6;
const color = `rgba(68,40,230,${opacity})`;
const LakeLabel = styled.span`
  font-style: italic;
  color: #6f9fdd;
  text-shadow: 1px 1px 0.05rem ${color},
    -1px -1px 0.05rem ${color},
    1px 0px 0.05rem${color},
    0px 1px 0.05rem ${color},
    -1px 0px 0.05rem ${color},
    0px -1px 0.05rem ${color};
`;


const WaterLabel = (props) => {
  switch (props.feature.properties.featurecla) {
    case 'sea':
    case 'gulf':
    case 'ocean':
      return <OceanLabel {...props} />;
    default: return <LakeLabel {...props} /> ;
  }
}

export default WaterLabel;
