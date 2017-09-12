import React, { Component } from 'react'; 
import styled from 'styled-components';
import Tooltip from 'react-tooltip';
import Markdown from 'react-markdown';
import {
  LegendCategoryName, 
  Reduced,
  Td,
  Th,
  TrName,
  TrNameContent,
} from 'components';
import { inRange, visibleTypes } from 'utils'; 

import * as patternUtils from 'utils/patterns';
import * as boundaries from 'utils/boundaries';
import * as aridityUtils from 'utils/aridity';

import { findByValue as findTemperature } from 'utils/temperatures';

const areaPatternPath = ({ width: w, height:h })=>`
  M2,2L${w - 2},2L${w - 2},${h - 2}L2,${h - 2}Z
`;

class AreaPattern extends Component {
  drawCanvas(canvas) {
    if(!canvas){ return; } 
    const { patterns, aridity, temperature } = this.props;
    const context = canvas.getContext('2d');
    let pattern; 
    
    if(aridity){ pattern = patterns.findByKey(aridity.name); }
    const p = areaPatternPath(canvas);
    const props = new boundaries.pathProperties(p);
    const path = {
      isExterior: true,
      path: p,
      properties: props,
      length: props.totalLength()
    };

    const p2d = new Path2D(path.path);

    context.fillStyle = temperature.color;
    context.fill(p2d);
    
    if(pattern && pattern.stripes){

      context.globalCompositeOperation = 'destination-out';
      context.fillStyle = pattern.canvasPattern;
      context.beginPath();
      context.fill(p2d);
      context.closePath();
    }
    if(aridity){
      context.globalCompositeOperation = 'source-over';
      boundaries.addBoundary({ context, path, pattern, gap: 20 });
    } 
  
  }

  render() {
    return (
      <Td>
        <canvas
          width={ 35 }
          height={ 15 }
          ref={(canvas)=>this.drawCanvas(canvas)}/>
      </Td>
    );
  }
}

const SummerName = styled(Reduced)`
  padding-left: 7px;
`;
const VeryHotSummer = () => (
  <SummerName>été très chaud (plus de 30°)</SummerName>
);

const HotSummer = () => (<SummerName>été chaud (20 à 30°)</SummerName>)
const TemperedSummer = () => (<SummerName>été tempéré (10 à 20°)</SummerName>)
const WinterName = ({ children }) => (
  <tr>
    <Th align={'left'}>
      <LegendCategoryName><Reduced>{ children }</Reduced></LegendCategoryName>
    </Th>
  </tr>
);

const TemperatureRow = ({ name, temperature, patterns, aridity })=>{
  const temp = findTemperature(temperature);
  const visibleAridities = visibleTypes(aridity);
  return (
    <tr>
      <Td align={'left'}>{ name }</Td>
      {
        visibleAridities.map((ar,key) => (
          <AreaPattern
            key={key}
            patterns={ patterns } aridity={ ar }
            temperature={ temp }/>
            
        ))
      }
      {
        (visibleAridities.length === 0) && (
          <AreaPattern temperature={ temp }/>
        )
      }
    </tr>
  );
};

const AridityName = ({ aridity }) => {
  const style = {
    fontSize: '0.65rem',
    lineHeight: '0.7rem',
  };
  return (
    <Th
      style={style}
      width={40}
      data-tip 
      data-for={`tooltip-aridity-${aridity.name}` }>
      { aridityUtils.getName(aridity) }
    </Th>
  )

};

const AridityNames = ({ aridity })=>{
  const visibleAridities = visibleTypes(aridity);
  if(!visibleAridities.length){ return null; }
  return (
    <tr>
      <TrName><TrNameContent>Aridité</TrNameContent></TrName>
      { visibleAridities.map((aridity, key) => (
        <AridityName aridity={ aridity } key={ key }/>
      ))}
    </tr>
  );
};


const Temperatures = ({
  filters: {
    temperatures:{ summer, winter },
    aridity,
  }
}) => {

  const patterns = patternUtils.initPatterns();
  const srange = summer.range;
  const wrange = winter.range;
  return (
    <tbody>
      <AridityNames aridity={ aridity }/>
      <tr>
        <TrName><TrNameContent>Températures</TrNameContent></TrName>
      </tr>
      { inRange([20,30], wrange) && ([
        (<WinterName key={'h-0'}>Hiver chaud (20 à 30°)</WinterName>),
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
          (<WinterName key={'h-1'}>Hiver tempéré (10 à 20°)</WinterName>),
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
          (<WinterName key={'h-2'}>Hiver frais (0 à 10°)</WinterName>),
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
          (<WinterName key={'h-3'}>Hiver froid (moins de 0°)</WinterName>),
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


export default Temperatures; 
