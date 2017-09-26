import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CanvasTriangle extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    radius: PropTypes.number.isRequired,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    style: PropTypes.object,
  }
  static defaultProps = {
    stroke: '#BBB',
    strokeWidth: 1,
  }

  draw(canvas){
    const { strokeWidth, stroke, radius } = this.props;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.beginPath();
    ctx.moveTo(strokeWidth,strokeWidth);
    ctx.lineTo(radius*2, strokeWidth);
    ctx.lineTo(radius, radius*2);
    ctx.lineTo(strokeWidth, strokeWidth);
    ctx.stroke();
  }

  render(){
    const { width, height, ...props } = this.props;
    return (<canvas
      { ...props }
      width={width}
      height={height}
      ref={(ref)=>this.draw(ref)}/>
    );
  }
}

export default CanvasTriangle;
