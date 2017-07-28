export const initialState = {
  temperatures: {
    winter: [0, 30],
    summer: [10, 30],
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
      visible: true
    }
  },
  circles: {
    month_range: [1, 12]
  },
  original: null,
  filtered: null
};


export const temperatures = {
  winter: (state)=>(state.temperatures.winter),
  summer: (state)=>(state.temperatures.summer),
};

export const aridity = (state, name)=>{
  switch (name){
    case 'hyper': return state.aridity.Hyper;
    case 'arid': return state.aridity.Aride;
    case 'semi': return state.aridity.Semi;
    case 'subHumide': return state.aridity.Sub_humide;
  }
}

export const data = (state)=>state.filtered

