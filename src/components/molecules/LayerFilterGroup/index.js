// external deps
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { palette } from 'styled-theme';
import styled from 'styled-components';
import { connect } from 'react-redux';

// assets
import MdVisibility from 'react-icons/lib/md/visibility';
import MdVisibilityOff from 'react-icons/lib/md/visibility-off';


// inner depencies
import AtlasPropTypes from 'atlas-prop-types';
import { toggleLayerVisibility } from 'store/actions';
import { Heading as GenericHeading } from 'components';
import { fromLayers } from 'store/selectors';


const Heading = styled(GenericHeading)`
  cursor: pointer;
  margin-bottom:0;
  &:hover {
    color: ${palette('grayscale', 0)};
  }
`;

const LayerContainer = styled.div`
  margin-bottom: 0.5em;
   
  color: ${palette('grayscale', 1)};
  &.hidden {
    color: ${palette('grayscale', 3)};
  }

`;

class LayerFilterGroup extends Component {
  static propTypes = {
    headingStyle: PropTypes.object,
    toggleVisibility: PropTypes.func.isRequired,
    hidden: PropTypes.bool,
    layer: AtlasPropTypes.layer,
    heading: AtlasPropTypes.heading,
    children: AtlasPropTypes.children,
  };

  static childContextTypes = AtlasPropTypes.layerContextTypes;

  getChildContext() {
    return {
      layer: this.props.layer,
    };
  }

  render() {
    const { toggleVisibility, layer, heading, headingStyle, children } = this.props;
    const Icon = layer.visible ? MdVisibility : MdVisibilityOff;
    const klass = layer.visible ? '' : 'hidden';
    return (
      <LayerContainer className={klass}>
        <Heading
          level={4}
          style={{
            marginTop: 0,
            ...headingStyle,
          }}
          onClick={toggleVisibility(layer)}
        >
          <span><Icon /> { heading }</span>
        </Heading>
        { children }
      </LayerContainer>
    );
  }
}

const mapStateToProps = (state, props) => {
  const layer = fromLayers.layerByName(state, props.layer);
  return {
    hidden: !layer.visible,
    heading: props.heading,
    layer,
  };
};

const mapDispatchToProps = (dispatch) => ({
  toggleVisibility: (layer) => () => dispatch(toggleLayerVisibility(layer)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerFilterGroup);
