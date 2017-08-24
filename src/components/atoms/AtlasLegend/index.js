import React from 'react';

import { connect } from 'react-redux';
import styled from 'styled-components';
// import { font, palette } from 'styled-theme'
import { ContextualInfo } from 'components'; 
import { fromAtlas } from 'store/selectors';
const Section = styled.div`
  width: 300px;
`;

const SectionTitle = styled.h3`
  color: blue;
`;

const SectionContent = styled.div`
  padding-left: 30px;
`;

const Legend = styled.div`
  position: absolute;
  z-index: 1000;
  bottom: 20px;
  left: 15px;
`;
const AtlasLegend = ({ showContextualInfo, contextualData }) => {
  return (
    <Legend>
      { contextualData && (
        <ContextualInfo visible={ showContextualInfo } data={ contextualData }/>
      )}
    </Legend>
  );
};

const mapStateToProps = (state)=>({
  showContextualInfo: fromAtlas.isContextualInfoVisible(state),
  contextualData: fromAtlas.contextualInfo(state)
})

export default connect(mapStateToProps)(AtlasLegend);
