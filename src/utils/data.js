import { multiPolygon, polygon, point } from '@turf/helpers';

import circle from '@turf/circle';
import inside from '@turf/inside';

export const filterFeatures = (data, latLng) => {
  const pt = point([latLng.lng, latLng.lat]);
  const result = {};
  Object.keys(data).forEach(i => {
    let set = data[i];
    if (typeof set === typeof {}) {
      set = set.features;
    }
    const matching = set.find(f => {
      return f._turfObj && inside(pt, f._turfObj);
    });

    if (matching) {
      result[i] = matching;
    }
  });
  return result;
};

const GeoJSON = {
  Polygon: 'Polygon',
  MultiPolygon: 'MultiPolygon',
  Point: 'Point',
};

const featureToCircle = (feature) => {
  const size = parseInt(feature.properties.size_, 10);
  const coords = feature.geometry.coordinates;
  const radius = size * 20;
  const center = point(coords);
  const steps = 15;
  return circle(center, radius, steps);
};

export const turfizeGeoJSON = (data) => {
  data.forEach(
    (feature) => {
      const coords = feature.geometry.coordinates;
      switch (feature.geometry.type) {
        case GeoJSON.Polygon:
          feature._turfObj = polygon(coords);
          break;
        case GeoJSON.MultiPolygon:
          feature._turfObj = multiPolygon(coords);
          break;
        case GeoJSON.Point:
          feature._turfObj = featureToCircle(feature);
          break;
        default:
          break;
      }
    }
  );
  return data;
};
