import React from 'react';
import styled from 'styled-components';

import {
  PrintOverlay,
  AtlasLegend,
} from 'components';

const PrintImage = styled.img`
  width: auto;
  height: 100%;
  margin: auto;
`;

const PrintLegend = styled(AtlasLegend)`
  font-family: Arial, sans-serif;
  .legend {
    overflow: visible;
  }
`;


const Page = styled.div.attrs({
  className:'print__page-break',
})`
  position: relative;
  height: 100vh;
`;

const Holder = styled.div`
  font-family: Arial, sans-serif;
`;

const rotateImg = (ref,{width, height})=>{
}

const PrintContainer = ({
  mapPreview,
  mapRef,
  layers,
  filters,
  width,
  height,
  ...props
}) => {
  const size = {width,height};
  return (
    <Holder {...props}>
      <Page>  
        <PrintImage
          ref={(ref)=>rotateImg(ref, size)}
          src={mapPreview}
          alt={'Render map'}
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
