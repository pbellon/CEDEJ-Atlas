import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CanvasCircle extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    radius: PropTypes.number.isRequired,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
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
    ctx.arc(radius+strokeWidth,radius+strokeWidth, radius, 0, Math.PI * 2, false);
    ctx.stroke();
  }

  render(){
    const { width, height } = this.props;
    return (<canvas
      width={width}
      height={height}
      ref={(ref)=>this.draw(ref)}/>
    );
  }
}

export default CanvasCircle;
