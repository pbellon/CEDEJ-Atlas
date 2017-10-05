## Setup
 
### 1. Get the source code

Just clone one of the ARc [branches](#branches):
```sh
$ git clone -b redux https://github.com/Skoli-Code/CEDEJ-Atlas
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


## Main Components

This app tries to follow the [Atomic](http://atomicdesign.bradfrost.com/table-of-contents/) design principles.

You'll find those main components to be the key elements of the application:

- Atlas
  - CirclesLayer
  - DesertLabelsLayer
  - WaterLabelsLayer
  - WaterLayer

- Sidebar
- Navbar
- AtlasLegend
  - TemperaturesLegend
  - AridityLegendNames
- AtlasFilters
  - AridityFilters
  - TemperaturesFilters
  - CircleSizesFilters
  - CircleTypesFilters
- 
