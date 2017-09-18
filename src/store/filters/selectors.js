export const initialState = {
  temperatures: {
    winter: {
      A: {
        name: 'A',
        visible: true,
      },
      B: {
        name: 'B',
        visible: true,
      },
      C: {
        name: 'C',
        visible: true,
      },
      D: { 
        name: 'D',
        visible: true,
      },
    },
    summer: {
      A: {
        name: 'A',
        visible: true,
      },
      B: {
        name: 'B',
        visible: true,
      },
      C: {
        name: 'C',
        visible: true,
      },
    },
  },
  aridity: {
    Hyper: {
      name: 'Hyper',
      visible: true,
    },
    Aride: {
      name: 'Aride',
      visible: true,
    },
    Semi: {
      name: 'Semi',
      visible: true,
    },
    Sub_humide: {
      name: 'Sub_humide',
      visible: true,
    },
  },
  circles: {
    month_range: [1, 12],
    types: {
      A: {
        visible: true,
        name: 'A',
      },
      B: {
        visible: true,
        name: 'B',
      },
      C: {
        visible: true,
        name: 'C',
      },
      D: {
        visible: true,
        name: 'D',
      },
      E: {
        visible: true,
        name: 'E',
      },
      F: {
        visible: true,
        name: 'F',
      },
    },
  },
  original: null,
  filtered: null,
};


export const winterTemperatures = state => state.temperatures.winter;
export const summerTemperatures = state => state.temperatures.summer;

export const aridity = (state, name) => {
  switch (name) {
    case 'hyper': return state.aridity.Hyper;
    case 'arid': return state.aridity.Aride;
    case 'semi': return state.aridity.Semi;
    case 'subHumide': return state.aridity.Sub_humide;
    default: return null;
  }
};

export const circlesTypes = state => state.circles.types;

export const dryMonths = state => state.circles.month_range;

export const filters = state => state;

export const data = state => state.filtered;
