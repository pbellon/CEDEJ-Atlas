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
import { toggleLayerVisibility } from 'store/actions';
import { Heading as GenericHeading } from 'components';
import { fromLayers } from 'store/selectors';


const Heading = styled(GenericHeading)`
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
  padding-left: 15px;
  padding-right: 15px;
  margin-bottom: 15px;
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
    const Icon = layer.visible ? MdVisibility : MdVisibilityOff;
    const klass = layer.visible ? '' : 'hidden';
    return (
      <LayerContainer>
        <Heading level={4}
          onClick={ toggleVisibility(layer) } className={ klass }>
          <span><Icon/> { heading }</span>
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
