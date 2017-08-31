import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import styled from 'styled-components';
import { font, palette } from 'styled-theme'
import { ContextualInfo, Heading } from 'components'; 
import { fromAtlas, fromFilters } from 'store/selectors';
import { inRange } from 'utils';
import { findByValue as findTemperature } from 'utils/temperatures';

import * as patternUtils from 'utils/patterns';
import * as boundaries from 'utils/boundaries';
import * as aridityUtils from 'utils/aridity';

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

const Th = styled.th`
  padding: 2px;
  text-align: ${({ align='left' }) => align};
`;

const Td = styled.td`
  padding: 2px;
`;

const visibleAridity = ({ aridity }) => {
  return Object.keys(aridity)
    .map((name)=>aridity[name])
    .filter((aridity_f)=>aridity_f.visible);
};

const aridityPrecipitations = (aridity) => {
  

}


const AridityNames = ({ filters })=>(
  <thead>
    <tr>
      <TrName>Aridité</TrName>
      { visibleAridity(filters).map((aridity, key) => (
        <Th key={ key }>{ aridityUtils.getName(aridity) }</Th>
      ))}
    </tr>
    <tr>
      <td></td>
      { visibleAridity(filters).map((aridity, key) => (
        <Td key={ key }>
          P/Etp<br/>
          { aridityUtils.getPrecipitations(aridity) }
        </Td>
      ))}
 
    </tr>
  </thead>
);

class AreaPattern extends Component {
  drawCanvas(canvas) {
    if(!canvas){ return; } 
    const { patterns, aridity, temperature } = this.props;
    const context = canvas.getContext('2d');
    const pattern = patterns.findByKey(aridity.name);
    const { width, height } = canvas;
    const w = width;
    const h = height;
    const p = `M2,2L${w - 2},2L${w - 2},${h - 2}L2,${h - 2}Z`;
    const props = new boundaries.pathProperties(p)

    const path = {
      isExterior: true,
      path: p,
      properties: props,
      length: props.totalLength()
    };

    const p2d = new Path2D(path.path);

    context.fillStyle = temperature.color;
    context.fill(p2d);
    
    if(pattern.stripes){

      context.globalCompositeOperation = 'destination-out';
      context.fillStyle = pattern.canvasPattern;
      context.beginPath();
      context.fill(p2d);
      context.closePath();
    }

    context.globalCompositeOperation = 'source-over';
    boundaries.addBoundary({ context, path, pattern, gap: 15 });
   
  
  }

  render() {
    return (
      <td>
        <canvas
          width={ 40 }
          height={ 20 }
          ref={(canvas)=>this.drawCanvas(canvas)}/>
      </td>
    );
  }
}

AridityNames.propTypes = { filters: PropTypes.object }; 
const Table = styled.table``;

const TemperatureRow = ({ name, temperature, patterns, aridity })=>{
  const temp = findTemperature(temperature);
  return (
    <tr>
      <td>{ name }</td>
      {
        visibleAridity({ aridity }).map((ar,key) => (
          <AreaPattern
            key={key}
            patterns={ patterns } aridity={ ar }
            temperature={ temp }/>
            
        ))
      }
    </tr>
  );
};

const SummerName = styled.span`
  padding-left: 7px;
`;
const VeryHotSummer = () => (<SummerName>été très chaud (plus de 30°)</SummerName>)
const HotSummer = () => (<SummerName>été chaud (20 à 30°)</SummerName>)
const TemperedSummer = () => (<SummerName>été très chaud (10 à 20°)</SummerName>)

const Temperatures = ({
  patterns, 
  filters: {
    temperatures:{ summer, winter },
    aridity,
  }
}) => {
  const srange = summer.range;
  const wrange = winter.range;
  return (
    <tbody>
      <tr>
        <TrName>Températures</TrName>
      </tr>
      { inRange([20,30], wrange) && ([
        (<tr key={'h-0'}><Th>Hiver chaud (20 à 30°)</Th></tr>),
        inRange([30], srange) ? (
          <TemperatureRow
            name={(<VeryHotSummer />)}
            key={0}
            temperature={1}
            patterns={patterns}
            aridity={aridity} />
        ) : null,
        inRange([20, 30], srange) ? (
          <TemperatureRow 
            key={1}
            name={(<HotSummer />)}
            aridity={aridity}
            temperature={2}
            patterns={patterns} />
        ) : null,
      ])}
      {
        inRange([10, 20], wrange) && ([
          (<tr key={'h-1'}><Th>Hiver tempéré (10 à 20°)</Th></tr>),
          inRange([30], srange) ? (
            <TemperatureRow
              key={2}
              name={(<VeryHotSummer />)}
              temperature={3}
              patterns={patterns}
              aridity={aridity} />
          ) : null,                                 
          inRange([20, 30], srange) ? (
            <TemperatureRow
              key={3}
              name={(<HotSummer />)}
              temperature={4}
              patterns={patterns}
              aridity={aridity} />
          ) : null,
          inRange([10, 20], srange) ? (
            <TemperatureRow
              key={4}
              name={(<TemperedSummer />)}
              temperature={5}
              patterns={patterns}
              aridity={aridity} />
          ) : null,
        ])
      }
      {
        inRange([0, 10], wrange) && ([
          (<tr key={'h-2'}><Th>Hiver frais (0 à 10°)</Th></tr>),
          inRange([30], srange) ? (
            <TemperatureRow
              key={5}
              name={(<VeryHotSummer />)}
              temperature={6}
              patterns={patterns}
              aridity={aridity} />
          ) : null,
          inRange([20, 30], srange) ? (
            <TemperatureRow
              key={6}  
              name={(<HotSummer />)}
              temperature={7}
              patterns={patterns}
              aridity={aridity} />
          ) : null,
          inRange([10, 20], srange) ? (
            <TemperatureRow
              key={7}
              name={(<TemperedSummer />)}
              temperature={8}
              patterns={patterns}
              aridity={aridity} />
          ) : null,
        ])
      }
      {
        inRange([0], wrange) && ([
          (<tr key={'h-3'}><Th>Hiver froid (moins de 0°)</Th></tr>),
          inRange([30], srange) ? (
            <TemperatureRow
              key={8}
              name={(<VeryHotSummer />)}
              temperature={9}
              patterns={patterns}
              aridity={aridity} />
          ) : null,
          inRange([20, 30], srange) ? (
            <TemperatureRow
              key={9}
              name={(<HotSummer />)}
              temperature={10}
              patterns={patterns}
              aridity={aridity} />
          ) : null,
          inRange([10, 20], srange) ? (
            <TemperatureRow
              key={10}
              name={(<TemperedSummer />)}
              temperature={11}
              patterns={patterns}
              aridity={aridity} />
          ) : null,

          
        ])
      }
    </tbody>
  );
};


const LegendContent = ({ filters })=>{
  const patterns = patternUtils.initPatterns();
  return (
    <div>
      <Heading level={ 5 } uppercase={ true }>
        Conditions climatiques des régions arides
      </Heading>

      <Table>
        <AridityNames filters={ filters }/>
        <Temperatures filters={ filters } patterns={ patterns }/>
      </Table>
    </div>
  );
}
const AtlasLegend = ({ showContextualInfo, contextualData, filters }) => {
  console.log('filters', filters);
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
});

export default connect(mapStateToProps)(AtlasLegend);

console.log('why so mad?');
