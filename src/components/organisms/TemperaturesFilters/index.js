import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fromFilters } from 'store/selectors';
import { toggleTemperatureVisibility } from 'store/actions';
import { Heading, ToggleFilter } from 'components';

const TemperaturesFilters = ({
  winterTypes: wTypes,
  summerTypes: sTypes,
  toggleWinterType,
  toggleSummerType,
}, { layer }) => (
  <div>
    <Heading
      style={{ marginBottom: 0 }}
      level={6}
    >
      Type(s) d&#39;hiver
    </Heading>
     
    <ToggleFilter
      layer={layer}
      toggled={wTypes.A.visible}
      onToggle={toggleWinterType(wTypes.A)}
      label={'Hiver chaud (20 à 30°C)'}
    />

    <ToggleFilter
      layer={layer}
      toggled={wTypes.B.visible}
      onToggle={toggleWinterType(wTypes.B)}
      label={'Hiver tempéré (10 à 20°C)'}
    />
    
    <ToggleFilter
      layer={layer}
      toggled={wTypes.C.visible}
      onToggle={toggleWinterType(wTypes.C)}
      label={'Hiver frais (0 à 10°C)'}
    />

    <ToggleFilter
      layer={layer}
      toggled={wTypes.D.visible}
      onToggle={toggleWinterType(wTypes.D)}
      label={'Hiver froid (moins de 0°C)'}
    />
 
    <Heading
      style={{ marginBottom: 0 }}
      level={6}
    >
      Type(s) d&#39;été
    </Heading>
     
    <ToggleFilter
      layer={layer}
      toggled={sTypes.A.visible}
      onToggle={toggleSummerType(sTypes.A)}
      label={'Été très chaud (plus de 30°C)'}
    />

    <ToggleFilter
      layer={layer}
      toggled={sTypes.B.visible}
      onToggle={toggleSummerType(sTypes.B)}
      label={'Été chaud (20 à 30°C)'}
    />
    
    <ToggleFilter
      layer={layer}
      toggled={sTypes.C.visible}
      onToggle={toggleSummerType(sTypes.C)}
      label={'Été tempéré (10 à 20°C)'}
    />
  </div>
);

TemperaturesFilters.propTypes = {
  winterTypes: PropTypes.object,
  summerTypes: PropTypes.object,
  toggleWinterType: PropTypes.func,
  toggleSummerType: PropTypes.func,
};

TemperaturesFilters.contextTypes = {
  layer: PropTypes.object,
};

const mapStateToProps = state => ({
  winterTypes: fromFilters.winterTemperatures(state),
  summerTypes: fromFilters.summerTemperatures(state),
});

const mapDispatchToProps = (dispatch) => ({
  toggleWinterType: (type) => () => (
    dispatch(toggleTemperatureVisibility('winter', type))
  ),
  toggleSummerType: (type) => () => (
    dispatch(toggleTemperatureVisibility('summer', type))
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(TemperaturesFilters);
