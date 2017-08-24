import React from 'react';
import styled from 'styled-components';

const Holder = styled.div`
  display: ${({visible})=>visible?'block':'none'};
`;

const temp = ({ temperatures: { properties }})=>properties.Temperatur; 
const aridity = ({ aridity: { properties }})=>properties.d_TYPE; 
const drought = ({ circles: { properties }})=>properties.colours;

const InfoList = styled.ul`
  list-style: none;
  margin: 0;
  padding:0;
`;
const Info = styled.li`
  margin: 0;
  padding: 0;
`;

const ContextualInfo = ({ visible, data})=>(<Holder visible={ visible }>
  <InfoList>
  { data && data.temperatures && (
    <Info><span><b>Températures:</b>{ temp(data) }</span></Info>
  )}
  { data && data.aridity && (
    <Info><span><b>Aridity:</b>{ aridity(data) }</span></Info>
  )}
  { data && data.circles && (
    <Info><span><b>Sécheresse:</b>{ drought(data) }</span></Info>
  )}
  </InfoList>
</Holder>);

export default ContextualInfo; 
