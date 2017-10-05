import PropTypes from 'prop-types';
import { CanvasTiles } from 'components';

import Delegate from './delegate';

class AridityTemperaturesLayer extends CanvasTiles {
  static propTypes = {
    ...CanvasTiles.propTypes,
    showAridity: PropTypes.bool,
    showTemperatures: PropTypes.bool,
    counts: PropTypes.shape({
      temperatures: PropTypes.object,
      aridity: PropTypes.object,
    }),
  }

  static defaultProps = {
    ...CanvasTiles.defaultProps,
    delegate: Delegate,
  }

  updateAridityVisiblity(visibility) {
    if (!visibility) {
      this.delegate.disableMask();
    } else {
      this.delegate.enableMask();
    }
    this.delegate.updateAridityVisibility(visibility);
    this.redraw();
  }

  updateTemperaturesVisiblity(visibility) {
    if (!visibility) {
      this.delegate.disableMask();
    } else {
      this.delegate.enableMask();
    }
    this.delegate.updateTemperaturesVisibility(visibility);
    this.redraw();
  }

  updateLeafletElement(
    {
      showAridity: fromAridityVisibility,
      showTemperatures: fromTemperaturesVisibility,
      data: {
        temperatures: fromTemps,
        aridity: fromAridity,
      },
    },
    {
      showAridity: toAridityVisibility,
      showTemperatures: toTemperaturesVisibility,
      data: {
        temperatures: toTemps,
        aridity: toAridity,
      },
      counts: {
        temperatures: tempsCounts,
        aridity: aridityCounts,
      },
    }
  ) {
    const shouldEnableMask = (
      (
        (
          tempsCounts.original !== tempsCounts.current
        ) && (
          tempsCounts.current > 0
        )
      ) || (
        (
          aridityCounts.original !== aridityCounts.current
        ) && (
          aridityCounts.current > 0
        )
      )
    ) && (
      (
        toAridityVisibility && toTemperaturesVisibility
      ) && (
        toTemps.features.length > 0
      ) && (
        toAridity.features.length > 0
      )
    );

    const diffAridity = fromAridity.features.length !== toAridity.features.length;
    const diffTemps = fromTemps.features.length !== toTemps.features.length;
    if (diffTemps || diffAridity) {
      if (shouldEnableMask) {
        this.delegate.enableMask();
      } else {
        this.delegate.disableMask();
      }
      this.updateData({
        aridity: toAridity,
        temperatures: toTemps,
      });
    } else {
      this.onRendered();
    }

    if (fromAridityVisibility !== toAridityVisibility) {
      this.updateAridityVisiblity(toAridityVisibility);
    }

    if (fromTemperaturesVisibility !== toTemperaturesVisibility) {
      this.updateTemperaturesVisiblity(toTemperaturesVisibility);
    }
  }
}

export default AridityTemperaturesLayer;
