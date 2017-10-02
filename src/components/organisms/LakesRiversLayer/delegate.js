import { CanvasDelegate } from 'components';

class LakesRiversDelegate extends CanvasDelegate {
  draw({canvas, coords, size, layer}){
    const { rivers, lakes } = this.getTileFeatures(coords);
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
}

export default LakesRiversDelegate;

