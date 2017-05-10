import React, { Component, PropTypes } from 'react'
import styled from 'styled-components'
import { font, palette } from 'styled-theme'
import {world} from 'data';

import * as d3 from 'd3';

class Atlas extends Component {
  static propTypes = {
    print: PropTypes.bool,
    onRender: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number
  };

  static defaultPropTypes = {
    print: false
  }

  componentDidMount(){
    console.log('components.Atlas.componentDidMount');
    const { width, height } = this.props;
    const proj = d3.geoMercator().scale(110).center([ 55.0, 20.00]);
    const node =  d3.select(this.refs.canvas).node();
    const ctx = node.getContext('2d');
    const path = d3.geoPath(proj).context(ctx);
    ctx.strokeStyle = '#bbb';
    ctx.beginPath();
    path(world);
    ctx.stroke();
    if(this.props.onRender){
      this.props.onRender(node.toDataURL());
    }
  }
  render(){
    console.log('components.Atlas.render');
    const { width, height, print } = this.props;
    return (
      <canvas
        width={ width }
        height={ height }
        ref='canvas'/>
    );
  }
}
export default Atlas
