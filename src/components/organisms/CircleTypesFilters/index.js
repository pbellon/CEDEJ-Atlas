import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fromFilters } from 'store/selectors';
import { toggleCircleTypeVisibility } from 'store/actions';
import { ToggleFilter, Heading } from 'components';

const CircleTypesFilters = ({ onToggle, types, layer }) => (
  <div>
    <Heading
      style={{ marginBottom: 0 }}
      level={6}
    >
      Sécheresse d’été dominante
    </Heading>

    <ToggleFilter
      layer={layer}
      toggled={types.A.visible}
      onToggle={onToggle(types.A)}
      label={'Régimes à pluie d\'hiver'}
    />
    <ToggleFilter
      layer={layer}
      toggled={types.B.visible}
      onToggle={onToggle(types.B)}
      label={'Régimes à deux saisons de pluies'}
    />

    <Heading
      style={{ marginBottom: 0 }}
      level={6}
    >
      Sécheresse d’hiver dominante
    </Heading>

    <ToggleFilter
      layer={layer}
      toggled={types.C.visible}
      onToggle={onToggle(types.C)}
      label={'Régimes à pluies d\'été'}
    />
    <ToggleFilter
      layer={layer}
      toggled={types.D.visible}
      onToggle={onToggle(types.D)}
      label={'Régimes à deux saisons de pluies'}
    />

    <Heading
      style={{ marginBottom: 0 }}
      level={6}
    >
      Régimes de transition
    </Heading>

    <ToggleFilter
      layer={layer}
      toggled={types.E.visible}
      onToggle={onToggle(types.E)}
      label={'Régimes à deux saisons de pluies'}
    />
    <ToggleFilter
      layer={layer}
      toggled={types.F.visible}
      onToggle={onToggle(types.F)}
      label={'Régimes à irréguliers'}
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

export default connect(mapStateToProps, mapDispatchToProps)(CircleTypesFilters);
