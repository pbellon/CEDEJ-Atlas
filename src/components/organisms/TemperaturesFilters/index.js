import React from 'react';
import { translate } from 'react-i18next';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { font, palette } from 'styled-theme';
import { fromFilters } from 'store/selectors';
import { toggleTemperatureVisibility } from 'store/actions';
import { Heading, ToggleFilter } from 'components';
import { visibleTypes } from 'utils';

const ERRORS = {
  noSummerSelected: 'NO_SUMMER',
  noWinterSelected: 'NO_WINTER',
  noCorrelation: 'NO_CORRELATION',
};

const noWinterSelected = (err) => err === ERRORS.noWinterSelected;
const noSummerSelected = (err) => err === ERRORS.noSummerSelected;
const noCorrelation = (err) => err === ERRORS.noCorrelation;

const temperatureError = (winterTypes, summerTypes, data) => {
  const visibleWinters = visibleTypes(winterTypes);
  const visibleSummers = visibleTypes(summerTypes);
  if ((visibleWinters.length > 0) && (visibleSummers.length === 0)) {
    return ERRORS.noSummerSelected;
  }

  if ((visibleSummers.length > 0) && (visibleWinters.length === 0)) {
    return ERRORS.noWinterSelected;
  }
  if ((visibleSummers.length > 0) && (visibleWinters.length > 0) && (data && data.temperatures.features.length === 0)) {
    return ERRORS.noCorrelation;
  }
};

const ErrorMessage = styled.div`
  font-family: ${font('primary')};
  font-size: 0.8rem;
  opacity: ${({ visible }) => visible ? 1 : 0};
  line-height: ${({ visible }) => visible ? '1em' : 0};
  transition: opacity .2s ease, line-height .33s ease;
  color: ${palette('primary', 0)};
`;

const TemperaturesFilters = ({
  error,
  winterTypes: wTypes,
  summerTypes: sTypes,
  toggleWinterType,
  toggleSummerType,
}, { layer }) => (
  <div>
    <ErrorMessage visible={noCorrelation(error)}>
      {
        // i18n
      }
      <span>Les types de températures sélectionnés ne sont pas corrélés.</span>
    </ErrorMessage>
    <Heading
      style={{ marginBottom: 0 }}
      level={6}
    >
      {
        // i18n
      }
      Type(s) d&#39;hiver
    </Heading>
    <ErrorMessage visible={noWinterSelected(error)}>
      {
        // i18n
      }
      <span>Vous devez sélectionner au moins un type d&#39;hiver</span>
    </ErrorMessage>
    <ToggleFilter
      layer={layer}
      id="temperature-winter-a-filter"
      toggled={wTypes.A.visible}
      onToggle={toggleWinterType(wTypes.A)}
      label={'Hiver chaud (20 à 30°C)'} // i18n
    />
    <ToggleFilter
      layer={layer}
      id="temperature-winter-b-filter"
      toggled={wTypes.B.visible}
      onToggle={toggleWinterType(wTypes.B)}
      label={'Hiver tempéré (10 à 20°C)'} // i18n
    />
    <ToggleFilter
      layer={layer}
      id="temperature-winter-c-filter"
      toggled={wTypes.C.visible}
      onToggle={toggleWinterType(wTypes.C)}
      label={'Hiver frais (0 à 10°C)'} // i18n
    />
    <ToggleFilter
      layer={layer}
      id="temperature-winter-d-filter"
      toggled={wTypes.D.visible}
      onToggle={toggleWinterType(wTypes.D)}
      label={'Hiver froid (moins de 0°C)'} // i18n
    />
    <Heading
      style={{ marginBottom: 0 }}
      level={6}
    >
      { /* i18n */ }
      Type(s) d&#39;été
    </Heading>
    <ErrorMessage visible={noSummerSelected(error)}>
      { /* i18n */ }
      <span>Vous devez sélectionner au moins un type d&#39;été</span>
    </ErrorMessage>
    <ToggleFilter
      id="temperature-summer-a-filter"
      layer={layer}
      toggled={sTypes.A.visible}
      onToggle={toggleSummerType(sTypes.A)}
      label={'Été très chaud (plus de 30°C)'} // i18n
    />
    <ToggleFilter
      layer={layer}
      id="temperature-summer-b-filter"
      toggled={sTypes.B.visible}
      onToggle={toggleSummerType(sTypes.B)}
      label={'Été chaud (20 à 30°C)'} // i18n
    />
    <ToggleFilter
      layer={layer}
      id="temperature-summer-c-filter"
      toggled={sTypes.C.visible}
      onToggle={toggleSummerType(sTypes.C)}
      label={'Été tempéré (10 à 20°C)'} // i18n
    />
  </div>
);

TemperaturesFilters.propTypes = {
  error: PropTypes.string,
  winterTypes: PropTypes.object,
  summerTypes: PropTypes.object,
  toggleWinterType: PropTypes.func,
  toggleSummerType: PropTypes.func,
};

TemperaturesFilters.contextTypes = {
  layer: PropTypes.object,
};

const mapStateToProps = state => ({
  error: temperatureError(
    fromFilters.winterTemperatures(state),
    fromFilters.summerTemperatures(state),
    fromFilters.data(state),
  ),
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

export default connect(mapStateToProps, mapDispatchToProps)(
  translate('atlas')(TemperaturesFilters)
);
