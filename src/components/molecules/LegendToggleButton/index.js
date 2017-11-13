import React from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { toggleLegend } from 'store/actions';
import { fromLegend } from 'store/selectors';

import { ToggleButton } from 'components';

const LegendToggleButton = (props) => (
  <ToggleButton align={'right'} {...props}>{ props.t('legend.toggle') }</ToggleButton>
);

const mapStateToProps = (state = fromLegend.initialState) => ({
  toggled: fromLegend.isOpened(state),
});

const mapDispatchToProps = (dispatch) => ({
  toggle: () => dispatch(toggleLegend()),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  translate()(LegendToggleButton)
);
