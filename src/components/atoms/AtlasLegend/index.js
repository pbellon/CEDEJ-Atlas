import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import styled from 'styled-components';
import { font, palette } from 'styled-theme'
import { ContextualInfo, Heading } from 'components'; 
import { fromAtlas, fromFilters } from 'store/selectors';

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
  background: white;
  position: absolute;
  z-index: 1000;
  top: 85px;
  left: 14px;
  padding: 5px;
`;

const TrName = styled.th`
  background: #bbb;
  text-transform: uppercase;
`;

const visibleAridity = ({ aridity })=>{
  return Object.keys(aridity)
    .map((name)=>aridity[name])
    .filter((aridity_f)=>aridity_f.visible);
}

const AridityNames = ({ filters })=>(
  <thead>
    <tr>
      <TrName>Aridité</TrName>
      { visibleAridity(filters).map((aridity, key) => (
        <th key={ key }>{ aridity.name }</th>
      ))}
    </tr>
  </thead>
);

AridityNames.propTypes = { filters: PropTypes.object }; 
const Table = styled.table``;

const Temperatures = ({ filters: { temperatures }})=>(
  <tbody>
    <tr>
      <TrName>Températures</TrName>
    </tr>
      
  </tbody>
);


const LegendContent = ({ filters })=>(
  <div>
    <Heading level={ 5 } uppercase={ true }>
      Conditions climatiques des régions arides
    </Heading>

    <Table>
      <AridityNames filters={ filters }/>
      <Temperatures filters={ filters }/>
    </Table>
  </div>
)

const AtlasLegend = ({ showContextualInfo, contextualData, filters }) => {
  return (
    <Legend>
      <LegendContent filters={ filters }/>
      { contextualData && (
        <ContextualInfo visible={ showContextualInfo } data={ contextualData }/>
      )}
    </Legend>
  );
};

const mapStateToProps = (state)=>({
  filters: fromFilters.filters(state),
  showContextualInfo: fromAtlas.isContextualInfoVisible(state),
  contextualData: fromAtlas.contextualInfo(state)
})

export default connect(mapStateToProps)(AtlasLegend);
