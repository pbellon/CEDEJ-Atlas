const LAYERS = {
  base: {
    url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}.png',
    // maxZoom: 17,
  },
  naturalFeatures: {
    url: 'http://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}.png',
    attribution: '&copy; Powerded by <a href="http://www.esri.com/">ESRI</a> world reference overlay',
    // maxZoom: 17,
  },
};

export default LAYERS;
