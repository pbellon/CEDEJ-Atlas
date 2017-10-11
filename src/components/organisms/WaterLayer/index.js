import { CanvasTiles } from 'components';

import Delegate from './delegate';

class WaterLayer extends CanvasTiles {
  static propTypes = CanvasTiles.propTypes;
  static defaultProps = {
    delegate: Delegate,
  }
}

export default WaterLayer;
