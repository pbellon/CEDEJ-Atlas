import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { palette } from 'styled-theme';
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

class LayerFilterGroup extends Component {
  static propTypes = {
    layer:PropTypes.object.isRequired,
    heading: PropTypes.string,
  };
  static childContextTypes = {
    isLayerVisible: PropTypes.bool,
  };
  getChildContext(){
    return {
      isLayerVisible: this.props.layer.visible
    };
  };
  render(){
    const {toggleVisibility, layer, heading, children} = this.props;
    const icon = layer.visible ? 'visibility' : 'visibility_off';
    const klass = layer.visible ? '' : 'hidden';
    return (
      <div>
      <Heading level={2} onClick={ toggleVisibility(layer) } className={ klass }>
        <Icon>{ icon }</Icon>
        { heading }
      </Heading>
      { children }
      </div>
    );
  };
};
const mapStateToProps = (state, props)=>{
  console.log('LayerFilterGroup.mapStateToProps', state, props);
  return {
    layer: fromLayers.layerByName(state, props.layer),
    heading: props.heading
  };
};

const mapDispatchToProps = (dispatch)=>({
  toggleVisibility: (layer)=>()=>dispatch(toggleLayerVisibility(layer))
})
export default connect(mapStateToProps, mapDispatchToProps)(LayerFilterGroup);
