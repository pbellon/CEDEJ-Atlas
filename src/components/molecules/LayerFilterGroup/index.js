import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { palette } from 'styled-theme';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { toggleLayerVisibility } from 'store/actions';
import { Icon } from 'react-materialize';
import { Heading as GenericHeading } from 'components';
import { fromLayers } from 'store/selectors';

const Heading = GenericHeading.extend`
  color: ${palette('grayscale', 1)};
  cursor: pointer;
  &:hover {
    color: ${palette('grayscale', 2)};
  },
  &.hidden {
    color: ${palette('grayscale', 4)};
  }
`;

const LayerContainer = styled.div`
  padding: 15px;
`;

class LayerFilterGroup extends Component {
  static propTypes = {
    hidden: PropTypes.bool,
    layer:PropTypes.object.isRequired,
    heading: PropTypes.string,
  };
  static childContextTypes = {
    layer: PropTypes.object
  };

  getChildContext(){
    return {
      layer: this.props.layer
    };
  };
  render(){
    const {toggleVisibility, layer, heading, children} = this.props;
    const icon = layer.visible ? 'visibility' : 'visibility_off';
    const klass = layer.visible ? '' : 'hidden';
    return (
      <LayerContainer>
        <Heading level={2} onClick={ toggleVisibility(layer) } className={ klass }>
          <Icon>{ icon }</Icon>
          { heading }
        </Heading>
        { children }
      </LayerContainer>
    );
  };
};
const mapStateToProps = (state, props)=>{
  const layer = fromLayers.layerByName(state, props.layer);
  return {
    hidden: !layer.visible,
    heading: props.heading,
    layer,
  };
};

const mapDispatchToProps = (dispatch)=>({
  toggleVisibility: (layer)=>()=>dispatch(toggleLayerVisibility(layer))
})
export default connect(mapStateToProps, mapDispatchToProps)(LayerFilterGroup);
