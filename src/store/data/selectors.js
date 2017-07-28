export const initialState = {
  data: null,
  filtered: null,
  filters: {
    temperatures: {
      winter: [0, 30],
      summer: [10, 30],
    },
    aridity: {
      Hyper: true,
      Aride: true,
      Semi: true,
      Sub_humide: true
    },
    circles: {
      month_range: [
        1, 12
      ]
    }
  }
};

export const filteredData = (state)=>state.filtered;


