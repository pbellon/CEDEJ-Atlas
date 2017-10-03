import {
  fromFilters,
  fromLegend,
  fromLayers,
  fromCircles,
} from 'store/selectors';
import { connect } from 'react-redux';
import { AtlasLegend } from 'components';

const mapStateToProps = (state) => ({
  circleSizes: fromCircles.sizes(state),
  isOpened: fromLegend.isOpened(state),
  filters: fromFilters.filters(state),
  layers: fromLayers.layers(state),
});

export default connect(mapStateToProps)(AtlasLegend);
