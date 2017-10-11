import { CanvasDelegate } from 'components';

const FILL_STYLE = 'rgba(189, 230, 224, 1)';

class WaterLayerCanvasDelegate extends CanvasDelegate {
  draw({ canvas, coords, zoom }) {
    const { rivers, lakes } = this.getTileFeatures(coords);
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.drawAreas({
      features: rivers,
      fillStyle: 'rgba(0,0,0,0)',
      strokeStyle: FILL_STYLE,
      strokeWidth: (feature) => (
        feature.tags.strokeweig * zoom * 0.33
      ),
      context,
    });
    this.drawAreas({
      features: lakes,
      fillStyle: FILL_STYLE,
      strokeWidth: 0,
      context,
    });
  }
}

export default WaterLayerCanvasDelegate;
