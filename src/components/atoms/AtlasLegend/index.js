import React from 'react';
import styled from 'styled-components';
// import { font, palette } from 'styled-theme'

const Section = styled.div`
  width: 300px;
`;

const SectionTitle = styled.h3`
  color: blue;
`;

const SectionContent = styled.div`
  padding-left: 30px;
`;

const AtlasLegend = () => {
  return (
    <div>
      <Section>
        <SectionTitle>Température / Aridité</SectionTitle>
        <SectionContent>
          Test
        </SectionContent>
      </Section>
    </div>
  );
};

export default AtlasLegend;
