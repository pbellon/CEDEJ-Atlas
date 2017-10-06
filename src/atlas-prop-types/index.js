import PropTypes from 'prop-types';

const filter = PropTypes.shape({
  name: PropTypes.string,
  visible: PropTypes.bool,
});

const filters = PropTypes.objectOf(filter);

const layer = filter;

const layerContextTypes = {
  layer,
}

const label = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.node,
]);

const heading = label;


const numbers = PropTypes.arrayOf(PropTypes.number);

const feature = PropTypes.shape({
  geometry: PropTypes.shape({
    type: PropTypes.string,
    coordinates: PropTypes.oneOfType([
      numbers,
      PropTypes.arrayOf(numbers),
      PropTypes.arrayOf(PropTypes.arrayOf(numbers)),
      PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(numbers))),
    ]),
  }),
  properties: PropTypes.object,
  type: PropTypes.string,
});

const geojson = PropTypes.shape({
  features: PropTypes.arrayOf(feature),
  type: PropTypes.string,
});

const geojsonObject = PropTypes.objectOf(geojson);

const children = PropTypes.oneOfType([
  PropTypes.node,
  PropTypes.arrayOf(PropTypes.node),
]);

const count = PropTypes.shape({
  current: PropTypes.number,
  previous: PropTypes.number,
});

const countObject = PropTypes.objectOf(count);

export default {
  filters,
  filter,
  layer,
  layerContextTypes,
  label,
  heading,
  children,
  count,
  countObject,
  feature,
  geojson,
  geojsonObject,
};
