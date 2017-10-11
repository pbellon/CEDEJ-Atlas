import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  LegendCategoryName,
  Th,
  TrName,
  TrNameContent,
  TemperatureLegendRow,
  Reduced,
} from 'components';

const WinterName = ({ children }) => (
  <tr>
    <Th align={'left'}>
      <LegendCategoryName><Reduced>{ children }</Reduced></LegendCategoryName>
    </Th>
  </tr>
);

const SummerName = styled(Reduced)`
  padding-left: 7px;
`;

const VeryHotSummer = () => (
  <SummerName>été très chaud (plus de 30°)</SummerName>
);

const HotSummer = () => (<SummerName>été chaud (20 à 30°)</SummerName>);
const TemperedSummer = () => (<SummerName>été tempéré (10 à 20°)</SummerName>);

WinterName.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

const TemperatureLegendRows = ({
  temperatures: {
    summer,
    winter,
  },
  aridity,
  patterns,
  layers,
}) => (
  [
    (<tr key={'h-h'}>
      <TrName><TrNameContent>Températures</TrNameContent></TrName>
    </tr>
    ),
    winter.A.visible && ([
      (<WinterName key={'h-0'}>Hiver chaud (20 à 30°C)</WinterName>),
      summer.A.visible ? (
        <TemperatureLegendRow
          layers={layers}
          name={(<VeryHotSummer />)}
          key={0}
          temperature={1}
          patterns={patterns}
          aridity={aridity}
        />
      ) : null,
      summer.B.visible ? (
        <TemperatureLegendRow
          layers={layers}
          key={1}
          name={(<HotSummer />)}
          aridity={aridity}
          temperature={2}
          patterns={patterns}
        />
      ) : null,
    ]),
    winter.B.visible && ([
      (<WinterName key={'h-1'}>Hiver tempéré (10 à 20°)</WinterName>),
      summer.A.visible ? (
        <TemperatureLegendRow
          layers={layers}
          key={2}
          name={(<VeryHotSummer />)}
          temperature={3}
          patterns={patterns}
          aridity={aridity}
        />
      ) : null,
      summer.B.visible ? (
        <TemperatureLegendRow
          layers={layers}
          key={3}
          name={(<HotSummer />)}
          temperature={4}
          patterns={patterns}
          aridity={aridity}
        />
      ) : null,
      summer.C.visible ? (
        <TemperatureLegendRow
          layers={layers}
          key={4}
          name={(<TemperedSummer />)}
          temperature={5}
          patterns={patterns}
          aridity={aridity}
        />
      ) : null,
    ]),
    winter.C.visible && ([
      (<WinterName key={'h-2'}>Hiver frais (0 à 10°)</WinterName>),
      summer.A.visible ? (
        <TemperatureLegendRow
          layers={layers}
          key={5}
          name={(<VeryHotSummer />)}
          temperature={6}
          patterns={patterns}
          aridity={aridity}
        />
      ) : null,
      summer.B.visible ? (
        <TemperatureLegendRow
          layers={layers}
          key={6}
          name={(<HotSummer />)}
          temperature={7}
          patterns={patterns}
          aridity={aridity}
        />
      ) : null,
      summer.C.visible ? (
        <TemperatureLegendRow
          layers={layers}
          key={7}
          name={(<TemperedSummer />)}
          temperature={8}
          patterns={patterns}
          aridity={aridity}
        />
      ) : null,
    ]),
    winter.D.visible && ([
      (<WinterName key={'h-3'}>Hiver froid (moins de 0°)</WinterName>),
      summer.A.visible ? (
        <TemperatureLegendRow
          layers={layers}
          key={8}
          name={(<VeryHotSummer />)}
          temperature={9}
          patterns={patterns}
          aridity={aridity}
        />
      ) : null,
      summer.B.visible ? (
        <TemperatureLegendRow
          layers={layers}
          key={9}
          name={(<HotSummer />)}
          temperature={10}
          patterns={patterns}
          aridity={aridity}
        />
      ) : null,
      summer.C.visible ? (
        <TemperatureLegendRow
          layers={layers}
          key={10}
          name={(<TemperedSummer />)}
          temperature={11}
          patterns={patterns}
          aridity={aridity}
        />
      ) : null,
    ]),
  ]
);

export default TemperatureLegendRows;
