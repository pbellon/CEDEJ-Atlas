import { CanvasDelegate } from 'components';
import * as patternsUtil from 'utils/patterns';
import * as boundaries from 'utils/boundaries';
import { areaColor } from './styles';

class Delegate extends CanvasDelegate {
  constructor(data){
    super(data);
    this.shouldUseMask = false;
    this.visibility = {
      aridity: true,
      temperatures: true,
    };
  }

  updateAridityVisibility(visibility){
    this.visibility.aridity = visibility;
  }
  updateTemperaturesVisibility(visibility){
    this.visibility.temperatures = visibility;
  }
  enableMask(){
    this.shouldUseMask = true;
  }
  disableMask(){
    this.shouldUseMask = false;
  }

  createMask(modelCanvas, temperatures, aridity){
    let canvas;
    if(this.shouldUseMask){
      canvas = this.createCanvas(modelCanvas);
      const aridityCanvas = this.createCanvas(modelCanvas);
      const temperaturesCanvas = this.createCanvas(modelCanvas);
      this.drawAreas({
        context: aridityCanvas.getContext('2d'),
        features: aridity,
        fillStyle: 'black',
        strokeWidth: 2 
      });
      
      this.drawAreas({
        context: temperaturesCanvas.getContext('2d'),
        features: temperatures,
        fillStyle: 'black',
        strokeWidth: 0
      });
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(aridityCanvas,0,0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'xor';
      ctx.drawImage(temperaturesCanvas,0,0, canvas.width, canvas.height);
      ctx.clip();
    }
    return canvas;

  }

  draw({canvas, coords, size, layer}){
    const { aridity, temperatures } = this.getTileFeatures(coords);
    const {
      aridity:isAridityVisible,
      temperatures:isTemperaturesVisible 
    } = this.visibility;

    const mask = this.createMask(canvas, temperatures, aridity);
    const context = canvas.getContext("2d");
    const patterns = this.patterns = this.patterns || patternsUtil.initPatterns(context);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = 'source-over';
    try { 
      if(isTemperaturesVisible){
        this.drawAreas({
          context,
          features: temperatures,
          fillStyle: (feature)=>areaColor(feature.tags.Temperatur), 
          strokeStyle: (feature)=>areaColor(feature.tags.Temperatur), 
          strokeWidth: 1
        });
      }

      if(isAridityVisible){
        this.drawAreas({
          context,
          features: aridity,
          fillStyle: (feature)=>{
            return patterns.findByKey(feature.tags.d_TYPE).canvasPattern
          },
          stopCondition: (feature)=>{
            const pattern = patterns.findByKey(feature.tags.d_TYPE);
            if(!pattern){ return true; }
            if(!pattern.stripes){ return true; }
            return false;
          },
          strokeWidth: 0
        });
        boundaries.addBoundaries({
          context,
          patterns,
          drawPath: this.drawPath,
          boundaries: aridity,
          layer:this.layer,
        });
      }

      if(mask){
        context.globalCompositeOperation = 'destination-out';
        context.drawImage(mask, 0, 0, mask.width, mask.height);
      }
      context.clip();
    } catch(e) {
      console.error('error while drawing', e);
      throw e;
    }
    return canvas;
  }
}

export default Delegate;
