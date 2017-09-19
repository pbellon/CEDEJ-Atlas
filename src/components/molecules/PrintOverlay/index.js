import React from 'react';
import styled from 'styled-components';


const Holder = styled.div`
`;

const PrintOverlay = ({mapReference}) => {
  debugger;
  const bindOverlay = (ref)=>{
    ref.appendChild();
  };
  return (<Holder innerRef={(ref)=>bindOverlay(ref)}>
          
  </Holder>);
};

export default PrintOverlay;
