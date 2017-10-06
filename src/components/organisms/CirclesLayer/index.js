import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scaleLinear } from 'd3-scale';
import { LayerGroup, Circle, Polygon } from 'react-leaflet';
import { circleColor } from 'utils/circles';
import { visibleTypes } from 'utils';
import TrianglePoints from './triangle';

const circleStyle = (circle, fill = true, show = true) => {
  let style = {
    stroke: show,
    fillOpacity: 0,
    fillColor: 'transparent',
    color: 'black',
    weight: 1.33,
  };
  if (fill) {
    const color = circleColor(circle);
    style = {
      stroke: false,
      fillOpacity: show ? 1 : 0,
      fillColor: color,
      color,
    };
  }
  return style;
};

class CirclesLayer extends Component {
  static propTypes = {
    types: PropTypes.object,
    show: PropTypes.bool,
    circles: PropTypes.array,
    onCirclesCreated: PropTypes.func,
    onCirclesAdded: PropTypes.func,
    onRender: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.sizes = {};
  }

  shouldComponentUpdate(toProps) {
    const fromVisibleTypes = visibleTypes(this.props.types);
    const toVisibleTypes = visibleTypes(toProps.types);

    if (fromVisibleTypes.length !== toVisibleTypes.length) {
      return true;
    }
    if (this.props.show !== toProps.show) {
      return true;
    }
    if (this.props.circles.length !== toProps.circles.length) { return true; }
    return false;
  }

  addToSizes(circle, $ref) {
    const { onCirclesCreated } = this.props;
    const size = circle.properties.size_;

    if (!this.sizes[size]) {
      this.sizes[size] = $ref;

      if (this.hasAllSizes()) {
        onCirclesCreated(this.sizes);
      }
    }
  }

  bindElement(ref, elem, type, radius) {
    this.addToSizes(elem, ref, radius);
    this.renderedElements += 1;
    if (this.renderedElements === this.props.circles.length) {
      this.props.onRender();

      // this extra complicated timeout nesting is here for a complicated
      // reason: we want to let know other components (especially the
      // printed circle legend) the various sizes of the draw circles in
      // order to represent them correctly. However we must wait a bit to
      // be sure the circles have been properly rendered by leaflet and
      // there is no simple way to do that except to wait & see.
      if (!this.fTimeoutID) {
        this.fTimeoutID = setTimeout(() => {
          if (!this.sTimeoutID) {
            this.sTimeoutID = setTimeout(() => {
              this.props.onCirclesAdded(this.sizes);
              this.fTimeoutID = null;
              this.sTimeoutID = null;
            }, 1000);
          }
        }, 100);
      }
    }
  }

  hasAllSizes() {
    return this.sizeKeys.every((key) => this.sizes[key] !== null);
  }

  updateSizeKeys(circles) {
    this.sizeKeys = circles.map(({ properties }) => properties.size_);
  }

  render() {
    const {
      show = true,
      circles,
      types,
    } = this.props;

    this.renderedElements = 0;
    this.updateSizeKeys(circles);
    const _types = visibleTypes(types);
    if (circles.length === 0) {
      this.props.onRender();
      return null;
    }

    return (
      <LayerGroup>
        {
          circles.map((circle, key) => {
            let elem; // the element to return
            const coords = circle.geometry.coordinates;
            const center = [coords[1], coords[0]];
            const size = circle.properties.size_;
            const scale = scaleLinear()
              .domain([10, 70])
              .range([15000, 70000]);
            const radius = scale(parseInt(size, 10) * 10);
            const style = circleStyle(circle, _types.length > 0, show);
            if (size === '01') {
              const points = TrianglePoints(center, radius);
              elem = (
                <Polygon
                  ref={(ref) => this.bindElement(ref, circle, 'triangle', radius)}
                  {...style}
                  positions={points}
                  key={`circle-${key}`}
                />
              );
            } else {
              elem = (
                <Circle
                  ref={(ref) => this.bindElement(ref, circle, 'circle')}
                  key={`circle-${key}`}
                  interactive={false}
                  radius={radius}
                  center={center}
                  {...style}
                />
              );
            }
            return elem;
          })
        }
      </LayerGroup>
    );
  }
}

export default CirclesLayer;
