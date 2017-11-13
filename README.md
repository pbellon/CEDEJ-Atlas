## Setup
 
### 1. Get the source code

```sh
$ git clone https://github.com/Skoli-Code/CEDEJ-Atlas
$ cd CEDEJ-Atlas
```

### 2. Install dependencies

```sh
$ npm install
# OR
$ yarn install
```

### 3. Run the app
   
```sh
$ npm run dev
# OR 
$ yarn dev
```

It will start the development server with [HMR](https://webpack.github.io/docs/hot-module-replacement) on top of it.

> [http://localhost:3000](http://localhost:3000) — Development server<br>

Now you can open [http://localhost:3000](http://localhost:3000) in your browser and see the application running.

### 4. Deploy the app

By default this app is configured to be deployed on GitHub pages. If you want to change this behavior, update package.json
`deploy` scripts to have the appropriated behavior.

```sh
$ npm run deploy
# OR
$ yarn deploy
```


## Main Components

This app tries to follow the [Atomic](http://atomicdesign.bradfrost.com/table-of-contents/) design principles.

You'll find those main components to be the key elements of the application:

- Atlas
  - CirclesLayer
  - DesertLabelsLayer
  - WaterLabelsLayer
  - WaterLayer
- AtlasLegend
  - TemperaturesLegend
  - AridityLegendNames
- AtlasFilters
  - AridityFilters
  - TemperaturesFilters
  - CircleSizesFilters
  - CircleTypesFilters

## Translation
Currently this app is developed only in french. To translate it in english (the only additional supported language) you'll need to translate multiple elements:
- all locale files located under `/locales/fr`. 
- all content files located under `/content/fr`. 

All translatable files are already in place but they need to be translated.

## Credits

We would like to thank these awesome projects that helped to make this application a reality.

### Web development libraries

- [React](https://github.com/facebook/react), [Redux](https://github.com/reactjs/redux) & [Redux Saga](https://github.com/redux-saga/redux-saga)
- The [Arc](https://github.com/diegohaz/arc) starter kit
- [styled-components](https://github.com/styled-components/styled-components), [styled-theme](https://github.com/diegohaz/styled-theme), [styled-tools](https://github.com/diegohaz/styled-tools)
- [Webpack](https://github.com/webpack/webpack)
- [Babel](https://github.com/babel/babel)

### Cartography & Drawing

- [Leaflet](http://leafletjs.com/) & [React Leaflet](https://github.com/PaulLeCam/react-leaflet)
- [leaflet-image](https://github.com/mapbox/leaflet-image)
- [TurfJS](turfjs.org)
- [D3.js](https://d3js.org/) for the d3-path & d3-scale modules
- [geojson-vt](https://github.com/mapbox/geojson-vt)
-
### Utilitaries

- [jsPDF](https://github.com/MrRio/jsPDF)
- [jszip](https://github.com/Stuk/jszip)
- [FileSaver.js](https://github.com/eligrey/FileSaver.js)
- [html2canvas](https://github.com/niklasvh/html2canvas)

### Mapping Data & resources

- [ESRI ArcGis](http://www.arcgis.com/) for the basemap
- [Natural Earth Data](http://www.naturalearthdata.com/) for deserts labels and water polygons & labels.

