import React from 'react';
import styled from 'styled-components';

import {
  PrintOverlay,
  AtlasLegend,
} from 'components';

const PrintLegend = styled(AtlasLegend)`
  transform: rotate(90deg);
`;
const PrintImage = styled.img`
  width: 100%;
`;

const Page = styled.div`
  padding: 15px;
  height: ${({height})=>height}px;
  width: ${({width})=>width}px;
`;
const Holder = styled.div`
  font-family: Arial, sans-serif;
`;


const PrintContainer = ({
  mapPreview,
  mapRef,
  layers,
  filters,
  width,
  height 
}) => {
  const size = {width,height};
  return (
    <Holder>
      <Page>  
        <PrintImage
          src={mapPreview}
          alt={'Render map'}
          width="100%"
          height="auto" />
      </Page>
      <Page>
        <PrintLegend
          filters={ filters }
          layers={ layers }
          print={true} />
      </Page>
    </Holder>
  );
}
export default PrintContainer;
