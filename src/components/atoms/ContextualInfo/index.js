import React from 'react';
import styled from 'styled-components';

const Holder = styled.div`
  display: ${({visible})=>visible?'block':'none'};
`;

const temp = ({ temperatures: { properties }})=>properties.Temperatur; 
const aridity = ({ aridity: { properties }})=>properties.d_TYPE; 
const drought = ({ circles: { properties }})=>properties.colours;

const ContextualInfo = ({ visible, data})=>(<Holder visible={ visible }>
  { data && data.temperatures && (
    <span><b>Températures:</b>{ temp(data) }</span>
  )}
  { data && data.aridity && (
    <span><b>Aridity:</b>{ aridity(data) }</span>
  )}
  { data && data.circles && (
    <span><b>Sécheresse:</b>{ drought(data) }</span>
  )}
</Holder>);

export default ContextualInfo; 
