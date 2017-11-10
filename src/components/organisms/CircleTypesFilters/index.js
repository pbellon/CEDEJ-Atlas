import React from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fromFilters } from 'store/selectors';
import { toggleCircleTypeVisibility } from 'store/actions';
import { ToggleFilter, Heading } from 'components';

const CircleTypesFilters = ({ t, onToggle, types, layer }) => (
  <div>
    <Heading
      style={{ marginBottom: 0 }}
      level={6}
    >
      { t('drought.summer') }
    </Heading>

    <ToggleFilter
      id="circle-type-a-filter"
      layer={layer}
      toggled={types.A.visible}
      onToggle={onToggle(types.A)}
      label={t('drought.A.regime')}
    />
    <ToggleFilter
      id="circle-type-b-filter"
      layer={layer}
      toggled={types.B.visible}
      onToggle={onToggle(types.B)}
      label={t('drought.B.regime')} 
    />

    <Heading
      style={{ marginBottom: 0 }}
      level={6}
    >
      { t('drought.winter') }
    </Heading>

    <ToggleFilter
      layer={layer}
      id="circle-type-c-filter"
      toggled={types.C.visible}
      onToggle={onToggle(types.C)}
      label={t('drought.C.regime')}
    />
    <ToggleFilter
      layer={layer}
      id="circle-type-d-filter"
      toggled={types.D.visible}
      onToggle={onToggle(types.D)}
      label={t('drought.D.regime')} // i18n
    />

    <Heading
      style={{ marginBottom: 0 }} // i18n
      level={6}
    >
      { t('drought.transition') }
    </Heading>

    <ToggleFilter
      layer={layer}
      id="circle-type-e-filter"
      toggled={types.E.visible}
      onToggle={onToggle(types.E)}
      label={t('drought.E.regime')} // i18n
    />
    <ToggleFilter
      layer={layer}
      toggled={types.F.visible}
      id="circle-type-f-filter"
      onToggle={onToggle(types.F)}
      label={t('drought.F.regime')} // i18n
    />
  </div>
);

CircleTypesFilters.propTypes = {
  onToggle: PropTypes.func,
  types: PropTypes.object,
  layer: PropTypes.object,
};

const mapDispatchToProps = dispatch => ({
  onToggle: type => () => dispatch(toggleCircleTypeVisibility(type)),
});

const mapStateToProps = (state, ownProps) => ({
  types: fromFilters.circlesTypes(state),
  layer: ownProps.layer,
});

export default connect(mapStateToProps, mapDispatchToProps)(
  translate('atlas')(CircleTypesFilters)
);
