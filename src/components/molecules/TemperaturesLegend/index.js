import React, { Component } from 'react'; 
import styled from 'styled-components';
import createFragment from 'react-addons-create-fragment'; 

import {
  LegendCategoryName, 
  Reduced,
  Td,
  Th,
  TrName,
  TrNameContent,
  TemperatureLegendPattern,
} from 'components';
import { inRange, visibleTypes } from 'utils'; 

import * as patternUtils from 'utils/patterns';
import * as aridityUtils from 'utils/aridity';

import { findByValue as findTemperature } from 'utils/temperatures';


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

const TemperatureRow = ({
  name,
  temperature,
  patterns,
  aridity,
  layers: {
    aridity:{visible:showAridity},
  }
})=>{
  const temp = findTemperature(temperature);
  const visibleAridities = showAridity ? visibleTypes(aridity) : [];
  return (
    <tr>
      <Td align={'left'}>{ name }</Td>
      {
        visibleAridities.map((ar,key) => (
          <TemperatureLegendPattern
            key={key}
            patterns={ patterns } aridity={ ar }
            temperature={ temp }/>
            
        ))
      }
      {
        (visibleAridities.length === 0) && (
          <TemperatureLegendPattern temperature={ temp }/>
        )
      }
    </tr>
  );
};

const ATh = styled(Td)`
  font-size: 0.65rem;
  line-height: 0.7rem;
  .legend--print & {
    width: 60px;
    font-weight: bold;
  
  }
`;

const AridityName = ({ aridity }) => (
  <ATh
    width={40}
    data-tip 
    data-for={`tooltip-aridity-${aridity.name}` }>
    { aridityUtils.getName(aridity) }
  </ATh>
);
const ATd = styled(Td)`
  font-size: 0.6rem;
  line-height: 0.6rem;
`;

const AridityPrecipitations = ({aridity})=>(
  <ATd>
    P/Etp<br/>{ aridityUtils.getPrecipitations(aridity) }
  </ATd>
);

const AridityNames = ({ aridity, print })=>{
  const visibleAridities = visibleTypes(aridity);
  if(!visibleAridities.length){ return null; }
  return [
    <tr>
      <TrName><TrNameContent>Aridité</TrNameContent></TrName>
      { visibleAridities.map((aridity, key) => (
        <AridityName aridity={ aridity } key={ key }/>
      ))}
    </tr>,

    print ? (
      <tr>
        <td></td>
        { visibleAridities.map((aridity, key) => (
          <AridityPrecipitations key={key} aridity={aridity}/>
        ))}
      </tr>
    ) : null
  ];
};

const TemperaturesRows = ({
  temperatures: {
    summer,
    winter,
  },
  aridity,
  patterns,
  layers,
})=>(
  [
    (<tr key={'h-h'}>
      <TrName><TrNameContent>Températures</TrNameContent></TrName>
    </tr>
    ),
    winter.A.visible && ([
      (<WinterName key={'h-0'}>Hiver chaud (20 à 30°C)</WinterName>),
      summer.A.visible ? (
        <TemperatureRow layers={layers}
        name={(<VeryHotSummer />)}
        key={0}
        temperature={1}
        patterns={patterns}
        aridity={aridity} />
      ) : null,
      summer.B.visible ? (
        <TemperatureRow layers={layers} 
        key={1}
        name={(<HotSummer />)}
        aridity={aridity}
        temperature={2}
        patterns={patterns} />
      ) : null,
    ]),
    winter.B.visible && ([
      (<WinterName key={'h-1'}>Hiver tempéré (10 à 20°)</WinterName>),
      summer.A.visible ? (
        <TemperatureRow layers={layers}
        key={2}
        name={(<VeryHotSummer />)}
        temperature={3}
        patterns={patterns}
        aridity={aridity} />
      ) : null,                                 
      summer.B.visible ? (
        <TemperatureRow layers={layers}
        key={3}
        name={(<HotSummer />)}
        temperature={4}
        patterns={patterns}
        aridity={aridity} />
      ) : null,
      summer.C.visible ? (
        <TemperatureRow layers={layers}
        key={4}
        name={(<TemperedSummer />)}
        temperature={5}
        patterns={patterns}
        aridity={aridity} />
      ) : null,
    ]),
    winter.C.visible && ([
      (<WinterName key={'h-2'}>Hiver frais (0 à 10°)</WinterName>),
      summer.A.visible ? (
        <TemperatureRow layers={layers}
        key={5}
        name={(<VeryHotSummer />)}
        temperature={6}
        patterns={patterns}
        aridity={aridity} />
      ) : null,
      summer.B.visible ? (
        <TemperatureRow layers={layers}
        key={6}  
        name={(<HotSummer />)}
        temperature={7}
        patterns={patterns}
        aridity={aridity} />
      ) : null,
      summer.C.visible ? (
        <TemperatureRow layers={layers}
        key={7}
        name={(<TemperedSummer />)}
        temperature={8}
        patterns={patterns}
        aridity={aridity} />
      ) : null,
    ]),
    winter.D.visible && ([
      (<WinterName key={'h-3'}>Hiver froid (moins de 0°)</WinterName>),
      summer.A.visible ? (
        <TemperatureRow layers={layers}
        key={8}
        name={(<VeryHotSummer />)}
        temperature={9}
        patterns={patterns}
        aridity={aridity} />
      ) : null,
      summer.B.visible ? (
        <TemperatureRow layers={layers}
        key={9}
        name={(<HotSummer />)}
        temperature={10}
        patterns={patterns}
        aridity={aridity} />
      ) : null,
      summer.C.visible ? (
        <TemperatureRow layers={layers}
        key={10}
        name={(<TemperedSummer />)}
        temperature={11}
        patterns={patterns}
        aridity={aridity} />
      ) : null,
    ]),
  ]
);
const Temperatures = ({
  print,
  filters: {
    temperatures:{ summer, winter },
    aridity,
  },
  layers: {
    temperatures: { visible:showTemperatures },
    aridity: { visible:showAridity },
  }
}) => {
  const layers = {
    temperatures:{ visible:showTemperatures },
    aridity: { visible: showAridity },
  };
  const hasVisibleAridity = showAridity && visibleTypes(aridity).length > 0;
  const hasVisibleTemperatures = showTemperatures && (
    visibleTypes(winter).length > 0 && visibleTypes(summer).length > 0
  );
 
  const patterns = patternUtils.initPatterns();
  const temperatureRows = hasVisibleTemperatures ? TemperaturesRows(
    {
      temperatures:{summer,winter},
      aridity,
      patterns,
      layers,
    }
  ): null;
  const tempsRowsFragment = createFragment({temperatures:temperatureRows});
  
  const aridityNamesRows = hasVisibleAridity ? AridityNames({
    aridity,
    print,
  }) : null;
  const aridityNamesFragment = createFragment({aridity:aridityNamesRows});
  return (
    <tbody>
    {[
      aridityNamesFragment,
      tempsRowsFragment,
      !hasVisibleTemperatures && hasVisibleAridity? (
        <TemperatureRow layers={layers}
          key={'aridity-row'}
          aridity={aridity}
          patterns={patterns}/>
      ): null,
    ]}
    </tbody>
  );
};


export default Temperatures; 
