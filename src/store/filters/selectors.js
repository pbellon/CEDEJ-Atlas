export const initialState = {
  isUpdatingUnionMask: true,
  originalCounts: {
    temperatures: 7,
    aridity: 4,
  },
  counts: {
    temperatures:{
      original: 7,
      previous: 7,
      current: 7,
    },
    aridity: {
      original: 4,
      previous: 4,
      current: 4,
    },
  },
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
    sizes: {
      '01': { name: '01', visible: true }, 
      '02': { name: '02', visible: true }, 
      '03': { name: '03', visible: true }, 
      '04': { name: '04', visible: true }, 
      '05': { name: '05', visible: true }, 
      '06': { name: '06', visible: true }, 
      '07': { name: '07', visible: true }, 
    },
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
export const circlesSizes = state => state.circles.sizes;

export const dryMonths = state => state.circles.month_range;

export const filters = state => state;
export const isUpdatingUnionMask = state => state.isUpdatingUnionMask
export const data = state => state.filtered;
export const counts = state => state.counts;
