import { CanvasTiles } from 'components'; 

import Delegate from './delegate';

class LakesRiversLayer extends CanvasTiles {
  static propTypes = CanvasTiles.propTypes;
  static defaultProps = {
    delegate: Delegate,
  }
}

export default LakesRiversLayer;
