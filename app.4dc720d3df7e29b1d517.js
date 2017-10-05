webpackJsonp([0],{

/***/ "./node_modules/@turf/bbox-polygon/index.js":
/***/ (function(module, exports, __webpack_require__) {

var polygon = __webpack_require__("./node_modules/@turf/bbox-polygon/node_modules/@turf/helpers/index.js").polygon;

/**
 * Takes a bbox and returns an equivalent {@link Polygon|polygon}.
 *
 * @name bboxPolygon
 * @param {Array<number>} bbox extent in [minX, minY, maxX, maxY] order
 * @returns {Feature<Polygon>} a Polygon representation of the bounding box
 * @example
 * var bbox = [0, 0, 10, 10];
 *
 * var poly = turf.bboxPolygon(bbox);
 *
 * //addToMap
 * var addToMap = [poly]
 */
module.exports = function (bbox) {
    var lowLeft = [bbox[0], bbox[1]];
    var topLeft = [bbox[0], bbox[3]];
    var topRight = [bbox[2], bbox[3]];
    var lowRight = [bbox[2], bbox[1]];

    return polygon([[
        lowLeft,
        lowRight,
        topRight,
        topLeft,
        lowLeft
    ]]);
};


/***/ }),

/***/ "./node_modules/@turf/bbox-polygon/node_modules/@turf/helpers/index.js":
/***/ (function(module, exports) {

/**
 * Wraps a GeoJSON {@link Geometry} in a GeoJSON {@link Feature}.
 *
 * @name feature
 * @param {Geometry} geometry input geometry
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature} a GeoJSON Feature
 * @example
 * var geometry = {
 *   "type": "Point",
 *   "coordinates": [110, 50]
 * };
 *
 * var feature = turf.feature(geometry);
 *
 * //=feature
 */
function feature(geometry, properties, bbox, id) {
    if (geometry === undefined) throw new Error('geometry is required');
    if (properties && properties.constructor !== Object) throw new Error('properties must be an Object');
    if (bbox && bbox.length !== 4) throw new Error('bbox must be an Array of 4 numbers');
    if (id && ['string', 'number'].indexOf(typeof id) === -1) throw new Error('id must be a number or a string');

    var feat = {type: 'Feature'};
    if (id) feat.id = id;
    if (bbox) feat.bbox = bbox;
    feat.properties = properties || {};
    feat.geometry = geometry;
    return feat;
}

/**
 * Creates a GeoJSON {@link Geometry} from a Geometry string type & coordinates.
 * For GeometryCollection type use `helpers.geometryCollection`
 *
 * @name geometry
 * @param {string} type Geometry Type
 * @param {Array<number>} coordinates Coordinates
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @returns {Geometry} a GeoJSON Geometry
 * @example
 * var type = 'Point';
 * var coordinates = [110, 50];
 *
 * var geometry = turf.geometry(type, coordinates);
 *
 * //=geometry
 */
function geometry(type, coordinates, bbox) {
    // Validation
    if (!type) throw new Error('type is required');
    if (!coordinates) throw new Error('coordinates is required');
    if (!Array.isArray(coordinates)) throw new Error('coordinates must be an Array');
    if (bbox && bbox.length !== 4) throw new Error('bbox must be an Array of 4 numbers');

    var geom;
    switch (type) {
    case 'Point': geom = point(coordinates).geometry; break;
    case 'LineString': geom = lineString(coordinates).geometry; break;
    case 'Polygon': geom = polygon(coordinates).geometry; break;
    case 'MultiPoint': geom = multiPoint(coordinates).geometry; break;
    case 'MultiLineString': geom = multiLineString(coordinates).geometry; break;
    case 'MultiPolygon': geom = multiPolygon(coordinates).geometry; break;
    default: throw new Error(type + ' is invalid');
    }
    if (bbox) geom.bbox = bbox;
    return geom;
}

/**
 * Takes coordinates and properties (optional) and returns a new {@link Point} feature.
 *
 * @name point
 * @param {Array<number>} coordinates longitude, latitude position (each in decimal degrees)
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<Point>} a Point feature
 * @example
 * var point = turf.point([-75.343, 39.984]);
 *
 * //=point
 */
function point(coordinates, properties, bbox, id) {
    if (!coordinates) throw new Error('No coordinates passed');
    if (coordinates.length === undefined) throw new Error('Coordinates must be an array');
    if (coordinates.length < 2) throw new Error('Coordinates must be at least 2 numbers long');
    if (!isNumber(coordinates[0]) || !isNumber(coordinates[1])) throw new Error('Coordinates must contain numbers');

    return feature({
        type: 'Point',
        coordinates: coordinates
    }, properties, bbox, id);
}

/**
 * Takes an array of LinearRings and optionally an {@link Object} with properties and returns a {@link Polygon} feature.
 *
 * @name polygon
 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<Polygon>} a Polygon feature
 * @throws {Error} throw an error if a LinearRing of the polygon has too few positions
 * or if a LinearRing of the Polygon does not have matching Positions at the beginning & end.
 * @example
 * var polygon = turf.polygon([[
 *   [-2.275543, 53.464547],
 *   [-2.275543, 53.489271],
 *   [-2.215118, 53.489271],
 *   [-2.215118, 53.464547],
 *   [-2.275543, 53.464547]
 * ]], { name: 'poly1', population: 400});
 *
 * //=polygon
 */
function polygon(coordinates, properties, bbox, id) {
    if (!coordinates) throw new Error('No coordinates passed');

    for (var i = 0; i < coordinates.length; i++) {
        var ring = coordinates[i];
        if (ring.length < 4) {
            throw new Error('Each LinearRing of a Polygon must have 4 or more Positions.');
        }
        for (var j = 0; j < ring[ring.length - 1].length; j++) {
            // Check if first point of Polygon contains two numbers
            if (i === 0 && j === 0 && !isNumber(ring[0][0]) || !isNumber(ring[0][1])) throw new Error('Coordinates must contain numbers');
            if (ring[ring.length - 1][j] !== ring[0][j]) {
                throw new Error('First and last Position are not equivalent.');
            }
        }
    }

    return feature({
        type: 'Polygon',
        coordinates: coordinates
    }, properties, bbox, id);
}

/**
 * Creates a {@link LineString} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name lineString
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<LineString>} a LineString feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var linestring1 = turf.lineString([
 *   [-21.964416, 64.148203],
 *   [-21.956176, 64.141316],
 *   [-21.93901, 64.135924],
 *   [-21.927337, 64.136673]
 * ]);
 * var linestring2 = turf.lineString([
 *   [-21.929054, 64.127985],
 *   [-21.912918, 64.134726],
 *   [-21.916007, 64.141016],
 *   [-21.930084, 64.14446]
 * ], {name: 'line 1', distance: 145});
 *
 * //=linestring1
 *
 * //=linestring2
 */
function lineString(coordinates, properties, bbox, id) {
    if (!coordinates) throw new Error('No coordinates passed');
    if (coordinates.length < 2) throw new Error('Coordinates must be an array of two or more positions');
    // Check if first point of LineString contains two numbers
    if (!isNumber(coordinates[0][1]) || !isNumber(coordinates[0][1])) throw new Error('Coordinates must contain numbers');

    return feature({
        type: 'LineString',
        coordinates: coordinates
    }, properties, bbox, id);
}

/**
 * Takes one or more {@link Feature|Features} and creates a {@link FeatureCollection}.
 *
 * @name featureCollection
 * @param {Feature[]} features input features
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {FeatureCollection} a FeatureCollection of input features
 * @example
 * var features = [
 *  turf.point([-75.343, 39.984], {name: 'Location A'}),
 *  turf.point([-75.833, 39.284], {name: 'Location B'}),
 *  turf.point([-75.534, 39.123], {name: 'Location C'})
 * ];
 *
 * var collection = turf.featureCollection(features);
 *
 * //=collection
 */
function featureCollection(features, bbox, id) {
    if (!features) throw new Error('No features passed');
    if (!Array.isArray(features)) throw new Error('features must be an Array');
    if (bbox && bbox.length !== 4) throw new Error('bbox must be an Array of 4 numbers');
    if (id && ['string', 'number'].indexOf(typeof id) === -1) throw new Error('id must be a number or a string');

    var fc = {type: 'FeatureCollection'};
    if (id) fc.id = id;
    if (bbox) fc.bbox = bbox;
    fc.features = features;
    return fc;
}

/**
 * Creates a {@link Feature<MultiLineString>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiLineString
 * @param {Array<Array<Array<number>>>} coordinates an array of LineStrings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<MultiLineString>} a MultiLineString feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiLine = turf.multiLineString([[[0,0],[10,10]]]);
 *
 * //=multiLine
 */
function multiLineString(coordinates, properties, bbox, id) {
    if (!coordinates) throw new Error('No coordinates passed');

    return feature({
        type: 'MultiLineString',
        coordinates: coordinates
    }, properties, bbox, id);
}

/**
 * Creates a {@link Feature<MultiPoint>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPoint
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<MultiPoint>} a MultiPoint feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPt = turf.multiPoint([[0,0],[10,10]]);
 *
 * //=multiPt
 */
function multiPoint(coordinates, properties, bbox, id) {
    if (!coordinates) throw new Error('No coordinates passed');

    return feature({
        type: 'MultiPoint',
        coordinates: coordinates
    }, properties, bbox, id);
}

/**
 * Creates a {@link Feature<MultiPolygon>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPolygon
 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygons
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<MultiPolygon>} a multipolygon feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPoly = turf.multiPolygon([[[[0,0],[0,10],[10,10],[10,0],[0,0]]]]);
 *
 * //=multiPoly
 *
 */
function multiPolygon(coordinates, properties, bbox, id) {
    if (!coordinates) throw new Error('No coordinates passed');

    return feature({
        type: 'MultiPolygon',
        coordinates: coordinates
    }, properties, bbox, id);
}

/**
 * Creates a {@link Feature<GeometryCollection>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name geometryCollection
 * @param {Array<Geometry>} geometries an array of GeoJSON Geometries
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<GeometryCollection>} a GeoJSON GeometryCollection Feature
 * @example
 * var pt = {
 *     "type": "Point",
 *       "coordinates": [100, 0]
 *     };
 * var line = {
 *     "type": "LineString",
 *     "coordinates": [ [101, 0], [102, 1] ]
 *   };
 * var collection = turf.geometryCollection([pt, line]);
 *
 * //=collection
 */
function geometryCollection(geometries, properties, bbox, id) {
    if (!geometries) throw new Error('geometries is required');
    if (!Array.isArray(geometries)) throw new Error('geometries must be an Array');

    return feature({
        type: 'GeometryCollection',
        geometries: geometries
    }, properties, bbox, id);
}

// https://en.wikipedia.org/wiki/Great-circle_distance#Radius_for_spherical_Earth
var factors = {
    miles: 3960,
    nauticalmiles: 3441.145,
    degrees: 57.2957795,
    radians: 1,
    inches: 250905600,
    yards: 6969600,
    meters: 6373000,
    metres: 6373000,
    centimeters: 6.373e+8,
    centimetres: 6.373e+8,
    kilometers: 6373,
    kilometres: 6373,
    feet: 20908792.65
};

var areaFactors = {
    kilometers: 0.000001,
    kilometres: 0.000001,
    meters: 1,
    metres: 1,
    centimetres: 10000,
    millimeter: 1000000,
    acres: 0.000247105,
    miles: 3.86e-7,
    yards: 1.195990046,
    feet: 10.763910417,
    inches: 1550.003100006
};
/**
 * Round number to precision
 *
 * @param {number} num Number
 * @param {number} [precision=0] Precision
 * @returns {number} rounded number
 * @example
 * turf.round(120.4321)
 * //=120
 *
 * turf.round(120.4321, 2)
 * //=120.43
 */
function round(num, precision) {
    if (num === undefined || num === null || isNaN(num)) throw new Error('num is required');
    if (precision && !(precision >= 0)) throw new Error('precision must be a positive number');
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(num * multiplier) / multiplier;
}

/**
 * Convert a distance measurement (assuming a spherical Earth) from radians to a more friendly unit.
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @name radiansToDistance
 * @param {number} radians in radians across the sphere
 * @param {string} [units=kilometers] can be degrees, radians, miles, or kilometers inches, yards, metres, meters, kilometres, kilometers.
 * @returns {number} distance
 */
function radiansToDistance(radians, units) {
    if (radians === undefined || radians === null) throw new Error('radians is required');

    var factor = factors[units || 'kilometers'];
    if (!factor) throw new Error('units is invalid');
    return radians * factor;
}

/**
 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into radians
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @name distanceToRadians
 * @param {number} distance in real units
 * @param {string} [units=kilometers] can be degrees, radians, miles, or kilometers inches, yards, metres, meters, kilometres, kilometers.
 * @returns {number} radians
 */
function distanceToRadians(distance, units) {
    if (distance === undefined || distance === null) throw new Error('distance is required');

    var factor = factors[units || 'kilometers'];
    if (!factor) throw new Error('units is invalid');
    return distance / factor;
}

/**
 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into degrees
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, centimeters, kilometres, feet
 *
 * @name distanceToDegrees
 * @param {number} distance in real units
 * @param {string} [units=kilometers] can be degrees, radians, miles, or kilometers inches, yards, metres, meters, kilometres, kilometers.
 * @returns {number} degrees
 */
function distanceToDegrees(distance, units) {
    return radians2degrees(distanceToRadians(distance, units));
}

/**
 * Converts any bearing angle from the north line direction (positive clockwise)
 * and returns an angle between 0-360 degrees (positive clockwise), 0 being the north line
 *
 * @name bearingToAngle
 * @param {number} bearing angle, between -180 and +180 degrees
 * @returns {number} angle between 0 and 360 degrees
 */
function bearingToAngle(bearing) {
    if (bearing === null || bearing === undefined) throw new Error('bearing is required');

    var angle = bearing % 360;
    if (angle < 0) angle += 360;
    return angle;
}

/**
 * Converts an angle in radians to degrees
 *
 * @name radians2degrees
 * @param {number} radians angle in radians
 * @returns {number} degrees between 0 and 360 degrees
 */
function radians2degrees(radians) {
    if (radians === null || radians === undefined) throw new Error('radians is required');

    var degrees = radians % (2 * Math.PI);
    return degrees * 180 / Math.PI;
}

/**
 * Converts an angle in degrees to radians
 *
 * @name degrees2radians
 * @param {number} degrees angle between 0 and 360 degrees
 * @returns {number} angle in radians
 */
function degrees2radians(degrees) {
    if (degrees === null || degrees === undefined) throw new Error('degrees is required');

    var radians = degrees % 360;
    return radians * Math.PI / 180;
}


/**
 * Converts a distance to the requested unit.
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @param {number} distance to be converted
 * @param {string} originalUnit of the distance
 * @param {string} [finalUnit=kilometers] returned unit
 * @returns {number} the converted distance
 */
function convertDistance(distance, originalUnit, finalUnit) {
    if (distance === null || distance === undefined) throw new Error('distance is required');
    if (!(distance >= 0)) throw new Error('distance must be a positive number');

    var convertedDistance = radiansToDistance(distanceToRadians(distance, originalUnit), finalUnit || 'kilometers');
    return convertedDistance;
}

/**
 * Converts a area to the requested unit.
 * Valid units: kilometers, kilometres, meters, metres, centimetres, millimeter, acre, mile, yard, foot, inch
 * @param {number} area to be converted
 * @param {string} [originalUnit=meters] of the distance
 * @param {string} [finalUnit=kilometers] returned unit
 * @returns {number} the converted distance
 */
function convertArea(area, originalUnit, finalUnit) {
    if (area === null || area === undefined) throw new Error('area is required');
    if (!(area >= 0)) throw new Error('area must be a positive number');

    var startFactor = areaFactors[originalUnit || 'meters'];
    if (!startFactor) throw new Error('invalid original units');

    var finalFactor = areaFactors[finalUnit || 'kilometers'];
    if (!finalFactor) throw new Error('invalid final units');

    return (area / startFactor) * finalFactor;
}

/**
 * isNumber
 *
 * @param {*} num Number to validate
 * @returns {boolean} true/false
 * @example
 * turf.isNumber(123)
 * //=true
 * turf.isNumber('foo')
 * //=false
 */
function isNumber(num) {
    return !isNaN(num) && num !== null && !Array.isArray(num);
}

module.exports = {
    feature: feature,
    geometry: geometry,
    featureCollection: featureCollection,
    geometryCollection: geometryCollection,
    point: point,
    multiPoint: multiPoint,
    lineString: lineString,
    multiLineString: multiLineString,
    polygon: polygon,
    multiPolygon: multiPolygon,
    radiansToDistance: radiansToDistance,
    distanceToRadians: distanceToRadians,
    distanceToDegrees: distanceToDegrees,
    radians2degrees: radians2degrees,
    degrees2radians: degrees2radians,
    bearingToAngle: bearingToAngle,
    convertDistance: convertDistance,
    convertArea: convertArea,
    round: round,
    isNumber: isNumber
};


/***/ }),

/***/ "./node_modules/@turf/bbox/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__turf_meta__ = __webpack_require__("./node_modules/@turf/bbox/node_modules/@turf/meta/index.js");


/**
 * Takes a set of features, calculates the bbox of all input features, and returns a bounding box.
 *
 * @name bbox
 * @param {FeatureCollection|Feature<any>} geojson input features
 * @returns {Array<number>} bbox extent in [minX, minY, maxX, maxY] order
 * @example
 * var line = turf.lineString([[-74, 40], [-78, 42], [-82, 35]]);
 * var bbox = turf.bbox(line);
 * var bboxPolygon = turf.bboxPolygon(bbox);
 *
 * //addToMap
 * var addToMap = [line, bboxPolygon]
 */
function bbox(geojson) {
    var BBox = [Infinity, Infinity, -Infinity, -Infinity];
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__turf_meta__["a" /* coordEach */])(geojson, function (coord) {
        if (BBox[0] > coord[0]) BBox[0] = coord[0];
        if (BBox[1] > coord[1]) BBox[1] = coord[1];
        if (BBox[2] < coord[0]) BBox[2] = coord[0];
        if (BBox[3] < coord[1]) BBox[3] = coord[1];
    });
    return BBox;
}

/* harmony default export */ __webpack_exports__["default"] = (bbox);


/***/ }),

/***/ "./node_modules/@turf/bbox/node_modules/@turf/meta/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = coordEach;
/* unused harmony export coordReduce */
/* unused harmony export propEach */
/* unused harmony export propReduce */
/* unused harmony export featureEach */
/* unused harmony export featureReduce */
/* unused harmony export coordAll */
/* unused harmony export geomEach */
/* unused harmony export geomReduce */
/* unused harmony export flattenEach */
/* unused harmony export flattenReduce */
/* unused harmony export segmentEach */
/* unused harmony export segmentReduce */
/* unused harmony export lineEach */
/* unused harmony export lineReduce */
/**
 * Callback for coordEach
 *
 * @callback coordEachCallback
 * @param {Array<number>} currentCoord The current coordinate being processed.
 * @param {number} coordIndex The current index of the coordinate being processed.
 * Starts at index 0.
 * @param {number} featureIndex The current index of the feature being processed.
 * @param {number} featureSubIndex The current subIndex of the feature being processed.
 */

/**
 * Iterate over coordinates in any GeoJSON object, similar to Array.forEach()
 *
 * @name coordEach
 * @param {(FeatureCollection|Feature|Geometry)} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentCoord, coordIndex, featureIndex, featureSubIndex)
 * @param {boolean} [excludeWrapCoord=false] whether or not to include the final coordinate of LinearRings that wraps the ring in its iteration.
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {"foo": "bar"}),
 *   turf.point([36, 53], {"hello": "world"})
 * ]);
 *
 * turf.coordEach(features, function (currentCoord, coordIndex, featureIndex, featureSubIndex) {
 *   //=currentCoord
 *   //=coordIndex
 *   //=featureIndex
 *   //=featureSubIndex
 * });
 */
function coordEach(geojson, callback, excludeWrapCoord) {
    // Handles null Geometry -- Skips this GeoJSON
    if (geojson === null) return;
    var featureIndex, geometryIndex, j, k, l, geometry, stopG, coords,
        geometryMaybeCollection,
        wrapShrink = 0,
        coordIndex = 0,
        isGeometryCollection,
        type = geojson.type,
        isFeatureCollection = type === 'FeatureCollection',
        isFeature = type === 'Feature',
        stop = isFeatureCollection ? geojson.features.length : 1;

    // This logic may look a little weird. The reason why it is that way
    // is because it's trying to be fast. GeoJSON supports multiple kinds
    // of objects at its root: FeatureCollection, Features, Geometries.
    // This function has the responsibility of handling all of them, and that
    // means that some of the `for` loops you see below actually just don't apply
    // to certain inputs. For instance, if you give this just a
    // Point geometry, then both loops are short-circuited and all we do
    // is gradually rename the input until it's called 'geometry'.
    //
    // This also aims to allocate as few resources as possible: just a
    // few numbers and booleans, rather than any temporary arrays as would
    // be required with the normalization approach.
    for (featureIndex = 0; featureIndex < stop; featureIndex++) {
        geometryMaybeCollection = (isFeatureCollection ? geojson.features[featureIndex].geometry :
            (isFeature ? geojson.geometry : geojson));
        isGeometryCollection = (geometryMaybeCollection) ? geometryMaybeCollection.type === 'GeometryCollection' : false;
        stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;

        for (geometryIndex = 0; geometryIndex < stopG; geometryIndex++) {
            var featureSubIndex = 0;
            geometry = isGeometryCollection ?
                geometryMaybeCollection.geometries[geometryIndex] : geometryMaybeCollection;

            // Handles null Geometry -- Skips this geometry
            if (geometry === null) continue;
            coords = geometry.coordinates;
            var geomType = geometry.type;

            wrapShrink = (excludeWrapCoord && (geomType === 'Polygon' || geomType === 'MultiPolygon')) ? 1 : 0;

            switch (geomType) {
            case null:
                break;
            case 'Point':
                callback(coords, coordIndex, featureIndex, featureSubIndex);
                coordIndex++;
                featureSubIndex++;
                break;
            case 'LineString':
            case 'MultiPoint':
                for (j = 0; j < coords.length; j++) {
                    callback(coords[j], coordIndex, featureIndex, featureSubIndex);
                    coordIndex++;
                    if (geomType === 'MultiPoint') featureSubIndex++;
                }
                if (geomType === 'LineString') featureSubIndex++;
                break;
            case 'Polygon':
            case 'MultiLineString':
                for (j = 0; j < coords.length; j++) {
                    for (k = 0; k < coords[j].length - wrapShrink; k++) {
                        callback(coords[j][k], coordIndex, featureIndex, featureSubIndex);
                        coordIndex++;
                    }
                    if (geomType === 'MultiLineString') featureSubIndex++;
                }
                if (geomType === 'Polygon') featureSubIndex++;
                break;
            case 'MultiPolygon':
                for (j = 0; j < coords.length; j++) {
                    for (k = 0; k < coords[j].length; k++)
                        for (l = 0; l < coords[j][k].length - wrapShrink; l++) {
                            callback(coords[j][k][l], coordIndex, featureIndex, featureSubIndex);
                            coordIndex++;
                        }
                    featureSubIndex++;
                }
                break;
            case 'GeometryCollection':
                for (j = 0; j < geometry.geometries.length; j++)
                    coordEach(geometry.geometries[j], callback, excludeWrapCoord);
                break;
            default:
                throw new Error('Unknown Geometry Type');
            }
        }
    }
}

/**
 * Callback for coordReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback coordReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Array<number>} currentCoord The current coordinate being processed.
 * @param {number} coordIndex The current index of the coordinate being processed.
 * Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 * @param {number} featureIndex The current index of the feature being processed.
 * @param {number} featureSubIndex The current subIndex of the feature being processed.
 */

/**
 * Reduce coordinates in any GeoJSON object, similar to Array.reduce()
 *
 * @name coordReduce
 * @param {FeatureCollection|Geometry|Feature} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentCoord, coordIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @param {boolean} [excludeWrapCoord=false] whether or not to include the final coordinate of LinearRings that wraps the ring in its iteration.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {"foo": "bar"}),
 *   turf.point([36, 53], {"hello": "world"})
 * ]);
 *
 * turf.coordReduce(features, function (previousValue, currentCoord, coordIndex, featureIndex, featureSubIndex) {
 *   //=previousValue
 *   //=currentCoord
 *   //=coordIndex
 *   //=featureIndex
 *   //=featureSubIndex
 *   return currentCoord;
 * });
 */
function coordReduce(geojson, callback, initialValue, excludeWrapCoord) {
    var previousValue = initialValue;
    coordEach(geojson, function (currentCoord, coordIndex, featureIndex, featureSubIndex) {
        if (coordIndex === 0 && initialValue === undefined) previousValue = currentCoord;
        else previousValue = callback(previousValue, currentCoord, coordIndex, featureIndex, featureSubIndex);
    }, excludeWrapCoord);
    return previousValue;
}

/**
 * Callback for propEach
 *
 * @callback propEachCallback
 * @param {Object} currentProperties The current properties being processed.
 * @param {number} featureIndex The index of the current element being processed in the
 * array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 */

/**
 * Iterate over properties in any GeoJSON object, similar to Array.forEach()
 *
 * @name propEach
 * @param {(FeatureCollection|Feature)} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentProperties, featureIndex)
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.propEach(features, function (currentProperties, featureIndex) {
 *   //=currentProperties
 *   //=featureIndex
 * });
 */
function propEach(geojson, callback) {
    var i;
    switch (geojson.type) {
    case 'FeatureCollection':
        for (i = 0; i < geojson.features.length; i++) {
            callback(geojson.features[i].properties, i);
        }
        break;
    case 'Feature':
        callback(geojson.properties, 0);
        break;
    }
}


/**
 * Callback for propReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback propReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {*} currentProperties The current properties being processed.
 * @param {number} featureIndex The index of the current element being processed in the
 * array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 */

/**
 * Reduce properties in any GeoJSON object into a single value,
 * similar to how Array.reduce works. However, in this case we lazily run
 * the reduction, so an array of all properties is unnecessary.
 *
 * @name propReduce
 * @param {(FeatureCollection|Feature)} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentProperties, featureIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.propReduce(features, function (previousValue, currentProperties, featureIndex) {
 *   //=previousValue
 *   //=currentProperties
 *   //=featureIndex
 *   return currentProperties
 * });
 */
function propReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    propEach(geojson, function (currentProperties, featureIndex) {
        if (featureIndex === 0 && initialValue === undefined) previousValue = currentProperties;
        else previousValue = callback(previousValue, currentProperties, featureIndex);
    });
    return previousValue;
}

/**
 * Callback for featureEach
 *
 * @callback featureEachCallback
 * @param {Feature<any>} currentFeature The current feature being processed.
 * @param {number} featureIndex The index of the current element being processed in the
 * array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 */

/**
 * Iterate over features in any GeoJSON object, similar to
 * Array.forEach.
 *
 * @name featureEach
 * @param {(FeatureCollection|Feature|Geometry)} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentFeature, featureIndex)
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {foo: 'bar'}),
 *   turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.featureEach(features, function (currentFeature, featureIndex) {
 *   //=currentFeature
 *   //=featureIndex
 * });
 */
function featureEach(geojson, callback) {
    if (geojson.type === 'Feature') {
        callback(geojson, 0);
    } else if (geojson.type === 'FeatureCollection') {
        for (var i = 0; i < geojson.features.length; i++) {
            callback(geojson.features[i], i);
        }
    }
}

/**
 * Callback for featureReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback featureReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature} currentFeature The current Feature being processed.
 * @param {number} featureIndex The index of the current element being processed in the
 * array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 */

/**
 * Reduce features in any GeoJSON object, similar to Array.reduce().
 *
 * @name featureReduce
 * @param {(FeatureCollection|Feature|Geometry)} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentFeature, featureIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {"foo": "bar"}),
 *   turf.point([36, 53], {"hello": "world"})
 * ]);
 *
 * turf.featureReduce(features, function (previousValue, currentFeature, featureIndex) {
 *   //=previousValue
 *   //=currentFeature
 *   //=featureIndex
 *   return currentFeature
 * });
 */
function featureReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    featureEach(geojson, function (currentFeature, featureIndex) {
        if (featureIndex === 0 && initialValue === undefined) previousValue = currentFeature;
        else previousValue = callback(previousValue, currentFeature, featureIndex);
    });
    return previousValue;
}

/**
 * Get all coordinates from any GeoJSON object.
 *
 * @name coordAll
 * @param {(FeatureCollection|Feature|Geometry)} geojson any GeoJSON object
 * @returns {Array<Array<number>>} coordinate position array
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {foo: 'bar'}),
 *   turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * var coords = turf.coordAll(features);
 * //= [[26, 37], [36, 53]]
 */
function coordAll(geojson) {
    var coords = [];
    coordEach(geojson, function (coord) {
        coords.push(coord);
    });
    return coords;
}

/**
 * Callback for geomEach
 *
 * @callback geomEachCallback
 * @param {Geometry} currentGeometry The current geometry being processed.
 * @param {number} currentIndex The index of the current element being processed in the
 * array. Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 * @param {number} currentProperties The current feature properties being processed.
 */

/**
 * Iterate over each geometry in any GeoJSON object, similar to Array.forEach()
 *
 * @name geomEach
 * @param {(FeatureCollection|Feature|Geometry)} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentGeometry, featureIndex, currentProperties)
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.geomEach(features, function (currentGeometry, featureIndex, currentProperties) {
 *   //=currentGeometry
 *   //=featureIndex
 *   //=currentProperties
 * });
 */
function geomEach(geojson, callback) {
    var i, j, g, geometry, stopG,
        geometryMaybeCollection,
        isGeometryCollection,
        geometryProperties,
        featureIndex = 0,
        isFeatureCollection = geojson.type === 'FeatureCollection',
        isFeature = geojson.type === 'Feature',
        stop = isFeatureCollection ? geojson.features.length : 1;

    // This logic may look a little weird. The reason why it is that way
    // is because it's trying to be fast. GeoJSON supports multiple kinds
    // of objects at its root: FeatureCollection, Features, Geometries.
    // This function has the responsibility of handling all of them, and that
    // means that some of the `for` loops you see below actually just don't apply
    // to certain inputs. For instance, if you give this just a
    // Point geometry, then both loops are short-circuited and all we do
    // is gradually rename the input until it's called 'geometry'.
    //
    // This also aims to allocate as few resources as possible: just a
    // few numbers and booleans, rather than any temporary arrays as would
    // be required with the normalization approach.
    for (i = 0; i < stop; i++) {

        geometryMaybeCollection = (isFeatureCollection ? geojson.features[i].geometry :
            (isFeature ? geojson.geometry : geojson));
        geometryProperties = (isFeatureCollection ? geojson.features[i].properties :
            (isFeature ? geojson.properties : {}));
        isGeometryCollection = (geometryMaybeCollection) ? geometryMaybeCollection.type === 'GeometryCollection' : false;
        stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;

        for (g = 0; g < stopG; g++) {
            geometry = isGeometryCollection ?
                geometryMaybeCollection.geometries[g] : geometryMaybeCollection;

            // Handle null Geometry
            if (geometry === null) {
                callback(null, featureIndex, geometryProperties);
                continue;
            }
            switch (geometry.type) {
            case 'Point':
            case 'LineString':
            case 'MultiPoint':
            case 'Polygon':
            case 'MultiLineString':
            case 'MultiPolygon': {
                callback(geometry, featureIndex, geometryProperties);
                break;
            }
            case 'GeometryCollection': {
                for (j = 0; j < geometry.geometries.length; j++) {
                    callback(geometry.geometries[j], featureIndex, geometryProperties);
                }
                break;
            }
            default:
                throw new Error('Unknown Geometry Type');
            }
        }
        // Only increase `featureIndex` per each feature
        featureIndex++;
    }
}

/**
 * Callback for geomReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback geomReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Geometry} currentGeometry The current Feature being processed.
 * @param {number} currentIndex The index of the current element being processed in the
 * array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 * @param {Object} currentProperties The current feature properties being processed.
 */

/**
 * Reduce geometry in any GeoJSON object, similar to Array.reduce().
 *
 * @name geomReduce
 * @param {(FeatureCollection|Feature|Geometry)} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentGeometry, featureIndex, currentProperties)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.geomReduce(features, function (previousValue, currentGeometry, featureIndex, currentProperties) {
 *   //=previousValue
 *   //=currentGeometry
 *   //=featureIndex
 *   //=currentProperties
 *   return currentGeometry
 * });
 */
function geomReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    geomEach(geojson, function (currentGeometry, currentIndex, currentProperties) {
        if (currentIndex === 0 && initialValue === undefined) previousValue = currentGeometry;
        else previousValue = callback(previousValue, currentGeometry, currentIndex, currentProperties);
    });
    return previousValue;
}

/**
 * Callback for flattenEach
 *
 * @callback flattenEachCallback
 * @param {Feature} currentFeature The current flattened feature being processed.
 * @param {number} featureIndex The index of the current element being processed in the
 * array. Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 * @param {number} featureSubIndex The subindex of the current element being processed in the
 * array. Starts at index 0 and increases if the flattened feature was a multi-geometry.
 */

/**
 * Iterate over flattened features in any GeoJSON object, similar to
 * Array.forEach.
 *
 * @name flattenEach
 * @param {(FeatureCollection|Feature|Geometry)} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentFeature, featureIndex, featureSubIndex)
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.multiPoint([[40, 30], [36, 53]], {hello: 'world'})
 * ]);
 *
 * turf.flattenEach(features, function (currentFeature, featureIndex, featureSubIndex) {
 *   //=currentFeature
 *   //=featureIndex
 *   //=featureSubIndex
 * });
 */
function flattenEach(geojson, callback) {
    geomEach(geojson, function (geometry, featureIndex, properties) {
        // Callback for single geometry
        var type = (geometry === null) ? null : geometry.type;
        switch (type) {
        case null:
        case 'Point':
        case 'LineString':
        case 'Polygon':
            callback(feature(geometry, properties), featureIndex, 0);
            return;
        }

        var geomType;

        // Callback for multi-geometry
        switch (type) {
        case 'MultiPoint':
            geomType = 'Point';
            break;
        case 'MultiLineString':
            geomType = 'LineString';
            break;
        case 'MultiPolygon':
            geomType = 'Polygon';
            break;
        }

        geometry.coordinates.forEach(function (coordinate, featureSubIndex) {
            var geom = {
                type: geomType,
                coordinates: coordinate
            };
            callback(feature(geom, properties), featureIndex, featureSubIndex);
        });

    });
}

/**
 * Callback for flattenReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback flattenReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature} currentFeature The current Feature being processed.
 * @param {number} featureIndex The index of the current element being processed in the
 * array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 * @param {number} featureSubIndex The subindex of the current element being processed in the
 * array. Starts at index 0 and increases if the flattened feature was a multi-geometry.
 */

/**
 * Reduce flattened features in any GeoJSON object, similar to Array.reduce().
 *
 * @name flattenReduce
 * @param {(FeatureCollection|Feature|Geometry)} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentFeature, featureIndex, featureSubIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.multiPoint([[40, 30], [36, 53]], {hello: 'world'})
 * ]);
 *
 * turf.flattenReduce(features, function (previousValue, currentFeature, featureIndex, featureSubIndex) {
 *   //=previousValue
 *   //=currentFeature
 *   //=featureIndex
 *   //=featureSubIndex
 *   return currentFeature
 * });
 */
function flattenReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    flattenEach(geojson, function (currentFeature, featureIndex, featureSubIndex) {
        if (featureIndex === 0 && featureSubIndex === 0 && initialValue === undefined) previousValue = currentFeature;
        else previousValue = callback(previousValue, currentFeature, featureIndex, featureSubIndex);
    });
    return previousValue;
}

/**
 * Callback for segmentEach
 *
 * @callback segmentEachCallback
 * @param {Feature<LineString>} currentSegment The current segment being processed.
 * @param {number} featureIndex The featureIndex currently being processed, starts at index 0.
 * @param {number} featureSubIndex The featureSubIndex currently being processed, starts at index 0.
 * @param {number} segmentIndex The segmentIndex currently being processed, starts at index 0.
 * @returns {void}
 */

/**
 * Iterate over 2-vertex line segment in any GeoJSON object, similar to Array.forEach()
 * (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
 *
 * @param {(FeatureCollection|Feature|Geometry)} geojson any GeoJSON
 * @param {Function} callback a method that takes (currentSegment, featureIndex, featureSubIndex)
 * @returns {void}
 * @example
 * var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);
 *
 * // Iterate over GeoJSON by 2-vertex segments
 * turf.segmentEach(polygon, function (currentSegment, featureIndex, featureSubIndex, segmentIndex) {
 *   //= currentSegment
 *   //= featureIndex
 *   //= featureSubIndex
 *   //= segmentIndex
 * });
 *
 * // Calculate the total number of segments
 * var total = 0;
 * turf.segmentEach(polygon, function () {
 *     total++;
 * });
 */
function segmentEach(geojson, callback) {
    flattenEach(geojson, function (feature, featureIndex, featureSubIndex) {
        var segmentIndex = 0;

        // Exclude null Geometries
        if (!feature.geometry) return;
        // (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
        var type = feature.geometry.type;
        if (type === 'Point' || type === 'MultiPoint') return;

        // Generate 2-vertex line segments
        coordReduce(feature, function (previousCoords, currentCoord) {
            var currentSegment = lineString([previousCoords, currentCoord], feature.properties);
            callback(currentSegment, featureIndex, featureSubIndex, segmentIndex);
            segmentIndex++;
            return currentCoord;
        });
    });
}

/**
 * Callback for segmentReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback segmentReduceCallback
 * @param {*} [previousValue] The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature<LineString>} [currentSegment] The current segment being processed.
 * @param {number} featureIndex The featureIndex currently being processed, starts at index 0.
 * @param {number} featureSubIndex The featureSubIndex currently being processed, starts at index 0.
 * @param {number} segmentIndex The segmentIndex currently being processed, starts at index 0.
 */

/**
 * Reduce 2-vertex line segment in any GeoJSON object, similar to Array.reduce()
 * (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
 *
 * @param {(FeatureCollection|Feature|Geometry)} geojson any GeoJSON
 * @param {Function} callback a method that takes (previousValue, currentSegment, currentIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {void}
 * @example
 * var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);
 *
 * // Iterate over GeoJSON by 2-vertex segments
 * turf.segmentReduce(polygon, function (previousSegment, currentSegment, featureIndex, featureSubIndex, segmentIndex) {
 *   //= previousSegment
 *   //= currentSegment
 *   //= featureIndex
 *   //= featureSubIndex
 *   //= segmentInex
 *   return currentSegment
 * });
 *
 * // Calculate the total number of segments
 * var initialValue = 0
 * var total = turf.segmentReduce(polygon, function (previousValue) {
 *     previousValue++;
 *     return previousValue;
 * }, initialValue);
 */
function segmentReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    var started = false;
    segmentEach(geojson, function (currentSegment, featureIndex, featureSubIndex, segmentIndex) {
        if (started === false && initialValue === undefined) previousValue = currentSegment;
        else previousValue = callback(previousValue, currentSegment, featureIndex, featureSubIndex, segmentIndex);
        started = true;
    });
    return previousValue;
}

/**
 * Create Feature
 *
 * @private
 * @param {Geometry} geometry GeoJSON Geometry
 * @param {Object} properties Properties
 * @returns {Feature} GeoJSON Feature
 */
function feature(geometry, properties) {
    if (geometry === undefined) throw new Error('No geometry passed');

    return {
        type: 'Feature',
        properties: properties || {},
        geometry: geometry
    };
}

/**
 * Create LineString
 *
 * @private
 * @param {Array<Array<number>>} coordinates Line Coordinates
 * @param {Object} properties Properties
 * @returns {Feature<LineString>} GeoJSON LineString Feature
 */
function lineString(coordinates, properties) {
    if (!coordinates) throw new Error('No coordinates passed');
    if (coordinates.length < 2) throw new Error('Coordinates must be an array of two or more positions');

    return {
        type: 'Feature',
        properties: properties || {},
        geometry: {
            type: 'LineString',
            coordinates: coordinates
        }
    };
}

/**
 * Callback for lineEach
 *
 * @callback lineEachCallback
 * @param {Feature<LineString>} currentLine The current LineString|LinearRing being processed.
 * @param {number} lineIndex The index of the current element being processed in the array, starts at index 0.
 * @param {number} lineSubIndex The sub-index of the current line being processed at index 0
 */

/**
 * Iterate over line or ring coordinates in LineString, Polygon, MultiLineString, MultiPolygon Features or Geometries,
 * similar to Array.forEach.
 *
 * @name lineEach
 * @param {Geometry|Feature<LineString|Polygon|MultiLineString|MultiPolygon>} geojson object
 * @param {Function} callback a method that takes (currentLine, lineIndex, lineSubIndex)
 * @example
 * var mtLn = turf.multiLineString([
 *   turf.lineString([[26, 37], [35, 45]]),
 *   turf.lineString([[36, 53], [38, 50], [41, 55]])
 * ]);
 *
 * turf.lineEach(mtLn, function (currentLine, lineIndex) {
 *   //=currentLine
 *   //=lineIndex
 * });
 */
function lineEach(geojson, callback) {
    // validation
    if (!geojson) throw new Error('geojson is required');
    var type = geojson.geometry ? geojson.geometry.type : geojson.type;
    if (!type) throw new Error('invalid geojson');
    if (type === 'FeatureCollection') throw new Error('FeatureCollection is not supported');
    if (type === 'GeometryCollection') throw new Error('GeometryCollection is not supported');
    var coordinates = geojson.geometry ? geojson.geometry.coordinates : geojson.coordinates;
    if (!coordinates) throw new Error('geojson must contain coordinates');

    switch (type) {
    case 'LineString':
        callback(coordinates, 0, 0);
        return;
    case 'Polygon':
    case 'MultiLineString':
        var subIndex = 0;
        for (var line = 0; line < coordinates.length; line++) {
            if (type === 'MultiLineString') subIndex = line;
            callback(coordinates[line], line, subIndex);
        }
        return;
    case 'MultiPolygon':
        for (var multi = 0; multi < coordinates.length; multi++) {
            for (var ring = 0; ring < coordinates[multi].length; ring++) {
                callback(coordinates[multi][ring], ring, multi);
            }
        }
        return;
    default:
        throw new Error(type + ' geometry not supported');
    }
}

/**
 * Callback for lineReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback lineReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature<LineString>} currentLine The current LineString|LinearRing being processed.
 * @param {number} lineIndex The index of the current element being processed in the
 * array. Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 * @param {number} lineSubIndex The sub-index of the current line being processed at index 0
 */

/**
 * Reduce features in any GeoJSON object, similar to Array.reduce().
 *
 * @name lineReduce
 * @param {Geometry|Feature<LineString|Polygon|MultiLineString|MultiPolygon>} geojson object
 * @param {Function} callback a method that takes (previousValue, currentFeature, featureIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var mtp = turf.multiPolygon([
 *   turf.polygon([[[12,48],[2,41],[24,38],[12,48]], [[9,44],[13,41],[13,45],[9,44]]]),
 *   turf.polygon([[[5, 5], [0, 0], [2, 2], [4, 4], [5, 5]]])
 * ]);
 *
 * turf.lineReduce(mtp, function (previousValue, currentLine, lineIndex, lineSubIndex) {
 *   //=previousValue
 *   //=currentLine
 *   //=lineIndex
 *   //=lineSubIndex
 *   return currentLine
 * }, 2);
 */
function lineReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    lineEach(geojson, function (currentLine, lineIndex, lineSubIndex) {
        if (lineIndex === 0 && initialValue === undefined) previousValue = currentLine;
        else previousValue = callback(previousValue, currentLine, lineIndex, lineSubIndex);
    });
    return previousValue;
}


/***/ }),

/***/ "./node_modules/@turf/centroid/index.js":
/***/ (function(module, exports, __webpack_require__) {

var coordEach = __webpack_require__("./node_modules/@turf/meta/index.js").coordEach;
var point = __webpack_require__("./node_modules/@turf/centroid/node_modules/@turf/helpers/index.js").point;

/**
 * Takes one or more features and calculates the centroid using the mean of all vertices.
 * This lessens the effect of small islands and artifacts when calculating the centroid of a set of polygons.
 *
 * @name centroid
 * @param {GeoJSON} geojson GeoJSON to be centered
 * @param {Object} [properties] an Object that is used as the {@link Feature}'s properties
 * @returns {Feature<Point>} the centroid of the input features
 * @example
 * var polygon = turf.polygon([[[-81, 41], [-88, 36], [-84, 31], [-80, 33], [-77, 39], [-81, 41]]]);
 *
 * var centroid = turf.centroid(polygon);
 *
 * //addToMap
 * var addToMap = [polygon, centroid]
 */
module.exports = function (geojson, properties) {
    var xSum = 0;
    var ySum = 0;
    var len = 0;
    coordEach(geojson, function (coord) {
        xSum += coord[0];
        ySum += coord[1];
        len++;
    }, true);
    return point([xSum / len, ySum / len], properties);
};


/***/ }),

/***/ "./node_modules/@turf/centroid/node_modules/@turf/helpers/index.js":
/***/ (function(module, exports) {

/**
 * Wraps a GeoJSON {@link Geometry} in a GeoJSON {@link Feature}.
 *
 * @name feature
 * @param {Geometry} geometry input geometry
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature} a GeoJSON Feature
 * @example
 * var geometry = {
 *   "type": "Point",
 *   "coordinates": [110, 50]
 * };
 *
 * var feature = turf.feature(geometry);
 *
 * //=feature
 */
function feature(geometry, properties, bbox, id) {
    if (geometry === undefined) throw new Error('geometry is required');
    if (properties && properties.constructor !== Object) throw new Error('properties must be an Object');
    if (bbox && bbox.length !== 4) throw new Error('bbox must be an Array of 4 numbers');
    if (id && ['string', 'number'].indexOf(typeof id) === -1) throw new Error('id must be a number or a string');

    var feat = {type: 'Feature'};
    if (id) feat.id = id;
    if (bbox) feat.bbox = bbox;
    feat.properties = properties || {};
    feat.geometry = geometry;
    return feat;
}

/**
 * Creates a GeoJSON {@link Geometry} from a Geometry string type & coordinates.
 * For GeometryCollection type use `helpers.geometryCollection`
 *
 * @name geometry
 * @param {string} type Geometry Type
 * @param {Array<number>} coordinates Coordinates
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @returns {Geometry} a GeoJSON Geometry
 * @example
 * var type = 'Point';
 * var coordinates = [110, 50];
 *
 * var geometry = turf.geometry(type, coordinates);
 *
 * //=geometry
 */
function geometry(type, coordinates, bbox) {
    // Validation
    if (!type) throw new Error('type is required');
    if (!coordinates) throw new Error('coordinates is required');
    if (!Array.isArray(coordinates)) throw new Error('coordinates must be an Array');
    if (bbox && bbox.length !== 4) throw new Error('bbox must be an Array of 4 numbers');

    var geom;
    switch (type) {
    case 'Point': geom = point(coordinates).geometry; break;
    case 'LineString': geom = lineString(coordinates).geometry; break;
    case 'Polygon': geom = polygon(coordinates).geometry; break;
    case 'MultiPoint': geom = multiPoint(coordinates).geometry; break;
    case 'MultiLineString': geom = multiLineString(coordinates).geometry; break;
    case 'MultiPolygon': geom = multiPolygon(coordinates).geometry; break;
    default: throw new Error(type + ' is invalid');
    }
    if (bbox) geom.bbox = bbox;
    return geom;
}

/**
 * Takes coordinates and properties (optional) and returns a new {@link Point} feature.
 *
 * @name point
 * @param {Array<number>} coordinates longitude, latitude position (each in decimal degrees)
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<Point>} a Point feature
 * @example
 * var point = turf.point([-75.343, 39.984]);
 *
 * //=point
 */
function point(coordinates, properties, bbox, id) {
    if (!coordinates) throw new Error('No coordinates passed');
    if (coordinates.length === undefined) throw new Error('Coordinates must be an array');
    if (coordinates.length < 2) throw new Error('Coordinates must be at least 2 numbers long');
    if (!isNumber(coordinates[0]) || !isNumber(coordinates[1])) throw new Error('Coordinates must contain numbers');

    return feature({
        type: 'Point',
        coordinates: coordinates
    }, properties, bbox, id);
}

/**
 * Takes an array of LinearRings and optionally an {@link Object} with properties and returns a {@link Polygon} feature.
 *
 * @name polygon
 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<Polygon>} a Polygon feature
 * @throws {Error} throw an error if a LinearRing of the polygon has too few positions
 * or if a LinearRing of the Polygon does not have matching Positions at the beginning & end.
 * @example
 * var polygon = turf.polygon([[
 *   [-2.275543, 53.464547],
 *   [-2.275543, 53.489271],
 *   [-2.215118, 53.489271],
 *   [-2.215118, 53.464547],
 *   [-2.275543, 53.464547]
 * ]], { name: 'poly1', population: 400});
 *
 * //=polygon
 */
function polygon(coordinates, properties, bbox, id) {
    if (!coordinates) throw new Error('No coordinates passed');

    for (var i = 0; i < coordinates.length; i++) {
        var ring = coordinates[i];
        if (ring.length < 4) {
            throw new Error('Each LinearRing of a Polygon must have 4 or more Positions.');
        }
        for (var j = 0; j < ring[ring.length - 1].length; j++) {
            // Check if first point of Polygon contains two numbers
            if (i === 0 && j === 0 && !isNumber(ring[0][0]) || !isNumber(ring[0][1])) throw new Error('Coordinates must contain numbers');
            if (ring[ring.length - 1][j] !== ring[0][j]) {
                throw new Error('First and last Position are not equivalent.');
            }
        }
    }

    return feature({
        type: 'Polygon',
        coordinates: coordinates
    }, properties, bbox, id);
}

/**
 * Creates a {@link LineString} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name lineString
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<LineString>} a LineString feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var linestring1 = turf.lineString([
 *   [-21.964416, 64.148203],
 *   [-21.956176, 64.141316],
 *   [-21.93901, 64.135924],
 *   [-21.927337, 64.136673]
 * ]);
 * var linestring2 = turf.lineString([
 *   [-21.929054, 64.127985],
 *   [-21.912918, 64.134726],
 *   [-21.916007, 64.141016],
 *   [-21.930084, 64.14446]
 * ], {name: 'line 1', distance: 145});
 *
 * //=linestring1
 *
 * //=linestring2
 */
function lineString(coordinates, properties, bbox, id) {
    if (!coordinates) throw new Error('No coordinates passed');
    if (coordinates.length < 2) throw new Error('Coordinates must be an array of two or more positions');
    // Check if first point of LineString contains two numbers
    if (!isNumber(coordinates[0][1]) || !isNumber(coordinates[0][1])) throw new Error('Coordinates must contain numbers');

    return feature({
        type: 'LineString',
        coordinates: coordinates
    }, properties, bbox, id);
}

/**
 * Takes one or more {@link Feature|Features} and creates a {@link FeatureCollection}.
 *
 * @name featureCollection
 * @param {Feature[]} features input features
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {FeatureCollection} a FeatureCollection of input features
 * @example
 * var features = [
 *  turf.point([-75.343, 39.984], {name: 'Location A'}),
 *  turf.point([-75.833, 39.284], {name: 'Location B'}),
 *  turf.point([-75.534, 39.123], {name: 'Location C'})
 * ];
 *
 * var collection = turf.featureCollection(features);
 *
 * //=collection
 */
function featureCollection(features, bbox, id) {
    if (!features) throw new Error('No features passed');
    if (!Array.isArray(features)) throw new Error('features must be an Array');
    if (bbox && bbox.length !== 4) throw new Error('bbox must be an Array of 4 numbers');
    if (id && ['string', 'number'].indexOf(typeof id) === -1) throw new Error('id must be a number or a string');

    var fc = {type: 'FeatureCollection'};
    if (id) fc.id = id;
    if (bbox) fc.bbox = bbox;
    fc.features = features;
    return fc;
}

/**
 * Creates a {@link Feature<MultiLineString>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiLineString
 * @param {Array<Array<Array<number>>>} coordinates an array of LineStrings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<MultiLineString>} a MultiLineString feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiLine = turf.multiLineString([[[0,0],[10,10]]]);
 *
 * //=multiLine
 */
function multiLineString(coordinates, properties, bbox, id) {
    if (!coordinates) throw new Error('No coordinates passed');

    return feature({
        type: 'MultiLineString',
        coordinates: coordinates
    }, properties, bbox, id);
}

/**
 * Creates a {@link Feature<MultiPoint>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPoint
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<MultiPoint>} a MultiPoint feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPt = turf.multiPoint([[0,0],[10,10]]);
 *
 * //=multiPt
 */
function multiPoint(coordinates, properties, bbox, id) {
    if (!coordinates) throw new Error('No coordinates passed');

    return feature({
        type: 'MultiPoint',
        coordinates: coordinates
    }, properties, bbox, id);
}

/**
 * Creates a {@link Feature<MultiPolygon>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPolygon
 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygons
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<MultiPolygon>} a multipolygon feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPoly = turf.multiPolygon([[[[0,0],[0,10],[10,10],[10,0],[0,0]]]]);
 *
 * //=multiPoly
 *
 */
function multiPolygon(coordinates, properties, bbox, id) {
    if (!coordinates) throw new Error('No coordinates passed');

    return feature({
        type: 'MultiPolygon',
        coordinates: coordinates
    }, properties, bbox, id);
}

/**
 * Creates a {@link Feature<GeometryCollection>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name geometryCollection
 * @param {Array<Geometry>} geometries an array of GeoJSON Geometries
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<GeometryCollection>} a GeoJSON GeometryCollection Feature
 * @example
 * var pt = {
 *     "type": "Point",
 *       "coordinates": [100, 0]
 *     };
 * var line = {
 *     "type": "LineString",
 *     "coordinates": [ [101, 0], [102, 1] ]
 *   };
 * var collection = turf.geometryCollection([pt, line]);
 *
 * //=collection
 */
function geometryCollection(geometries, properties, bbox, id) {
    if (!geometries) throw new Error('geometries is required');
    if (!Array.isArray(geometries)) throw new Error('geometries must be an Array');

    return feature({
        type: 'GeometryCollection',
        geometries: geometries
    }, properties, bbox, id);
}

// https://en.wikipedia.org/wiki/Great-circle_distance#Radius_for_spherical_Earth
var factors = {
    miles: 3960,
    nauticalmiles: 3441.145,
    degrees: 57.2957795,
    radians: 1,
    inches: 250905600,
    yards: 6969600,
    meters: 6373000,
    metres: 6373000,
    centimeters: 6.373e+8,
    centimetres: 6.373e+8,
    kilometers: 6373,
    kilometres: 6373,
    feet: 20908792.65
};

var areaFactors = {
    kilometers: 0.000001,
    kilometres: 0.000001,
    meters: 1,
    metres: 1,
    centimetres: 10000,
    millimeter: 1000000,
    acres: 0.000247105,
    miles: 3.86e-7,
    yards: 1.195990046,
    feet: 10.763910417,
    inches: 1550.003100006
};
/**
 * Round number to precision
 *
 * @param {number} num Number
 * @param {number} [precision=0] Precision
 * @returns {number} rounded number
 * @example
 * turf.round(120.4321)
 * //=120
 *
 * turf.round(120.4321, 2)
 * //=120.43
 */
function round(num, precision) {
    if (num === undefined || num === null || isNaN(num)) throw new Error('num is required');
    if (precision && !(precision >= 0)) throw new Error('precision must be a positive number');
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(num * multiplier) / multiplier;
}

/**
 * Convert a distance measurement (assuming a spherical Earth) from radians to a more friendly unit.
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @name radiansToDistance
 * @param {number} radians in radians across the sphere
 * @param {string} [units=kilometers] can be degrees, radians, miles, or kilometers inches, yards, metres, meters, kilometres, kilometers.
 * @returns {number} distance
 */
function radiansToDistance(radians, units) {
    if (radians === undefined || radians === null) throw new Error('radians is required');

    var factor = factors[units || 'kilometers'];
    if (!factor) throw new Error('units is invalid');
    return radians * factor;
}

/**
 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into radians
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @name distanceToRadians
 * @param {number} distance in real units
 * @param {string} [units=kilometers] can be degrees, radians, miles, or kilometers inches, yards, metres, meters, kilometres, kilometers.
 * @returns {number} radians
 */
function distanceToRadians(distance, units) {
    if (distance === undefined || distance === null) throw new Error('distance is required');

    var factor = factors[units || 'kilometers'];
    if (!factor) throw new Error('units is invalid');
    return distance / factor;
}

/**
 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into degrees
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, centimeters, kilometres, feet
 *
 * @name distanceToDegrees
 * @param {number} distance in real units
 * @param {string} [units=kilometers] can be degrees, radians, miles, or kilometers inches, yards, metres, meters, kilometres, kilometers.
 * @returns {number} degrees
 */
function distanceToDegrees(distance, units) {
    return radians2degrees(distanceToRadians(distance, units));
}

/**
 * Converts any bearing angle from the north line direction (positive clockwise)
 * and returns an angle between 0-360 degrees (positive clockwise), 0 being the north line
 *
 * @name bearingToAngle
 * @param {number} bearing angle, between -180 and +180 degrees
 * @returns {number} angle between 0 and 360 degrees
 */
function bearingToAngle(bearing) {
    if (bearing === null || bearing === undefined) throw new Error('bearing is required');

    var angle = bearing % 360;
    if (angle < 0) angle += 360;
    return angle;
}

/**
 * Converts an angle in radians to degrees
 *
 * @name radians2degrees
 * @param {number} radians angle in radians
 * @returns {number} degrees between 0 and 360 degrees
 */
function radians2degrees(radians) {
    if (radians === null || radians === undefined) throw new Error('radians is required');

    var degrees = radians % (2 * Math.PI);
    return degrees * 180 / Math.PI;
}

/**
 * Converts an angle in degrees to radians
 *
 * @name degrees2radians
 * @param {number} degrees angle between 0 and 360 degrees
 * @returns {number} angle in radians
 */
function degrees2radians(degrees) {
    if (degrees === null || degrees === undefined) throw new Error('degrees is required');

    var radians = degrees % 360;
    return radians * Math.PI / 180;
}


/**
 * Converts a distance to the requested unit.
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @param {number} distance to be converted
 * @param {string} originalUnit of the distance
 * @param {string} [finalUnit=kilometers] returned unit
 * @returns {number} the converted distance
 */
function convertDistance(distance, originalUnit, finalUnit) {
    if (distance === null || distance === undefined) throw new Error('distance is required');
    if (!(distance >= 0)) throw new Error('distance must be a positive number');

    var convertedDistance = radiansToDistance(distanceToRadians(distance, originalUnit), finalUnit || 'kilometers');
    return convertedDistance;
}

/**
 * Converts a area to the requested unit.
 * Valid units: kilometers, kilometres, meters, metres, centimetres, millimeter, acre, mile, yard, foot, inch
 * @param {number} area to be converted
 * @param {string} [originalUnit=meters] of the distance
 * @param {string} [finalUnit=kilometers] returned unit
 * @returns {number} the converted distance
 */
function convertArea(area, originalUnit, finalUnit) {
    if (area === null || area === undefined) throw new Error('area is required');
    if (!(area >= 0)) throw new Error('area must be a positive number');

    var startFactor = areaFactors[originalUnit || 'meters'];
    if (!startFactor) throw new Error('invalid original units');

    var finalFactor = areaFactors[finalUnit || 'kilometers'];
    if (!finalFactor) throw new Error('invalid final units');

    return (area / startFactor) * finalFactor;
}

/**
 * isNumber
 *
 * @param {*} num Number to validate
 * @returns {boolean} true/false
 * @example
 * turf.isNumber(123)
 * //=true
 * turf.isNumber('foo')
 * //=false
 */
function isNumber(num) {
    return !isNaN(num) && num !== null && !Array.isArray(num);
}

module.exports = {
    feature: feature,
    geometry: geometry,
    featureCollection: featureCollection,
    geometryCollection: geometryCollection,
    point: point,
    multiPoint: multiPoint,
    lineString: lineString,
    multiLineString: multiLineString,
    polygon: polygon,
    multiPolygon: multiPolygon,
    radiansToDistance: radiansToDistance,
    distanceToRadians: distanceToRadians,
    distanceToDegrees: distanceToDegrees,
    radians2degrees: radians2degrees,
    degrees2radians: degrees2radians,
    bearingToAngle: bearingToAngle,
    convertDistance: convertDistance,
    convertArea: convertArea,
    round: round,
    isNumber: isNumber
};


/***/ }),

/***/ "./node_modules/@turf/flatten/index.js":
/***/ (function(module, exports, __webpack_require__) {

var flattenEach = __webpack_require__("./node_modules/@turf/meta/index.js").flattenEach;
var featureCollection = __webpack_require__("./node_modules/@turf/flatten/node_modules/@turf/helpers/index.js").featureCollection;

/**
 * Flattens any {@link GeoJSON} to a {@link FeatureCollection} inspired by [geojson-flatten](https://github.com/tmcw/geojson-flatten).
 *
 * @name flatten
 * @param {FeatureCollection|Geometry|Feature<any>} geojson any valid GeoJSON Object
 * @returns {FeatureCollection<any>} all Multi-Geometries are flattened into single Features
 * @example
 * var multiGeometry = turf.multiPolygon([
 *   [[[102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0]]],
 *   [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
 *   [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
 * ]);
 *
 * var flatten = turf.flatten(multiGeometry);
 *
 * //addToMap
 * var addToMap = [flatten]
 */
module.exports = function (geojson) {
    if (!geojson) throw new Error('geojson is required');

    var results = [];
    flattenEach(geojson, function (feature) {
        results.push(feature);
    });
    return featureCollection(results);
};


/***/ }),

/***/ "./node_modules/@turf/flatten/node_modules/@turf/helpers/index.js":
/***/ (function(module, exports) {

/**
 * Wraps a GeoJSON {@link Geometry} in a GeoJSON {@link Feature}.
 *
 * @name feature
 * @param {Geometry} geometry input geometry
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature} a GeoJSON Feature
 * @example
 * var geometry = {
 *   "type": "Point",
 *   "coordinates": [110, 50]
 * };
 *
 * var feature = turf.feature(geometry);
 *
 * //=feature
 */
function feature(geometry, properties, bbox, id) {
    if (geometry === undefined) throw new Error('geometry is required');
    if (properties && properties.constructor !== Object) throw new Error('properties must be an Object');
    if (bbox && bbox.length !== 4) throw new Error('bbox must be an Array of 4 numbers');
    if (id && ['string', 'number'].indexOf(typeof id) === -1) throw new Error('id must be a number or a string');

    var feat = {type: 'Feature'};
    if (id) feat.id = id;
    if (bbox) feat.bbox = bbox;
    feat.properties = properties || {};
    feat.geometry = geometry;
    return feat;
}

/**
 * Creates a GeoJSON {@link Geometry} from a Geometry string type & coordinates.
 * For GeometryCollection type use `helpers.geometryCollection`
 *
 * @name geometry
 * @param {string} type Geometry Type
 * @param {Array<number>} coordinates Coordinates
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @returns {Geometry} a GeoJSON Geometry
 * @example
 * var type = 'Point';
 * var coordinates = [110, 50];
 *
 * var geometry = turf.geometry(type, coordinates);
 *
 * //=geometry
 */
function geometry(type, coordinates, bbox) {
    // Validation
    if (!type) throw new Error('type is required');
    if (!coordinates) throw new Error('coordinates is required');
    if (!Array.isArray(coordinates)) throw new Error('coordinates must be an Array');
    if (bbox && bbox.length !== 4) throw new Error('bbox must be an Array of 4 numbers');

    var geom;
    switch (type) {
    case 'Point': geom = point(coordinates).geometry; break;
    case 'LineString': geom = lineString(coordinates).geometry; break;
    case 'Polygon': geom = polygon(coordinates).geometry; break;
    case 'MultiPoint': geom = multiPoint(coordinates).geometry; break;
    case 'MultiLineString': geom = multiLineString(coordinates).geometry; break;
    case 'MultiPolygon': geom = multiPolygon(coordinates).geometry; break;
    default: throw new Error(type + ' is invalid');
    }
    if (bbox) geom.bbox = bbox;
    return geom;
}

/**
 * Takes coordinates and properties (optional) and returns a new {@link Point} feature.
 *
 * @name point
 * @param {Array<number>} coordinates longitude, latitude position (each in decimal degrees)
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<Point>} a Point feature
 * @example
 * var point = turf.point([-75.343, 39.984]);
 *
 * //=point
 */
function point(coordinates, properties, bbox, id) {
    if (!coordinates) throw new Error('No coordinates passed');
    if (coordinates.length === undefined) throw new Error('Coordinates must be an array');
    if (coordinates.length < 2) throw new Error('Coordinates must be at least 2 numbers long');
    if (!isNumber(coordinates[0]) || !isNumber(coordinates[1])) throw new Error('Coordinates must contain numbers');

    return feature({
        type: 'Point',
        coordinates: coordinates
    }, properties, bbox, id);
}

/**
 * Takes an array of LinearRings and optionally an {@link Object} with properties and returns a {@link Polygon} feature.
 *
 * @name polygon
 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<Polygon>} a Polygon feature
 * @throws {Error} throw an error if a LinearRing of the polygon has too few positions
 * or if a LinearRing of the Polygon does not have matching Positions at the beginning & end.
 * @example
 * var polygon = turf.polygon([[
 *   [-2.275543, 53.464547],
 *   [-2.275543, 53.489271],
 *   [-2.215118, 53.489271],
 *   [-2.215118, 53.464547],
 *   [-2.275543, 53.464547]
 * ]], { name: 'poly1', population: 400});
 *
 * //=polygon
 */
function polygon(coordinates, properties, bbox, id) {
    if (!coordinates) throw new Error('No coordinates passed');

    for (var i = 0; i < coordinates.length; i++) {
        var ring = coordinates[i];
        if (ring.length < 4) {
            throw new Error('Each LinearRing of a Polygon must have 4 or more Positions.');
        }
        for (var j = 0; j < ring[ring.length - 1].length; j++) {
            // Check if first point of Polygon contains two numbers
            if (i === 0 && j === 0 && !isNumber(ring[0][0]) || !isNumber(ring[0][1])) throw new Error('Coordinates must contain numbers');
            if (ring[ring.length - 1][j] !== ring[0][j]) {
                throw new Error('First and last Position are not equivalent.');
            }
        }
    }

    return feature({
        type: 'Polygon',
        coordinates: coordinates
    }, properties, bbox, id);
}

/**
 * Creates a {@link LineString} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name lineString
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<LineString>} a LineString feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var linestring1 = turf.lineString([
 *   [-21.964416, 64.148203],
 *   [-21.956176, 64.141316],
 *   [-21.93901, 64.135924],
 *   [-21.927337, 64.136673]
 * ]);
 * var linestring2 = turf.lineString([
 *   [-21.929054, 64.127985],
 *   [-21.912918, 64.134726],
 *   [-21.916007, 64.141016],
 *   [-21.930084, 64.14446]
 * ], {name: 'line 1', distance: 145});
 *
 * //=linestring1
 *
 * //=linestring2
 */
function lineString(coordinates, properties, bbox, id) {
    if (!coordinates) throw new Error('No coordinates passed');
    if (coordinates.length < 2) throw new Error('Coordinates must be an array of two or more positions');
    // Check if first point of LineString contains two numbers
    if (!isNumber(coordinates[0][1]) || !isNumber(coordinates[0][1])) throw new Error('Coordinates must contain numbers');

    return feature({
        type: 'LineString',
        coordinates: coordinates
    }, properties, bbox, id);
}

/**
 * Takes one or more {@link Feature|Features} and creates a {@link FeatureCollection}.
 *
 * @name featureCollection
 * @param {Feature[]} features input features
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {FeatureCollection} a FeatureCollection of input features
 * @example
 * var features = [
 *  turf.point([-75.343, 39.984], {name: 'Location A'}),
 *  turf.point([-75.833, 39.284], {name: 'Location B'}),
 *  turf.point([-75.534, 39.123], {name: 'Location C'})
 * ];
 *
 * var collection = turf.featureCollection(features);
 *
 * //=collection
 */
function featureCollection(features, bbox, id) {
    if (!features) throw new Error('No features passed');
    if (!Array.isArray(features)) throw new Error('features must be an Array');
    if (bbox && bbox.length !== 4) throw new Error('bbox must be an Array of 4 numbers');
    if (id && ['string', 'number'].indexOf(typeof id) === -1) throw new Error('id must be a number or a string');

    var fc = {type: 'FeatureCollection'};
    if (id) fc.id = id;
    if (bbox) fc.bbox = bbox;
    fc.features = features;
    return fc;
}

/**
 * Creates a {@link Feature<MultiLineString>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiLineString
 * @param {Array<Array<Array<number>>>} coordinates an array of LineStrings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<MultiLineString>} a MultiLineString feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiLine = turf.multiLineString([[[0,0],[10,10]]]);
 *
 * //=multiLine
 */
function multiLineString(coordinates, properties, bbox, id) {
    if (!coordinates) throw new Error('No coordinates passed');

    return feature({
        type: 'MultiLineString',
        coordinates: coordinates
    }, properties, bbox, id);
}

/**
 * Creates a {@link Feature<MultiPoint>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPoint
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<MultiPoint>} a MultiPoint feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPt = turf.multiPoint([[0,0],[10,10]]);
 *
 * //=multiPt
 */
function multiPoint(coordinates, properties, bbox, id) {
    if (!coordinates) throw new Error('No coordinates passed');

    return feature({
        type: 'MultiPoint',
        coordinates: coordinates
    }, properties, bbox, id);
}

/**
 * Creates a {@link Feature<MultiPolygon>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPolygon
 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygons
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<MultiPolygon>} a multipolygon feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPoly = turf.multiPolygon([[[[0,0],[0,10],[10,10],[10,0],[0,0]]]]);
 *
 * //=multiPoly
 *
 */
function multiPolygon(coordinates, properties, bbox, id) {
    if (!coordinates) throw new Error('No coordinates passed');

    return feature({
        type: 'MultiPolygon',
        coordinates: coordinates
    }, properties, bbox, id);
}

/**
 * Creates a {@link Feature<GeometryCollection>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name geometryCollection
 * @param {Array<Geometry>} geometries an array of GeoJSON Geometries
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Array<number>} [bbox] BBox [west, south, east, north]
 * @param {string|number} [id] Identifier
 * @returns {Feature<GeometryCollection>} a GeoJSON GeometryCollection Feature
 * @example
 * var pt = {
 *     "type": "Point",
 *       "coordinates": [100, 0]
 *     };
 * var line = {
 *     "type": "LineString",
 *     "coordinates": [ [101, 0], [102, 1] ]
 *   };
 * var collection = turf.geometryCollection([pt, line]);
 *
 * //=collection
 */
function geometryCollection(geometries, properties, bbox, id) {
    if (!geometries) throw new Error('geometries is required');
    if (!Array.isArray(geometries)) throw new Error('geometries must be an Array');

    return feature({
        type: 'GeometryCollection',
        geometries: geometries
    }, properties, bbox, id);
}

// https://en.wikipedia.org/wiki/Great-circle_distance#Radius_for_spherical_Earth
var factors = {
    miles: 3960,
    nauticalmiles: 3441.145,
    degrees: 57.2957795,
    radians: 1,
    inches: 250905600,
    yards: 6969600,
    meters: 6373000,
    metres: 6373000,
    centimeters: 6.373e+8,
    centimetres: 6.373e+8,
    kilometers: 6373,
    kilometres: 6373,
    feet: 20908792.65
};

var areaFactors = {
    kilometers: 0.000001,
    kilometres: 0.000001,
    meters: 1,
    metres: 1,
    centimetres: 10000,
    millimeter: 1000000,
    acres: 0.000247105,
    miles: 3.86e-7,
    yards: 1.195990046,
    feet: 10.763910417,
    inches: 1550.003100006
};
/**
 * Round number to precision
 *
 * @param {number} num Number
 * @param {number} [precision=0] Precision
 * @returns {number} rounded number
 * @example
 * turf.round(120.4321)
 * //=120
 *
 * turf.round(120.4321, 2)
 * //=120.43
 */
function round(num, precision) {
    if (num === undefined || num === null || isNaN(num)) throw new Error('num is required');
    if (precision && !(precision >= 0)) throw new Error('precision must be a positive number');
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(num * multiplier) / multiplier;
}

/**
 * Convert a distance measurement (assuming a spherical Earth) from radians to a more friendly unit.
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @name radiansToDistance
 * @param {number} radians in radians across the sphere
 * @param {string} [units=kilometers] can be degrees, radians, miles, or kilometers inches, yards, metres, meters, kilometres, kilometers.
 * @returns {number} distance
 */
function radiansToDistance(radians, units) {
    if (radians === undefined || radians === null) throw new Error('radians is required');

    var factor = factors[units || 'kilometers'];
    if (!factor) throw new Error('units is invalid');
    return radians * factor;
}

/**
 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into radians
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @name distanceToRadians
 * @param {number} distance in real units
 * @param {string} [units=kilometers] can be degrees, radians, miles, or kilometers inches, yards, metres, meters, kilometres, kilometers.
 * @returns {number} radians
 */
function distanceToRadians(distance, units) {
    if (distance === undefined || distance === null) throw new Error('distance is required');

    var factor = factors[units || 'kilometers'];
    if (!factor) throw new Error('units is invalid');
    return distance / factor;
}

/**
 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into degrees
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, centimeters, kilometres, feet
 *
 * @name distanceToDegrees
 * @param {number} distance in real units
 * @param {string} [units=kilometers] can be degrees, radians, miles, or kilometers inches, yards, metres, meters, kilometres, kilometers.
 * @returns {number} degrees
 */
function distanceToDegrees(distance, units) {
    return radians2degrees(distanceToRadians(distance, units));
}

/**
 * Converts any bearing angle from the north line direction (positive clockwise)
 * and returns an angle between 0-360 degrees (positive clockwise), 0 being the north line
 *
 * @name bearingToAngle
 * @param {number} bearing angle, between -180 and +180 degrees
 * @returns {number} angle between 0 and 360 degrees
 */
function bearingToAngle(bearing) {
    if (bearing === null || bearing === undefined) throw new Error('bearing is required');

    var angle = bearing % 360;
    if (angle < 0) angle += 360;
    return angle;
}

/**
 * Converts an angle in radians to degrees
 *
 * @name radians2degrees
 * @param {number} radians angle in radians
 * @returns {number} degrees between 0 and 360 degrees
 */
function radians2degrees(radians) {
    if (radians === null || radians === undefined) throw new Error('radians is required');

    var degrees = radians % (2 * Math.PI);
    return degrees * 180 / Math.PI;
}

/**
 * Converts an angle in degrees to radians
 *
 * @name degrees2radians
 * @param {number} degrees angle between 0 and 360 degrees
 * @returns {number} angle in radians
 */
function degrees2radians(degrees) {
    if (degrees === null || degrees === undefined) throw new Error('degrees is required');

    var radians = degrees % 360;
    return radians * Math.PI / 180;
}


/**
 * Converts a distance to the requested unit.
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @param {number} distance to be converted
 * @param {string} originalUnit of the distance
 * @param {string} [finalUnit=kilometers] returned unit
 * @returns {number} the converted distance
 */
function convertDistance(distance, originalUnit, finalUnit) {
    if (distance === null || distance === undefined) throw new Error('distance is required');
    if (!(distance >= 0)) throw new Error('distance must be a positive number');

    var convertedDistance = radiansToDistance(distanceToRadians(distance, originalUnit), finalUnit || 'kilometers');
    return convertedDistance;
}

/**
 * Converts a area to the requested unit.
 * Valid units: kilometers, kilometres, meters, metres, centimetres, millimeter, acre, mile, yard, foot, inch
 * @param {number} area to be converted
 * @param {string} [originalUnit=meters] of the distance
 * @param {string} [finalUnit=kilometers] returned unit
 * @returns {number} the converted distance
 */
function convertArea(area, originalUnit, finalUnit) {
    if (area === null || area === undefined) throw new Error('area is required');
    if (!(area >= 0)) throw new Error('area must be a positive number');

    var startFactor = areaFactors[originalUnit || 'meters'];
    if (!startFactor) throw new Error('invalid original units');

    var finalFactor = areaFactors[finalUnit || 'kilometers'];
    if (!finalFactor) throw new Error('invalid final units');

    return (area / startFactor) * finalFactor;
}

/**
 * isNumber
 *
 * @param {*} num Number to validate
 * @returns {boolean} true/false
 * @example
 * turf.isNumber(123)
 * //=true
 * turf.isNumber('foo')
 * //=false
 */
function isNumber(num) {
    return !isNaN(num) && num !== null && !Array.isArray(num);
}

module.exports = {
    feature: feature,
    geometry: geometry,
    featureCollection: featureCollection,
    geometryCollection: geometryCollection,
    point: point,
    multiPoint: multiPoint,
    lineString: lineString,
    multiLineString: multiLineString,
    polygon: polygon,
    multiPolygon: multiPolygon,
    radiansToDistance: radiansToDistance,
    distanceToRadians: distanceToRadians,
    distanceToDegrees: distanceToDegrees,
    radians2degrees: radians2degrees,
    degrees2radians: degrees2radians,
    bearingToAngle: bearingToAngle,
    convertDistance: convertDistance,
    convertArea: convertArea,
    round: round,
    isNumber: isNumber
};


/***/ }),

/***/ "./node_modules/@turf/meta/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["coordEach"] = coordEach;
/* harmony export (immutable) */ __webpack_exports__["coordReduce"] = coordReduce;
/* harmony export (immutable) */ __webpack_exports__["propEach"] = propEach;
/* harmony export (immutable) */ __webpack_exports__["propReduce"] = propReduce;
/* harmony export (immutable) */ __webpack_exports__["featureEach"] = featureEach;
/* harmony export (immutable) */ __webpack_exports__["featureReduce"] = featureReduce;
/* harmony export (immutable) */ __webpack_exports__["coordAll"] = coordAll;
/* harmony export (immutable) */ __webpack_exports__["geomEach"] = geomEach;
/* harmony export (immutable) */ __webpack_exports__["geomReduce"] = geomReduce;
/* harmony export (immutable) */ __webpack_exports__["flattenEach"] = flattenEach;
/* harmony export (immutable) */ __webpack_exports__["flattenReduce"] = flattenReduce;
/* harmony export (immutable) */ __webpack_exports__["segmentEach"] = segmentEach;
/* harmony export (immutable) */ __webpack_exports__["segmentReduce"] = segmentReduce;
/* harmony export (immutable) */ __webpack_exports__["feature"] = feature;
/* harmony export (immutable) */ __webpack_exports__["lineString"] = lineString;
/* harmony export (immutable) */ __webpack_exports__["lineEach"] = lineEach;
/* harmony export (immutable) */ __webpack_exports__["lineReduce"] = lineReduce;
/**
 * GeoJSON BBox
 *
 * @private
 * @typedef {[number, number, number, number]} BBox
 */

/**
 * GeoJSON Id
 *
 * @private
 * @typedef {(number|string)} Id
 */

/**
 * GeoJSON FeatureCollection
 *
 * @private
 * @typedef {Object} FeatureCollection
 * @property {string} type
 * @property {?Id} id
 * @property {?BBox} bbox
 * @property {Feature[]} features
 */

/**
 * GeoJSON Feature
 *
 * @private
 * @typedef {Object} Feature
 * @property {string} type
 * @property {?Id} id
 * @property {?BBox} bbox
 * @property {*} properties
 * @property {Geometry} geometry
 */

/**
 * GeoJSON Geometry
 *
 * @private
 * @typedef {Object} Geometry
 * @property {string} type
 * @property {any[]} coordinates
 */

/**
 * Callback for coordEach
 *
 * @callback coordEachCallback
 * @param {Array<number>} currentCoord The current coordinate being processed.
 * @param {number} coordIndex The current index of the coordinate being processed.
 * Starts at index 0.
 * @param {number} featureIndex The current index of the feature being processed.
 * @param {number} featureSubIndex The current subIndex of the feature being processed.
 */

/**
 * Iterate over coordinates in any GeoJSON object, similar to Array.forEach()
 *
 * @name coordEach
 * @param {(FeatureCollection|Feature|Geometry)} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentCoord, coordIndex, featureIndex, featureSubIndex)
 * @param {boolean} [excludeWrapCoord=false] whether or not to include the final coordinate of LinearRings that wraps the ring in its iteration.
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {"foo": "bar"}),
 *   turf.point([36, 53], {"hello": "world"})
 * ]);
 *
 * turf.coordEach(features, function (currentCoord, coordIndex, featureIndex, featureSubIndex) {
 *   //=currentCoord
 *   //=coordIndex
 *   //=featureIndex
 *   //=featureSubIndex
 * });
 */
function coordEach(geojson, callback, excludeWrapCoord) {
    // Handles null Geometry -- Skips this GeoJSON
    if (geojson === null) return;
    var featureIndex, geometryIndex, j, k, l, geometry, stopG, coords,
        geometryMaybeCollection,
        wrapShrink = 0,
        coordIndex = 0,
        isGeometryCollection,
        type = geojson.type,
        isFeatureCollection = type === 'FeatureCollection',
        isFeature = type === 'Feature',
        stop = isFeatureCollection ? geojson.features.length : 1;

    // This logic may look a little weird. The reason why it is that way
    // is because it's trying to be fast. GeoJSON supports multiple kinds
    // of objects at its root: FeatureCollection, Features, Geometries.
    // This function has the responsibility of handling all of them, and that
    // means that some of the `for` loops you see below actually just don't apply
    // to certain inputs. For instance, if you give this just a
    // Point geometry, then both loops are short-circuited and all we do
    // is gradually rename the input until it's called 'geometry'.
    //
    // This also aims to allocate as few resources as possible: just a
    // few numbers and booleans, rather than any temporary arrays as would
    // be required with the normalization approach.
    for (featureIndex = 0; featureIndex < stop; featureIndex++) {
        geometryMaybeCollection = (isFeatureCollection ? geojson.features[featureIndex].geometry :
            (isFeature ? geojson.geometry : geojson));
        isGeometryCollection = (geometryMaybeCollection) ? geometryMaybeCollection.type === 'GeometryCollection' : false;
        stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;

        for (geometryIndex = 0; geometryIndex < stopG; geometryIndex++) {
            var featureSubIndex = 0;
            geometry = isGeometryCollection ?
                geometryMaybeCollection.geometries[geometryIndex] : geometryMaybeCollection;

            // Handles null Geometry -- Skips this geometry
            if (geometry === null) continue;
            coords = geometry.coordinates;
            var geomType = geometry.type;

            wrapShrink = (excludeWrapCoord && (geomType === 'Polygon' || geomType === 'MultiPolygon')) ? 1 : 0;

            switch (geomType) {
            case null:
                break;
            case 'Point':
                callback(coords, coordIndex, featureIndex, featureSubIndex);
                coordIndex++;
                featureSubIndex++;
                break;
            case 'LineString':
            case 'MultiPoint':
                for (j = 0; j < coords.length; j++) {
                    callback(coords[j], coordIndex, featureIndex, featureSubIndex);
                    coordIndex++;
                    if (geomType === 'MultiPoint') featureSubIndex++;
                }
                if (geomType === 'LineString') featureSubIndex++;
                break;
            case 'Polygon':
            case 'MultiLineString':
                for (j = 0; j < coords.length; j++) {
                    for (k = 0; k < coords[j].length - wrapShrink; k++) {
                        callback(coords[j][k], coordIndex, featureIndex, featureSubIndex);
                        coordIndex++;
                    }
                    if (geomType === 'MultiLineString') featureSubIndex++;
                }
                if (geomType === 'Polygon') featureSubIndex++;
                break;
            case 'MultiPolygon':
                for (j = 0; j < coords.length; j++) {
                    for (k = 0; k < coords[j].length; k++)
                        for (l = 0; l < coords[j][k].length - wrapShrink; l++) {
                            callback(coords[j][k][l], coordIndex, featureIndex, featureSubIndex);
                            coordIndex++;
                        }
                    featureSubIndex++;
                }
                break;
            case 'GeometryCollection':
                for (j = 0; j < geometry.geometries.length; j++)
                    coordEach(geometry.geometries[j], callback, excludeWrapCoord);
                break;
            default:
                throw new Error('Unknown Geometry Type');
            }
        }
    }
}

/**
 * Callback for coordReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback coordReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Array<number>} currentCoord The current coordinate being processed.
 * @param {number} coordIndex The current index of the coordinate being processed.
 * Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 * @param {number} featureIndex The current index of the feature being processed.
 * @param {number} featureSubIndex The current subIndex of the feature being processed.
 */

/**
 * Reduce coordinates in any GeoJSON object, similar to Array.reduce()
 *
 * @name coordReduce
 * @param {FeatureCollection|Geometry|Feature} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentCoord, coordIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @param {boolean} [excludeWrapCoord=false] whether or not to include the final coordinate of LinearRings that wraps the ring in its iteration.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {"foo": "bar"}),
 *   turf.point([36, 53], {"hello": "world"})
 * ]);
 *
 * turf.coordReduce(features, function (previousValue, currentCoord, coordIndex, featureIndex, featureSubIndex) {
 *   //=previousValue
 *   //=currentCoord
 *   //=coordIndex
 *   //=featureIndex
 *   //=featureSubIndex
 *   return currentCoord;
 * });
 */
function coordReduce(geojson, callback, initialValue, excludeWrapCoord) {
    var previousValue = initialValue;
    coordEach(geojson, function (currentCoord, coordIndex, featureIndex, featureSubIndex) {
        if (coordIndex === 0 && initialValue === undefined) previousValue = currentCoord;
        else previousValue = callback(previousValue, currentCoord, coordIndex, featureIndex, featureSubIndex);
    }, excludeWrapCoord);
    return previousValue;
}

/**
 * Callback for propEach
 *
 * @callback propEachCallback
 * @param {Object} currentProperties The current properties being processed.
 * @param {number} featureIndex The index of the current element being processed in the
 * array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 */

/**
 * Iterate over properties in any GeoJSON object, similar to Array.forEach()
 *
 * @name propEach
 * @param {(FeatureCollection|Feature)} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentProperties, featureIndex)
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.propEach(features, function (currentProperties, featureIndex) {
 *   //=currentProperties
 *   //=featureIndex
 * });
 */
function propEach(geojson, callback) {
    var i;
    switch (geojson.type) {
    case 'FeatureCollection':
        for (i = 0; i < geojson.features.length; i++) {
            callback(geojson.features[i].properties, i);
        }
        break;
    case 'Feature':
        callback(geojson.properties, 0);
        break;
    }
}


/**
 * Callback for propReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback propReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {*} currentProperties The current properties being processed.
 * @param {number} featureIndex The index of the current element being processed in the
 * array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 */

/**
 * Reduce properties in any GeoJSON object into a single value,
 * similar to how Array.reduce works. However, in this case we lazily run
 * the reduction, so an array of all properties is unnecessary.
 *
 * @name propReduce
 * @param {(FeatureCollection|Feature)} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentProperties, featureIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.propReduce(features, function (previousValue, currentProperties, featureIndex) {
 *   //=previousValue
 *   //=currentProperties
 *   //=featureIndex
 *   return currentProperties
 * });
 */
function propReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    propEach(geojson, function (currentProperties, featureIndex) {
        if (featureIndex === 0 && initialValue === undefined) previousValue = currentProperties;
        else previousValue = callback(previousValue, currentProperties, featureIndex);
    });
    return previousValue;
}

/**
 * Callback for featureEach
 *
 * @callback featureEachCallback
 * @param {Feature<any>} currentFeature The current feature being processed.
 * @param {number} featureIndex The index of the current element being processed in the
 * array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 */

/**
 * Iterate over features in any GeoJSON object, similar to
 * Array.forEach.
 *
 * @name featureEach
 * @param {(FeatureCollection|Feature|Geometry)} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentFeature, featureIndex)
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {foo: 'bar'}),
 *   turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.featureEach(features, function (currentFeature, featureIndex) {
 *   //=currentFeature
 *   //=featureIndex
 * });
 */
function featureEach(geojson, callback) {
    if (geojson.type === 'Feature') {
        callback(geojson, 0);
    } else if (geojson.type === 'FeatureCollection') {
        for (var i = 0; i < geojson.features.length; i++) {
            callback(geojson.features[i], i);
        }
    }
}

/**
 * Callback for featureReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback featureReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature} currentFeature The current Feature being processed.
 * @param {number} featureIndex The index of the current element being processed in the
 * array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 */

/**
 * Reduce features in any GeoJSON object, similar to Array.reduce().
 *
 * @name featureReduce
 * @param {(FeatureCollection|Feature|Geometry)} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentFeature, featureIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {"foo": "bar"}),
 *   turf.point([36, 53], {"hello": "world"})
 * ]);
 *
 * turf.featureReduce(features, function (previousValue, currentFeature, featureIndex) {
 *   //=previousValue
 *   //=currentFeature
 *   //=featureIndex
 *   return currentFeature
 * });
 */
function featureReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    featureEach(geojson, function (currentFeature, featureIndex) {
        if (featureIndex === 0 && initialValue === undefined) previousValue = currentFeature;
        else previousValue = callback(previousValue, currentFeature, featureIndex);
    });
    return previousValue;
}

/**
 * Get all coordinates from any GeoJSON object.
 *
 * @name coordAll
 * @param {(FeatureCollection|Feature|Geometry)} geojson any GeoJSON object
 * @returns {Array<Array<number>>} coordinate position array
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {foo: 'bar'}),
 *   turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * var coords = turf.coordAll(features);
 * //= [[26, 37], [36, 53]]
 */
function coordAll(geojson) {
    var coords = [];
    coordEach(geojson, function (coord) {
        coords.push(coord);
    });
    return coords;
}

/**
 * Callback for geomEach
 *
 * @callback geomEachCallback
 * @param {Geometry} currentGeometry The current geometry being processed.
 * @param {number} currentIndex The index of the current element being processed in the
 * array. Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 * @param {number} currentProperties The current feature properties being processed.
 */

/**
 * Iterate over each geometry in any GeoJSON object, similar to Array.forEach()
 *
 * @name geomEach
 * @param {(FeatureCollection|Feature|Geometry)} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentGeometry, featureIndex, currentProperties)
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.geomEach(features, function (currentGeometry, featureIndex, currentProperties) {
 *   //=currentGeometry
 *   //=featureIndex
 *   //=currentProperties
 * });
 */
function geomEach(geojson, callback) {
    var i, j, g, geometry, stopG,
        geometryMaybeCollection,
        isGeometryCollection,
        geometryProperties,
        featureIndex = 0,
        isFeatureCollection = geojson.type === 'FeatureCollection',
        isFeature = geojson.type === 'Feature',
        stop = isFeatureCollection ? geojson.features.length : 1;

    // This logic may look a little weird. The reason why it is that way
    // is because it's trying to be fast. GeoJSON supports multiple kinds
    // of objects at its root: FeatureCollection, Features, Geometries.
    // This function has the responsibility of handling all of them, and that
    // means that some of the `for` loops you see below actually just don't apply
    // to certain inputs. For instance, if you give this just a
    // Point geometry, then both loops are short-circuited and all we do
    // is gradually rename the input until it's called 'geometry'.
    //
    // This also aims to allocate as few resources as possible: just a
    // few numbers and booleans, rather than any temporary arrays as would
    // be required with the normalization approach.
    for (i = 0; i < stop; i++) {

        geometryMaybeCollection = (isFeatureCollection ? geojson.features[i].geometry :
            (isFeature ? geojson.geometry : geojson));
        geometryProperties = (isFeatureCollection ? geojson.features[i].properties :
            (isFeature ? geojson.properties : {}));
        isGeometryCollection = (geometryMaybeCollection) ? geometryMaybeCollection.type === 'GeometryCollection' : false;
        stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;

        for (g = 0; g < stopG; g++) {
            geometry = isGeometryCollection ?
                geometryMaybeCollection.geometries[g] : geometryMaybeCollection;

            // Handle null Geometry
            if (geometry === null) {
                callback(null, featureIndex, geometryProperties);
                continue;
            }
            switch (geometry.type) {
            case 'Point':
            case 'LineString':
            case 'MultiPoint':
            case 'Polygon':
            case 'MultiLineString':
            case 'MultiPolygon': {
                callback(geometry, featureIndex, geometryProperties);
                break;
            }
            case 'GeometryCollection': {
                for (j = 0; j < geometry.geometries.length; j++) {
                    callback(geometry.geometries[j], featureIndex, geometryProperties);
                }
                break;
            }
            default:
                throw new Error('Unknown Geometry Type');
            }
        }
        // Only increase `featureIndex` per each feature
        featureIndex++;
    }
}

/**
 * Callback for geomReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback geomReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Geometry} currentGeometry The current Feature being processed.
 * @param {number} currentIndex The index of the current element being processed in the
 * array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 * @param {Object} currentProperties The current feature properties being processed.
 */

/**
 * Reduce geometry in any GeoJSON object, similar to Array.reduce().
 *
 * @name geomReduce
 * @param {(FeatureCollection|Feature|Geometry)} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentGeometry, featureIndex, currentProperties)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.geomReduce(features, function (previousValue, currentGeometry, featureIndex, currentProperties) {
 *   //=previousValue
 *   //=currentGeometry
 *   //=featureIndex
 *   //=currentProperties
 *   return currentGeometry
 * });
 */
function geomReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    geomEach(geojson, function (currentGeometry, currentIndex, currentProperties) {
        if (currentIndex === 0 && initialValue === undefined) previousValue = currentGeometry;
        else previousValue = callback(previousValue, currentGeometry, currentIndex, currentProperties);
    });
    return previousValue;
}

/**
 * Callback for flattenEach
 *
 * @callback flattenEachCallback
 * @param {Feature} currentFeature The current flattened feature being processed.
 * @param {number} featureIndex The index of the current element being processed in the
 * array. Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 * @param {number} featureSubIndex The subindex of the current element being processed in the
 * array. Starts at index 0 and increases if the flattened feature was a multi-geometry.
 */

/**
 * Iterate over flattened features in any GeoJSON object, similar to
 * Array.forEach.
 *
 * @name flattenEach
 * @param {(FeatureCollection|Feature|Geometry)} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentFeature, featureIndex, featureSubIndex)
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.multiPoint([[40, 30], [36, 53]], {hello: 'world'})
 * ]);
 *
 * turf.flattenEach(features, function (currentFeature, featureIndex, featureSubIndex) {
 *   //=currentFeature
 *   //=featureIndex
 *   //=featureSubIndex
 * });
 */
function flattenEach(geojson, callback) {
    geomEach(geojson, function (geometry, featureIndex, properties) {
        // Callback for single geometry
        var type = (geometry === null) ? null : geometry.type;
        switch (type) {
        case null:
        case 'Point':
        case 'LineString':
        case 'Polygon':
            callback(feature(geometry, properties), featureIndex, 0);
            return;
        }

        var geomType;

        // Callback for multi-geometry
        switch (type) {
        case 'MultiPoint':
            geomType = 'Point';
            break;
        case 'MultiLineString':
            geomType = 'LineString';
            break;
        case 'MultiPolygon':
            geomType = 'Polygon';
            break;
        }

        geometry.coordinates.forEach(function (coordinate, featureSubIndex) {
            var geom = {
                type: geomType,
                coordinates: coordinate
            };
            callback(feature(geom, properties), featureIndex, featureSubIndex);
        });

    });
}

/**
 * Callback for flattenReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback flattenReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature} currentFeature The current Feature being processed.
 * @param {number} featureIndex The index of the current element being processed in the
 * array.Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 * @param {number} featureSubIndex The subindex of the current element being processed in the
 * array. Starts at index 0 and increases if the flattened feature was a multi-geometry.
 */

/**
 * Reduce flattened features in any GeoJSON object, similar to Array.reduce().
 *
 * @name flattenReduce
 * @param {(FeatureCollection|Feature|Geometry)} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentFeature, featureIndex, featureSubIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.multiPoint([[40, 30], [36, 53]], {hello: 'world'})
 * ]);
 *
 * turf.flattenReduce(features, function (previousValue, currentFeature, featureIndex, featureSubIndex) {
 *   //=previousValue
 *   //=currentFeature
 *   //=featureIndex
 *   //=featureSubIndex
 *   return currentFeature
 * });
 */
function flattenReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    flattenEach(geojson, function (currentFeature, featureIndex, featureSubIndex) {
        if (featureIndex === 0 && featureSubIndex === 0 && initialValue === undefined) previousValue = currentFeature;
        else previousValue = callback(previousValue, currentFeature, featureIndex, featureSubIndex);
    });
    return previousValue;
}

/**
 * Callback for segmentEach
 *
 * @callback segmentEachCallback
 * @param {Feature<LineString>} currentSegment The current segment being processed.
 * @param {number} featureIndex The featureIndex currently being processed, starts at index 0.
 * @param {number} featureSubIndex The featureSubIndex currently being processed, starts at index 0.
 * @param {number} segmentIndex The segmentIndex currently being processed, starts at index 0.
 * @returns {void}
 */

/**
 * Iterate over 2-vertex line segment in any GeoJSON object, similar to Array.forEach()
 * (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
 *
 * @param {(FeatureCollection|Feature|Geometry)} geojson any GeoJSON
 * @param {Function} callback a method that takes (currentSegment, featureIndex, featureSubIndex)
 * @returns {void}
 * @example
 * var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);
 *
 * // Iterate over GeoJSON by 2-vertex segments
 * turf.segmentEach(polygon, function (currentSegment, featureIndex, featureSubIndex, segmentIndex) {
 *   //= currentSegment
 *   //= featureIndex
 *   //= featureSubIndex
 *   //= segmentIndex
 * });
 *
 * // Calculate the total number of segments
 * var total = 0;
 * turf.segmentEach(polygon, function () {
 *     total++;
 * });
 */
function segmentEach(geojson, callback) {
    flattenEach(geojson, function (feature, featureIndex, featureSubIndex) {
        var segmentIndex = 0;

        // Exclude null Geometries
        if (!feature.geometry) return;
        // (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
        var type = feature.geometry.type;
        if (type === 'Point' || type === 'MultiPoint') return;

        // Generate 2-vertex line segments
        coordReduce(feature, function (previousCoords, currentCoord) {
            var currentSegment = lineString([previousCoords, currentCoord], feature.properties);
            callback(currentSegment, featureIndex, featureSubIndex, segmentIndex);
            segmentIndex++;
            return currentCoord;
        });
    });
}

/**
 * Callback for segmentReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback segmentReduceCallback
 * @param {*} [previousValue] The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature<LineString>} [currentSegment] The current segment being processed.
 * @param {number} featureIndex The featureIndex currently being processed, starts at index 0.
 * @param {number} featureSubIndex The featureSubIndex currently being processed, starts at index 0.
 * @param {number} segmentIndex The segmentIndex currently being processed, starts at index 0.
 */

/**
 * Reduce 2-vertex line segment in any GeoJSON object, similar to Array.reduce()
 * (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
 *
 * @param {(FeatureCollection|Feature|Geometry)} geojson any GeoJSON
 * @param {Function} callback a method that takes (previousValue, currentSegment, currentIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {void}
 * @example
 * var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);
 *
 * // Iterate over GeoJSON by 2-vertex segments
 * turf.segmentReduce(polygon, function (previousSegment, currentSegment, featureIndex, featureSubIndex, segmentIndex) {
 *   //= previousSegment
 *   //= currentSegment
 *   //= featureIndex
 *   //= featureSubIndex
 *   //= segmentInex
 *   return currentSegment
 * });
 *
 * // Calculate the total number of segments
 * var initialValue = 0
 * var total = turf.segmentReduce(polygon, function (previousValue) {
 *     previousValue++;
 *     return previousValue;
 * }, initialValue);
 */
function segmentReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    var started = false;
    segmentEach(geojson, function (currentSegment, featureIndex, featureSubIndex, segmentIndex) {
        if (started === false && initialValue === undefined) previousValue = currentSegment;
        else previousValue = callback(previousValue, currentSegment, featureIndex, featureSubIndex, segmentIndex);
        started = true;
    });
    return previousValue;
}

/**
 * Create Feature
 *
 * @private
 * @param {Geometry} geometry GeoJSON Geometry
 * @param {Object} properties Properties
 * @returns {Feature} GeoJSON Feature
 */
function feature(geometry, properties) {
    if (geometry === undefined) throw new Error('No geometry passed');

    return {
        type: 'Feature',
        properties: properties || {},
        geometry: geometry
    };
}

/**
 * Create LineString
 *
 * @private
 * @param {Array<Array<number>>} coordinates Line Coordinates
 * @param {Object} properties Properties
 * @returns {Feature<LineString>} GeoJSON LineString Feature
 */
function lineString(coordinates, properties) {
    if (!coordinates) throw new Error('No coordinates passed');
    if (coordinates.length < 2) throw new Error('Coordinates must be an array of two or more positions');

    return {
        type: 'Feature',
        properties: properties || {},
        geometry: {
            type: 'LineString',
            coordinates: coordinates
        }
    };
}


/**
 * Callback for lineEach
 *
 * @callback lineEachCallback
 * @param {Feature<LineString>} currentLine The current LineString|LinearRing being processed.
 * @param {number} lineIndex The index of the current element being processed in the array, starts at index 0.
 * @param {number} lineSubIndex The sub-index of the current line being processed at index 0
 */

/**
 * Iterate over line or ring coordinates in LineString, Polygon, MultiLineString, MultiPolygon Features or Geometries,
 * similar to Array.forEach.
 *
 * @name lineEach
 * @param {Geometry|Feature<LineString|Polygon|MultiLineString|MultiPolygon>} geojson object
 * @param {Function} callback a method that takes (currentLine, lineIndex, lineSubIndex)
 * @example
 * var mtLn = turf.multiLineString([
 *   turf.lineString([[26, 37], [35, 45]]),
 *   turf.lineString([[36, 53], [38, 50], [41, 55]])
 * ]);
 *
 * turf.lineEach(mtLn, function (currentLine, lineIndex) {
 *   //=currentLine
 *   //=lineIndex
 * });
 */
function lineEach(geojson, callback) {
    // validation
    if (!geojson) throw new Error('geojson is required');
    var type = geojson.geometry ? geojson.geometry.type : geojson.type;
    if (!type) throw new Error('invalid geojson');
    if (type === 'FeatureCollection') throw new Error('FeatureCollection is not supported');
    if (type === 'GeometryCollection') throw new Error('GeometryCollection is not supported');
    var coordinates = geojson.geometry ? geojson.geometry.coordinates : geojson.coordinates;
    if (!coordinates) throw new Error('geojson must contain coordinates');

    switch (type) {
    case 'LineString':
        callback(coordinates, 0, 0);
        return;
    case 'Polygon':
    case 'MultiLineString':
        var subIndex = 0;
        for (var line = 0; line < coordinates.length; line++) {
            if (type === 'MultiLineString') subIndex = line;
            callback(coordinates[line], line, subIndex);
        }
        return;
    case 'MultiPolygon':
        for (var multi = 0; multi < coordinates.length; multi++) {
            for (var ring = 0; ring < coordinates[multi].length; ring++) {
                callback(coordinates[multi][ring], ring, multi);
            }
        }
        return;
    default:
        throw new Error(type + ' geometry not supported');
    }
}

/**
 * Callback for lineReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback lineReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature<LineString>} currentLine The current LineString|LinearRing being processed.
 * @param {number} lineIndex The index of the current element being processed in the
 * array. Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 * @param {number} lineSubIndex The sub-index of the current line being processed at index 0
 */

/**
 * Reduce features in any GeoJSON object, similar to Array.reduce().
 *
 * @name lineReduce
 * @param {Geometry|Feature<LineString|Polygon|MultiLineString|MultiPolygon>} geojson object
 * @param {Function} callback a method that takes (previousValue, currentFeature, featureIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var mtp = turf.multiPolygon([
 *   turf.polygon([[[12,48],[2,41],[24,38],[12,48]], [[9,44],[13,41],[13,45],[9,44]]]),
 *   turf.polygon([[[5, 5], [0, 0], [2, 2], [4, 4], [5, 5]]])
 * ]);
 *
 * turf.lineReduce(mtp, function (previousValue, currentLine, lineIndex, lineSubIndex) {
 *   //=previousValue
 *   //=currentLine
 *   //=lineIndex
 *   //=lineSubIndex
 *   return currentLine
 * }, 2);
 */
function lineReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    lineEach(geojson, function (currentLine, lineIndex, lineSubIndex) {
        if (lineIndex === 0 && initialValue === undefined) previousValue = currentLine;
        else previousValue = callback(previousValue, currentLine, lineIndex, lineSubIndex);
    });
    return previousValue;
}


/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "./node_modules/happypack/loader.js?id=css-81af377f!./node_modules/leaflet/dist/leaflet.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "/* required styles */\r\n\r\n.leaflet-pane,\r\n.leaflet-tile,\r\n.leaflet-marker-icon,\r\n.leaflet-marker-shadow,\r\n.leaflet-tile-container,\r\n.leaflet-pane > svg,\r\n.leaflet-pane > canvas,\r\n.leaflet-zoom-box,\r\n.leaflet-image-layer,\r\n.leaflet-layer {\r\n\tposition: absolute;\r\n\tleft: 0;\r\n\ttop: 0;\r\n\t}\r\n.leaflet-container {\r\n\toverflow: hidden;\r\n\t}\r\n.leaflet-tile,\r\n.leaflet-marker-icon,\r\n.leaflet-marker-shadow {\r\n\t-webkit-user-select: none;\r\n\t   -moz-user-select: none;\r\n\t        user-select: none;\r\n\t  -webkit-user-drag: none;\r\n\t}\r\n/* Safari renders non-retina tile on retina better with this, but Chrome is worse */\r\n.leaflet-safari .leaflet-tile {\r\n\timage-rendering: -webkit-optimize-contrast;\r\n\t}\r\n/* hack that prevents hw layers \"stretching\" when loading new tiles */\r\n.leaflet-safari .leaflet-tile-container {\r\n\twidth: 1600px;\r\n\theight: 1600px;\r\n\t-webkit-transform-origin: 0 0;\r\n\t}\r\n.leaflet-marker-icon,\r\n.leaflet-marker-shadow {\r\n\tdisplay: block;\r\n\t}\r\n/* .leaflet-container svg: reset svg max-width decleration shipped in Joomla! (joomla.org) 3.x */\r\n/* .leaflet-container img: map is broken in FF if you have max-width: 100% on tiles */\r\n.leaflet-container .leaflet-overlay-pane svg,\r\n.leaflet-container .leaflet-marker-pane img,\r\n.leaflet-container .leaflet-shadow-pane img,\r\n.leaflet-container .leaflet-tile-pane img,\r\n.leaflet-container img.leaflet-image-layer {\r\n\tmax-width: none !important;\r\n\t}\r\n\r\n.leaflet-container.leaflet-touch-zoom {\r\n\t-ms-touch-action: pan-x pan-y;\r\n\ttouch-action: pan-x pan-y;\r\n\t}\r\n.leaflet-container.leaflet-touch-drag {\r\n\t-ms-touch-action: pinch-zoom;\r\n\t}\r\n.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom {\r\n\t-ms-touch-action: none;\r\n\ttouch-action: none;\r\n}\r\n.leaflet-container {\r\n\t-webkit-tap-highlight-color: transparent;\r\n}\r\n.leaflet-container a {\r\n\t-webkit-tap-highlight-color: rgba(51, 181, 229, 0.4);\r\n}\r\n.leaflet-tile {\r\n\tfilter: inherit;\r\n\tvisibility: hidden;\r\n\t}\r\n.leaflet-tile-loaded {\r\n\tvisibility: inherit;\r\n\t}\r\n.leaflet-zoom-box {\r\n\twidth: 0;\r\n\theight: 0;\r\n\t-moz-box-sizing: border-box;\r\n\t     box-sizing: border-box;\r\n\tz-index: 800;\r\n\t}\r\n/* workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=888319 */\r\n.leaflet-overlay-pane svg {\r\n\t-moz-user-select: none;\r\n\t}\r\n\r\n.leaflet-pane         { z-index: 400; }\r\n\r\n.leaflet-tile-pane    { z-index: 200; }\r\n.leaflet-overlay-pane { z-index: 400; }\r\n.leaflet-shadow-pane  { z-index: 500; }\r\n.leaflet-marker-pane  { z-index: 600; }\r\n.leaflet-tooltip-pane   { z-index: 650; }\r\n.leaflet-popup-pane   { z-index: 700; }\r\n\r\n.leaflet-map-pane canvas { z-index: 100; }\r\n.leaflet-map-pane svg    { z-index: 200; }\r\n\r\n.leaflet-vml-shape {\r\n\twidth: 1px;\r\n\theight: 1px;\r\n\t}\r\n.lvml {\r\n\tbehavior: url(#default#VML);\r\n\tdisplay: inline-block;\r\n\tposition: absolute;\r\n\t}\r\n\r\n\r\n/* control positioning */\r\n\r\n.leaflet-control {\r\n\tposition: relative;\r\n\tz-index: 800;\r\n\tpointer-events: visiblePainted; /* IE 9-10 doesn't have auto */\r\n\tpointer-events: auto;\r\n\t}\r\n.leaflet-top,\r\n.leaflet-bottom {\r\n\tposition: absolute;\r\n\tz-index: 1000;\r\n\tpointer-events: none;\r\n\t}\r\n.leaflet-top {\r\n\ttop: 0;\r\n\t}\r\n.leaflet-right {\r\n\tright: 0;\r\n\t}\r\n.leaflet-bottom {\r\n\tbottom: 0;\r\n\t}\r\n.leaflet-left {\r\n\tleft: 0;\r\n\t}\r\n.leaflet-control {\r\n\tfloat: left;\r\n\tclear: both;\r\n\t}\r\n.leaflet-right .leaflet-control {\r\n\tfloat: right;\r\n\t}\r\n.leaflet-top .leaflet-control {\r\n\tmargin-top: 10px;\r\n\t}\r\n.leaflet-bottom .leaflet-control {\r\n\tmargin-bottom: 10px;\r\n\t}\r\n.leaflet-left .leaflet-control {\r\n\tmargin-left: 10px;\r\n\t}\r\n.leaflet-right .leaflet-control {\r\n\tmargin-right: 10px;\r\n\t}\r\n\r\n\r\n/* zoom and fade animations */\r\n\r\n.leaflet-fade-anim .leaflet-tile {\r\n\twill-change: opacity;\r\n\t}\r\n.leaflet-fade-anim .leaflet-popup {\r\n\topacity: 0;\r\n\t-webkit-transition: opacity 0.2s linear;\r\n\t   -moz-transition: opacity 0.2s linear;\r\n\t     -o-transition: opacity 0.2s linear;\r\n\t        transition: opacity 0.2s linear;\r\n\t}\r\n.leaflet-fade-anim .leaflet-map-pane .leaflet-popup {\r\n\topacity: 1;\r\n\t}\r\n.leaflet-zoom-animated {\r\n\t-webkit-transform-origin: 0 0;\r\n\t    -ms-transform-origin: 0 0;\r\n\t        transform-origin: 0 0;\r\n\t}\r\n.leaflet-zoom-anim .leaflet-zoom-animated {\r\n\twill-change: transform;\r\n\t}\r\n.leaflet-zoom-anim .leaflet-zoom-animated {\r\n\t-webkit-transition: -webkit-transform 0.25s cubic-bezier(0,0,0.25,1);\r\n\t   -moz-transition:    -moz-transform 0.25s cubic-bezier(0,0,0.25,1);\r\n\t     -o-transition:      -o-transform 0.25s cubic-bezier(0,0,0.25,1);\r\n\t        transition:         transform 0.25s cubic-bezier(0,0,0.25,1);\r\n\t}\r\n.leaflet-zoom-anim .leaflet-tile,\r\n.leaflet-pan-anim .leaflet-tile {\r\n\t-webkit-transition: none;\r\n\t   -moz-transition: none;\r\n\t     -o-transition: none;\r\n\t        transition: none;\r\n\t}\r\n\r\n.leaflet-zoom-anim .leaflet-zoom-hide {\r\n\tvisibility: hidden;\r\n\t}\r\n\r\n\r\n/* cursors */\r\n\r\n.leaflet-interactive {\r\n\tcursor: pointer;\r\n\t}\r\n.leaflet-grab {\r\n\tcursor: -webkit-grab;\r\n\tcursor:    -moz-grab;\r\n\t}\r\n.leaflet-crosshair,\r\n.leaflet-crosshair .leaflet-interactive {\r\n\tcursor: crosshair;\r\n\t}\r\n.leaflet-popup-pane,\r\n.leaflet-control {\r\n\tcursor: auto;\r\n\t}\r\n.leaflet-dragging .leaflet-grab,\r\n.leaflet-dragging .leaflet-grab .leaflet-interactive,\r\n.leaflet-dragging .leaflet-marker-draggable {\r\n\tcursor: move;\r\n\tcursor: -webkit-grabbing;\r\n\tcursor:    -moz-grabbing;\r\n\t}\r\n\r\n/* marker & overlays interactivity */\r\n.leaflet-marker-icon,\r\n.leaflet-marker-shadow,\r\n.leaflet-image-layer,\r\n.leaflet-pane > svg path,\r\n.leaflet-tile-container {\r\n\tpointer-events: none;\r\n\t}\r\n\r\n.leaflet-marker-icon.leaflet-interactive,\r\n.leaflet-image-layer.leaflet-interactive,\r\n.leaflet-pane > svg path.leaflet-interactive {\r\n\tpointer-events: visiblePainted; /* IE 9-10 doesn't have auto */\r\n\tpointer-events: auto;\r\n\t}\r\n\r\n/* visual tweaks */\r\n\r\n.leaflet-container {\r\n\tbackground: #ddd;\r\n\toutline: 0;\r\n\t}\r\n.leaflet-container a {\r\n\tcolor: #0078A8;\r\n\t}\r\n.leaflet-container a.leaflet-active {\r\n\toutline: 2px solid orange;\r\n\t}\r\n.leaflet-zoom-box {\r\n\tborder: 2px dotted #38f;\r\n\tbackground: rgba(255,255,255,0.5);\r\n\t}\r\n\r\n\r\n/* general typography */\r\n.leaflet-container {\r\n\tfont: 12px/1.5 \"Helvetica Neue\", Arial, Helvetica, sans-serif;\r\n\t}\r\n\r\n\r\n/* general toolbar styles */\r\n\r\n.leaflet-bar {\r\n\tbox-shadow: 0 1px 5px rgba(0,0,0,0.65);\r\n\tborder-radius: 4px;\r\n\t}\r\n.leaflet-bar a,\r\n.leaflet-bar a:hover {\r\n\tbackground-color: #fff;\r\n\tborder-bottom: 1px solid #ccc;\r\n\twidth: 26px;\r\n\theight: 26px;\r\n\tline-height: 26px;\r\n\tdisplay: block;\r\n\ttext-align: center;\r\n\ttext-decoration: none;\r\n\tcolor: black;\r\n\t}\r\n.leaflet-bar a,\r\n.leaflet-control-layers-toggle {\r\n\tbackground-position: 50% 50%;\r\n\tbackground-repeat: no-repeat;\r\n\tdisplay: block;\r\n\t}\r\n.leaflet-bar a:hover {\r\n\tbackground-color: #f4f4f4;\r\n\t}\r\n.leaflet-bar a:first-child {\r\n\tborder-top-left-radius: 4px;\r\n\tborder-top-right-radius: 4px;\r\n\t}\r\n.leaflet-bar a:last-child {\r\n\tborder-bottom-left-radius: 4px;\r\n\tborder-bottom-right-radius: 4px;\r\n\tborder-bottom: none;\r\n\t}\r\n.leaflet-bar a.leaflet-disabled {\r\n\tcursor: default;\r\n\tbackground-color: #f4f4f4;\r\n\tcolor: #bbb;\r\n\t}\r\n\r\n.leaflet-touch .leaflet-bar a {\r\n\twidth: 30px;\r\n\theight: 30px;\r\n\tline-height: 30px;\r\n\t}\r\n.leaflet-touch .leaflet-bar a:first-child {\r\n\tborder-top-left-radius: 2px;\r\n\tborder-top-right-radius: 2px;\r\n\t}\r\n.leaflet-touch .leaflet-bar a:last-child {\r\n\tborder-bottom-left-radius: 2px;\r\n\tborder-bottom-right-radius: 2px;\r\n\t}\r\n\r\n/* zoom control */\r\n\r\n.leaflet-control-zoom-in,\r\n.leaflet-control-zoom-out {\r\n\tfont: bold 18px 'Lucida Console', Monaco, monospace;\r\n\ttext-indent: 1px;\r\n\t}\r\n\r\n.leaflet-touch .leaflet-control-zoom-in, .leaflet-touch .leaflet-control-zoom-out  {\r\n\tfont-size: 22px;\r\n\t}\r\n\r\n\r\n/* layers control */\r\n\r\n.leaflet-control-layers {\r\n\tbox-shadow: 0 1px 5px rgba(0,0,0,0.4);\r\n\tbackground: #fff;\r\n\tborder-radius: 5px;\r\n\t}\r\n.leaflet-control-layers-toggle {\r\n\tbackground-image: url(" + __webpack_require__("./node_modules/leaflet/dist/images/layers.png") + ");\r\n\twidth: 36px;\r\n\theight: 36px;\r\n\t}\r\n.leaflet-retina .leaflet-control-layers-toggle {\r\n\tbackground-image: url(" + __webpack_require__("./node_modules/leaflet/dist/images/layers-2x.png") + ");\r\n\tbackground-size: 26px 26px;\r\n\t}\r\n.leaflet-touch .leaflet-control-layers-toggle {\r\n\twidth: 44px;\r\n\theight: 44px;\r\n\t}\r\n.leaflet-control-layers .leaflet-control-layers-list,\r\n.leaflet-control-layers-expanded .leaflet-control-layers-toggle {\r\n\tdisplay: none;\r\n\t}\r\n.leaflet-control-layers-expanded .leaflet-control-layers-list {\r\n\tdisplay: block;\r\n\tposition: relative;\r\n\t}\r\n.leaflet-control-layers-expanded {\r\n\tpadding: 6px 10px 6px 6px;\r\n\tcolor: #333;\r\n\tbackground: #fff;\r\n\t}\r\n.leaflet-control-layers-scrollbar {\r\n\toverflow-y: scroll;\r\n\toverflow-x: hidden;\r\n\tpadding-right: 5px;\r\n\t}\r\n.leaflet-control-layers-selector {\r\n\tmargin-top: 2px;\r\n\tposition: relative;\r\n\ttop: 1px;\r\n\t}\r\n.leaflet-control-layers label {\r\n\tdisplay: block;\r\n\t}\r\n.leaflet-control-layers-separator {\r\n\theight: 0;\r\n\tborder-top: 1px solid #ddd;\r\n\tmargin: 5px -10px 5px -6px;\r\n\t}\r\n\r\n/* Default icon URLs */\r\n.leaflet-default-icon-path {\r\n\tbackground-image: url(" + __webpack_require__("./node_modules/leaflet/dist/images/marker-icon.png") + ");\r\n\t}\r\n\r\n\r\n/* attribution and scale controls */\r\n\r\n.leaflet-container .leaflet-control-attribution {\r\n\tbackground: #fff;\r\n\tbackground: rgba(255, 255, 255, 0.7);\r\n\tmargin: 0;\r\n\t}\r\n.leaflet-control-attribution,\r\n.leaflet-control-scale-line {\r\n\tpadding: 0 5px;\r\n\tcolor: #333;\r\n\t}\r\n.leaflet-control-attribution a {\r\n\ttext-decoration: none;\r\n\t}\r\n.leaflet-control-attribution a:hover {\r\n\ttext-decoration: underline;\r\n\t}\r\n.leaflet-container .leaflet-control-attribution,\r\n.leaflet-container .leaflet-control-scale {\r\n\tfont-size: 11px;\r\n\t}\r\n.leaflet-left .leaflet-control-scale {\r\n\tmargin-left: 5px;\r\n\t}\r\n.leaflet-bottom .leaflet-control-scale {\r\n\tmargin-bottom: 5px;\r\n\t}\r\n.leaflet-control-scale-line {\r\n\tborder: 2px solid #777;\r\n\tborder-top: none;\r\n\tline-height: 1.1;\r\n\tpadding: 2px 5px 1px;\r\n\tfont-size: 11px;\r\n\twhite-space: nowrap;\r\n\toverflow: hidden;\r\n\t-moz-box-sizing: border-box;\r\n\t     box-sizing: border-box;\r\n\r\n\tbackground: #fff;\r\n\tbackground: rgba(255, 255, 255, 0.5);\r\n\t}\r\n.leaflet-control-scale-line:not(:first-child) {\r\n\tborder-top: 2px solid #777;\r\n\tborder-bottom: none;\r\n\tmargin-top: -2px;\r\n\t}\r\n.leaflet-control-scale-line:not(:first-child):not(:last-child) {\r\n\tborder-bottom: 2px solid #777;\r\n\t}\r\n\r\n.leaflet-touch .leaflet-control-attribution,\r\n.leaflet-touch .leaflet-control-layers,\r\n.leaflet-touch .leaflet-bar {\r\n\tbox-shadow: none;\r\n\t}\r\n.leaflet-touch .leaflet-control-layers,\r\n.leaflet-touch .leaflet-bar {\r\n\tborder: 2px solid rgba(0,0,0,0.2);\r\n\tbackground-clip: padding-box;\r\n\t}\r\n\r\n\r\n/* popup */\r\n\r\n.leaflet-popup {\r\n\tposition: absolute;\r\n\ttext-align: center;\r\n\tmargin-bottom: 20px;\r\n\t}\r\n.leaflet-popup-content-wrapper {\r\n\tpadding: 1px;\r\n\ttext-align: left;\r\n\tborder-radius: 12px;\r\n\t}\r\n.leaflet-popup-content {\r\n\tmargin: 13px 19px;\r\n\tline-height: 1.4;\r\n\t}\r\n.leaflet-popup-content p {\r\n\tmargin: 18px 0;\r\n\t}\r\n.leaflet-popup-tip-container {\r\n\twidth: 40px;\r\n\theight: 20px;\r\n\tposition: absolute;\r\n\tleft: 50%;\r\n\tmargin-left: -20px;\r\n\toverflow: hidden;\r\n\tpointer-events: none;\r\n\t}\r\n.leaflet-popup-tip {\r\n\twidth: 17px;\r\n\theight: 17px;\r\n\tpadding: 1px;\r\n\r\n\tmargin: -10px auto 0;\r\n\r\n\t-webkit-transform: rotate(45deg);\r\n\t   -moz-transform: rotate(45deg);\r\n\t    -ms-transform: rotate(45deg);\r\n\t     -o-transform: rotate(45deg);\r\n\t        transform: rotate(45deg);\r\n\t}\r\n.leaflet-popup-content-wrapper,\r\n.leaflet-popup-tip {\r\n\tbackground: white;\r\n\tcolor: #333;\r\n\tbox-shadow: 0 3px 14px rgba(0,0,0,0.4);\r\n\t}\r\n.leaflet-container a.leaflet-popup-close-button {\r\n\tposition: absolute;\r\n\ttop: 0;\r\n\tright: 0;\r\n\tpadding: 4px 4px 0 0;\r\n\tborder: none;\r\n\ttext-align: center;\r\n\twidth: 18px;\r\n\theight: 14px;\r\n\tfont: 16px/14px Tahoma, Verdana, sans-serif;\r\n\tcolor: #c3c3c3;\r\n\ttext-decoration: none;\r\n\tfont-weight: bold;\r\n\tbackground: transparent;\r\n\t}\r\n.leaflet-container a.leaflet-popup-close-button:hover {\r\n\tcolor: #999;\r\n\t}\r\n.leaflet-popup-scrolled {\r\n\toverflow: auto;\r\n\tborder-bottom: 1px solid #ddd;\r\n\tborder-top: 1px solid #ddd;\r\n\t}\r\n\r\n.leaflet-oldie .leaflet-popup-content-wrapper {\r\n\tzoom: 1;\r\n\t}\r\n.leaflet-oldie .leaflet-popup-tip {\r\n\twidth: 24px;\r\n\tmargin: 0 auto;\r\n\r\n\t-ms-filter: \"progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)\";\r\n\tfilter: progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678);\r\n\t}\r\n.leaflet-oldie .leaflet-popup-tip-container {\r\n\tmargin-top: -1px;\r\n\t}\r\n\r\n.leaflet-oldie .leaflet-control-zoom,\r\n.leaflet-oldie .leaflet-control-layers,\r\n.leaflet-oldie .leaflet-popup-content-wrapper,\r\n.leaflet-oldie .leaflet-popup-tip {\r\n\tborder: 1px solid #999;\r\n\t}\r\n\r\n\r\n/* div icon */\r\n\r\n.leaflet-div-icon {\r\n\tbackground: #fff;\r\n\tborder: 1px solid #666;\r\n\t}\r\n\r\n\r\n/* Tooltip */\r\n/* Base styles for the element that has a tooltip */\r\n.leaflet-tooltip {\r\n\tposition: absolute;\r\n\tpadding: 6px;\r\n\tbackground-color: #fff;\r\n\tborder: 1px solid #fff;\r\n\tborder-radius: 3px;\r\n\tcolor: #222;\r\n\twhite-space: nowrap;\r\n\t-webkit-user-select: none;\r\n\t-moz-user-select: none;\r\n\t-ms-user-select: none;\r\n\tuser-select: none;\r\n\tpointer-events: none;\r\n\tbox-shadow: 0 1px 3px rgba(0,0,0,0.4);\r\n\t}\r\n.leaflet-tooltip.leaflet-clickable {\r\n\tcursor: pointer;\r\n\tpointer-events: auto;\r\n\t}\r\n.leaflet-tooltip-top:before,\r\n.leaflet-tooltip-bottom:before,\r\n.leaflet-tooltip-left:before,\r\n.leaflet-tooltip-right:before {\r\n\tposition: absolute;\r\n\tpointer-events: none;\r\n\tborder: 6px solid transparent;\r\n\tbackground: transparent;\r\n\tcontent: \"\";\r\n\t}\r\n\r\n/* Directions */\r\n\r\n.leaflet-tooltip-bottom {\r\n\tmargin-top: 6px;\r\n}\r\n.leaflet-tooltip-top {\r\n\tmargin-top: -6px;\r\n}\r\n.leaflet-tooltip-bottom:before,\r\n.leaflet-tooltip-top:before {\r\n\tleft: 50%;\r\n\tmargin-left: -6px;\r\n\t}\r\n.leaflet-tooltip-top:before {\r\n\tbottom: 0;\r\n\tmargin-bottom: -12px;\r\n\tborder-top-color: #fff;\r\n\t}\r\n.leaflet-tooltip-bottom:before {\r\n\ttop: 0;\r\n\tmargin-top: -12px;\r\n\tmargin-left: -6px;\r\n\tborder-bottom-color: #fff;\r\n\t}\r\n.leaflet-tooltip-left {\r\n\tmargin-left: -6px;\r\n}\r\n.leaflet-tooltip-right {\r\n\tmargin-left: 6px;\r\n}\r\n.leaflet-tooltip-left:before,\r\n.leaflet-tooltip-right:before {\r\n\ttop: 50%;\r\n\tmargin-top: -6px;\r\n\t}\r\n.leaflet-tooltip-left:before {\r\n\tright: 0;\r\n\tmargin-right: -12px;\r\n\tborder-left-color: #fff;\r\n\t}\r\n.leaflet-tooltip-right:before {\r\n\tleft: 0;\r\n\tmargin-left: -12px;\r\n\tborder-right-color: #fff;\r\n\t}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/happypack/loader.js?id=css-81af377f!./node_modules/rc-slider/assets/index.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".rc-slider {\n  position: relative;\n  height: 14px;\n  padding: 5px 0;\n  width: 100%;\n  border-radius: 6px;\n  -ms-touch-action: none;\n      touch-action: none;\n  box-sizing: border-box;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n}\n.rc-slider * {\n  box-sizing: border-box;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n}\n.rc-slider-rail {\n  position: absolute;\n  width: 100%;\n  background-color: #e9e9e9;\n  height: 4px;\n  border-radius: 6px;\n}\n.rc-slider-track {\n  position: absolute;\n  left: 0;\n  height: 4px;\n  border-radius: 6px;\n  background-color: #abe2fb;\n}\n.rc-slider-handle {\n  position: absolute;\n  margin-left: -7px;\n  margin-top: -5px;\n  width: 14px;\n  height: 14px;\n  cursor: pointer;\n  cursor: -webkit-grab;\n  cursor: grab;\n  border-radius: 50%;\n  border: solid 2px #96dbfa;\n  background-color: #fff;\n  -ms-touch-action: pan-x;\n      touch-action: pan-x;\n}\n.rc-slider-handle:hover {\n  border-color: #57c5f7;\n}\n.rc-slider-handle:active {\n  border-color: #57c5f7;\n  box-shadow: 0 0 5px #57c5f7;\n  cursor: -webkit-grabbing;\n  cursor: grabbing;\n}\n.rc-slider-handle:focus {\n  border-color: #57c5f7;\n  box-shadow: 0 0 0 5px #96dbfa;\n  outline: none;\n}\n.rc-slider-mark {\n  position: absolute;\n  top: 18px;\n  left: 0;\n  width: 100%;\n  font-size: 12px;\n}\n.rc-slider-mark-text {\n  position: absolute;\n  display: inline-block;\n  vertical-align: middle;\n  text-align: center;\n  cursor: pointer;\n  color: #999;\n}\n.rc-slider-mark-text-active {\n  color: #666;\n}\n.rc-slider-step {\n  position: absolute;\n  width: 100%;\n  height: 4px;\n  background: transparent;\n}\n.rc-slider-dot {\n  position: absolute;\n  bottom: -2px;\n  margin-left: -4px;\n  width: 8px;\n  height: 8px;\n  border: 2px solid #e9e9e9;\n  background-color: #fff;\n  cursor: pointer;\n  border-radius: 50%;\n  vertical-align: middle;\n}\n.rc-slider-dot:first-child {\n  margin-left: -4px;\n}\n.rc-slider-dot:last-child {\n  margin-left: -4px;\n}\n.rc-slider-dot-active {\n  border-color: #96dbfa;\n}\n.rc-slider-disabled {\n  background-color: #e9e9e9;\n}\n.rc-slider-disabled .rc-slider-track {\n  background-color: #ccc;\n}\n.rc-slider-disabled .rc-slider-handle,\n.rc-slider-disabled .rc-slider-dot {\n  border-color: #ccc;\n  box-shadow: none;\n  background-color: #fff;\n  cursor: not-allowed;\n}\n.rc-slider-disabled .rc-slider-mark-text,\n.rc-slider-disabled .rc-slider-dot {\n  cursor: not-allowed !important;\n}\n.rc-slider-vertical {\n  width: 14px;\n  height: 100%;\n  padding: 0 5px;\n}\n.rc-slider-vertical .rc-slider-rail {\n  height: 100%;\n  width: 4px;\n}\n.rc-slider-vertical .rc-slider-track {\n  left: 5px;\n  bottom: 0;\n  width: 4px;\n}\n.rc-slider-vertical .rc-slider-handle {\n  margin-left: -5px;\n  margin-bottom: -7px;\n  -ms-touch-action: pan-y;\n      touch-action: pan-y;\n}\n.rc-slider-vertical .rc-slider-mark {\n  top: 0;\n  left: 18px;\n  height: 100%;\n}\n.rc-slider-vertical .rc-slider-step {\n  height: 100%;\n  width: 4px;\n}\n.rc-slider-vertical .rc-slider-dot {\n  left: 2px;\n  margin-bottom: -4px;\n}\n.rc-slider-vertical .rc-slider-dot:first-child {\n  margin-bottom: -4px;\n}\n.rc-slider-vertical .rc-slider-dot:last-child {\n  margin-bottom: -4px;\n}\n.rc-slider-tooltip-zoom-down-enter,\n.rc-slider-tooltip-zoom-down-appear {\n  -webkit-animation-duration: .3s;\n          animation-duration: .3s;\n  -webkit-animation-fill-mode: both;\n          animation-fill-mode: both;\n  display: block !important;\n  -webkit-animation-play-state: paused;\n          animation-play-state: paused;\n}\n.rc-slider-tooltip-zoom-down-leave {\n  -webkit-animation-duration: .3s;\n          animation-duration: .3s;\n  -webkit-animation-fill-mode: both;\n          animation-fill-mode: both;\n  display: block !important;\n  -webkit-animation-play-state: paused;\n          animation-play-state: paused;\n}\n.rc-slider-tooltip-zoom-down-enter.rc-slider-tooltip-zoom-down-enter-active,\n.rc-slider-tooltip-zoom-down-appear.rc-slider-tooltip-zoom-down-appear-active {\n  -webkit-animation-name: rcSliderTooltipZoomDownIn;\n          animation-name: rcSliderTooltipZoomDownIn;\n  -webkit-animation-play-state: running;\n          animation-play-state: running;\n}\n.rc-slider-tooltip-zoom-down-leave.rc-slider-tooltip-zoom-down-leave-active {\n  -webkit-animation-name: rcSliderTooltipZoomDownOut;\n          animation-name: rcSliderTooltipZoomDownOut;\n  -webkit-animation-play-state: running;\n          animation-play-state: running;\n}\n.rc-slider-tooltip-zoom-down-enter,\n.rc-slider-tooltip-zoom-down-appear {\n  -webkit-transform: scale(0, 0);\n          transform: scale(0, 0);\n  -webkit-animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);\n          animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);\n}\n.rc-slider-tooltip-zoom-down-leave {\n  -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n          animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);\n}\n@-webkit-keyframes rcSliderTooltipZoomDownIn {\n  0% {\n    opacity: 0;\n    -webkit-transform-origin: 50% 100%;\n            transform-origin: 50% 100%;\n    -webkit-transform: scale(0, 0);\n            transform: scale(0, 0);\n  }\n  100% {\n    -webkit-transform-origin: 50% 100%;\n            transform-origin: 50% 100%;\n    -webkit-transform: scale(1, 1);\n            transform: scale(1, 1);\n  }\n}\n@keyframes rcSliderTooltipZoomDownIn {\n  0% {\n    opacity: 0;\n    -webkit-transform-origin: 50% 100%;\n            transform-origin: 50% 100%;\n    -webkit-transform: scale(0, 0);\n            transform: scale(0, 0);\n  }\n  100% {\n    -webkit-transform-origin: 50% 100%;\n            transform-origin: 50% 100%;\n    -webkit-transform: scale(1, 1);\n            transform: scale(1, 1);\n  }\n}\n@-webkit-keyframes rcSliderTooltipZoomDownOut {\n  0% {\n    -webkit-transform-origin: 50% 100%;\n            transform-origin: 50% 100%;\n    -webkit-transform: scale(1, 1);\n            transform: scale(1, 1);\n  }\n  100% {\n    opacity: 0;\n    -webkit-transform-origin: 50% 100%;\n            transform-origin: 50% 100%;\n    -webkit-transform: scale(0, 0);\n            transform: scale(0, 0);\n  }\n}\n@keyframes rcSliderTooltipZoomDownOut {\n  0% {\n    -webkit-transform-origin: 50% 100%;\n            transform-origin: 50% 100%;\n    -webkit-transform: scale(1, 1);\n            transform: scale(1, 1);\n  }\n  100% {\n    opacity: 0;\n    -webkit-transform-origin: 50% 100%;\n            transform-origin: 50% 100%;\n    -webkit-transform: scale(0, 0);\n            transform: scale(0, 0);\n  }\n}\n.rc-slider-tooltip {\n  position: absolute;\n  left: -9999px;\n  top: -9999px;\n  visibility: visible;\n  box-sizing: border-box;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n}\n.rc-slider-tooltip * {\n  box-sizing: border-box;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n}\n.rc-slider-tooltip-hidden {\n  display: none;\n}\n.rc-slider-tooltip-placement-top {\n  padding: 4px 0 8px 0;\n}\n.rc-slider-tooltip-inner {\n  padding: 6px 2px;\n  min-width: 24px;\n  height: 24px;\n  font-size: 12px;\n  line-height: 1;\n  color: #fff;\n  text-align: center;\n  text-decoration: none;\n  background-color: #6c6c6c;\n  border-radius: 6px;\n  box-shadow: 0 0 4px #d9d9d9;\n}\n.rc-slider-tooltip-arrow {\n  position: absolute;\n  width: 0;\n  height: 0;\n  border-color: transparent;\n  border-style: solid;\n}\n.rc-slider-tooltip-placement-top .rc-slider-tooltip-arrow {\n  bottom: 4px;\n  left: 50%;\n  margin-left: -4px;\n  border-width: 4px 4px 0;\n  border-top-color: #6c6c6c;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/happypack/loader.js?id=css-81af377f!./node_modules/rc-tooltip/assets/bootstrap.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".rc-tooltip {\n  position: absolute;\n  z-index: 1070;\n  display: block;\n  visibility: visible;\n  font-size: 12px;\n  line-height: 1.5;\n  opacity: 0.9;\n}\n.rc-tooltip-hidden {\n  display: none;\n}\n.rc-tooltip-placement-top,\n.rc-tooltip-placement-topLeft,\n.rc-tooltip-placement-topRight {\n  padding: 5px 0 9px 0;\n}\n.rc-tooltip-placement-right,\n.rc-tooltip-placement-rightTop,\n.rc-tooltip-placement-rightBottom {\n  padding: 0 5px 0 9px;\n}\n.rc-tooltip-placement-bottom,\n.rc-tooltip-placement-bottomLeft,\n.rc-tooltip-placement-bottomRight {\n  padding: 9px 0 5px 0;\n}\n.rc-tooltip-placement-left,\n.rc-tooltip-placement-leftTop,\n.rc-tooltip-placement-leftBottom {\n  padding: 0 9px 0 5px;\n}\n.rc-tooltip-inner {\n  padding: 8px 10px;\n  color: #fff;\n  text-align: left;\n  text-decoration: none;\n  background-color: #373737;\n  border-radius: 6px;\n  box-shadow: 0 0 4px rgba(0, 0, 0, 0.17);\n  min-height: 34px;\n}\n.rc-tooltip-arrow {\n  position: absolute;\n  width: 0;\n  height: 0;\n  border-color: transparent;\n  border-style: solid;\n}\n.rc-tooltip-placement-top .rc-tooltip-arrow,\n.rc-tooltip-placement-topLeft .rc-tooltip-arrow,\n.rc-tooltip-placement-topRight .rc-tooltip-arrow {\n  bottom: 4px;\n  margin-left: -5px;\n  border-width: 5px 5px 0;\n  border-top-color: #373737;\n}\n.rc-tooltip-placement-top .rc-tooltip-arrow {\n  left: 50%;\n}\n.rc-tooltip-placement-topLeft .rc-tooltip-arrow {\n  left: 15%;\n}\n.rc-tooltip-placement-topRight .rc-tooltip-arrow {\n  right: 15%;\n}\n.rc-tooltip-placement-right .rc-tooltip-arrow,\n.rc-tooltip-placement-rightTop .rc-tooltip-arrow,\n.rc-tooltip-placement-rightBottom .rc-tooltip-arrow {\n  left: 4px;\n  margin-top: -5px;\n  border-width: 5px 5px 5px 0;\n  border-right-color: #373737;\n}\n.rc-tooltip-placement-right .rc-tooltip-arrow {\n  top: 50%;\n}\n.rc-tooltip-placement-rightTop .rc-tooltip-arrow {\n  top: 15%;\n  margin-top: 0;\n}\n.rc-tooltip-placement-rightBottom .rc-tooltip-arrow {\n  bottom: 15%;\n}\n.rc-tooltip-placement-left .rc-tooltip-arrow,\n.rc-tooltip-placement-leftTop .rc-tooltip-arrow,\n.rc-tooltip-placement-leftBottom .rc-tooltip-arrow {\n  right: 4px;\n  margin-top: -5px;\n  border-width: 5px 0 5px 5px;\n  border-left-color: #373737;\n}\n.rc-tooltip-placement-left .rc-tooltip-arrow {\n  top: 50%;\n}\n.rc-tooltip-placement-leftTop .rc-tooltip-arrow {\n  top: 15%;\n  margin-top: 0;\n}\n.rc-tooltip-placement-leftBottom .rc-tooltip-arrow {\n  bottom: 15%;\n}\n.rc-tooltip-placement-bottom .rc-tooltip-arrow,\n.rc-tooltip-placement-bottomLeft .rc-tooltip-arrow,\n.rc-tooltip-placement-bottomRight .rc-tooltip-arrow {\n  top: 4px;\n  margin-left: -5px;\n  border-width: 0 5px 5px;\n  border-bottom-color: #373737;\n}\n.rc-tooltip-placement-bottom .rc-tooltip-arrow {\n  left: 50%;\n}\n.rc-tooltip-placement-bottomLeft .rc-tooltip-arrow {\n  left: 15%;\n}\n.rc-tooltip-placement-bottomRight .rc-tooltip-arrow {\n  right: 15%;\n}\n.rc-tooltip.rc-tooltip-zoom-enter,\n.rc-tooltip.rc-tooltip-zoom-leave {\n  display: block;\n}\n.rc-tooltip-zoom-enter,\n.rc-tooltip-zoom-appear {\n  opacity: 0;\n  -webkit-animation-duration: 0.3s;\n          animation-duration: 0.3s;\n  -webkit-animation-fill-mode: both;\n          animation-fill-mode: both;\n  -webkit-animation-timing-function: cubic-bezier(0.18, 0.89, 0.32, 1.28);\n          animation-timing-function: cubic-bezier(0.18, 0.89, 0.32, 1.28);\n  -webkit-animation-play-state: paused;\n          animation-play-state: paused;\n}\n.rc-tooltip-zoom-leave {\n  -webkit-animation-duration: 0.3s;\n          animation-duration: 0.3s;\n  -webkit-animation-fill-mode: both;\n          animation-fill-mode: both;\n  -webkit-animation-timing-function: cubic-bezier(0.6, -0.3, 0.74, 0.05);\n          animation-timing-function: cubic-bezier(0.6, -0.3, 0.74, 0.05);\n  -webkit-animation-play-state: paused;\n          animation-play-state: paused;\n}\n.rc-tooltip-zoom-enter.rc-tooltip-zoom-enter-active,\n.rc-tooltip-zoom-appear.rc-tooltip-zoom-appear-active {\n  -webkit-animation-name: rcToolTipZoomIn;\n          animation-name: rcToolTipZoomIn;\n  -webkit-animation-play-state: running;\n          animation-play-state: running;\n}\n.rc-tooltip-zoom-leave.rc-tooltip-zoom-leave-active {\n  -webkit-animation-name: rcToolTipZoomOut;\n          animation-name: rcToolTipZoomOut;\n  -webkit-animation-play-state: running;\n          animation-play-state: running;\n}\n@-webkit-keyframes rcToolTipZoomIn {\n  0% {\n    opacity: 0;\n    -webkit-transform-origin: 50% 50%;\n            transform-origin: 50% 50%;\n    -webkit-transform: scale(0, 0);\n            transform: scale(0, 0);\n  }\n  100% {\n    opacity: 1;\n    -webkit-transform-origin: 50% 50%;\n            transform-origin: 50% 50%;\n    -webkit-transform: scale(1, 1);\n            transform: scale(1, 1);\n  }\n}\n@keyframes rcToolTipZoomIn {\n  0% {\n    opacity: 0;\n    -webkit-transform-origin: 50% 50%;\n            transform-origin: 50% 50%;\n    -webkit-transform: scale(0, 0);\n            transform: scale(0, 0);\n  }\n  100% {\n    opacity: 1;\n    -webkit-transform-origin: 50% 50%;\n            transform-origin: 50% 50%;\n    -webkit-transform: scale(1, 1);\n            transform: scale(1, 1);\n  }\n}\n@-webkit-keyframes rcToolTipZoomOut {\n  0% {\n    opacity: 1;\n    -webkit-transform-origin: 50% 50%;\n            transform-origin: 50% 50%;\n    -webkit-transform: scale(1, 1);\n            transform: scale(1, 1);\n  }\n  100% {\n    opacity: 0;\n    -webkit-transform-origin: 50% 50%;\n            transform-origin: 50% 50%;\n    -webkit-transform: scale(0, 0);\n            transform: scale(0, 0);\n  }\n}\n@keyframes rcToolTipZoomOut {\n  0% {\n    opacity: 1;\n    -webkit-transform-origin: 50% 50%;\n            transform-origin: 50% 50%;\n    -webkit-transform: scale(1, 1);\n            transform: scale(1, 1);\n  }\n  100% {\n    opacity: 0;\n    -webkit-transform-origin: 50% 50%;\n            transform-origin: 50% 50%;\n    -webkit-transform: scale(0, 0);\n            transform: scale(0, 0);\n  }\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/happypack/loader.js?id=css-81af377f!./src/components/atoms/CedejWatermark/styles.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".leaflet-control.leaflet-watermark {\n  margin-bottom: 5px;\n  margin-top: 10px;\n}\n.leaflet-watermark img {\n  width: 100%;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/happypack/loader.js?id=css-81af377f!./src/components/atoms/CircleSizesSymbol/style.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "svg .cls-1,.cls-2 {\n  fill:rgba(0,0,0,0);\n}\nsvg .cls-1,.cls-2,.cls-3,.cls-4,.cls-5,.cls-6,.cls-7{\n  stroke:#1d1d1b;\n  stroke-miterlimit:100;\n  stroke-width:20px;\n}\nsvg .cls-3,.cls-4,.cls-5,.cls-6,.cls-7{\n  fill:none;\n}\nsvg .cls-3{stroke-dasharray:170.94 170.94;}\nsvg .cls-4{stroke-dasharray:120.01 120.01;}\nsvg .cls-6{stroke-dasharray:50.98 50.98;}\nsvg .cls-7{stroke-dasharray:50.88 50.88;}\n\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/happypack/loader.js?id=css-81af377f!./src/components/organisms/Atlas/Atlas.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".leaflet-container {\n  /* min-height: 800px; */\n  width: 100%;\n  height: 100%;\n  color: blue;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  top: 0;\n}\n\n.leaflet-layer {\n  pointer-events: none;\n}\n.leaflet-layer.evented {\n  pointer-events: auto;\n}\n.leaflet-container .leaflet-canvas-layer {\n  transition: transform .5s ease-in;\n  transform-origin: 0 0;\n}\n\n.leaflet-control-container {\n  position: absolute;\n  top: 0;\n  right: 250px;\n  bottom: 0;\n  left: 0;\n}\n\n.sidebar-closed .leaflet-control-container {\n  right: 50px;\n}\n.leaflet-right .leaflet-control-scale:after {\n  clear: both;\n  content: ' ';\n}\n.leaflet-right .leaflet-control-scale-line {\n  float: right;\n  clear: both;\n  text-align: right;\n}\n\n.leaflet-right .leaflet-control-scale-line:before {\n  clear: both;\n  content: ' ';\n}\n\n.leaflet-popup-pane {\n  z-index: 1400;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/happypack/loader.js?id=css-81af377f!./src/components/organisms/DesertLabelsLayer/DesertLabelsLayer.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".leaflet-desert-tooltip-pane .leaflet-tooltip {\n  background-color: transparent;\n  border: none;\n  box-shadow: none;\n  opacity: 1 !important;\n}\n\n.leaflet-desert-tooltip-pane .leaflet-tooltip:before {\n  display: none;\n}\n\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/happypack/loader.js?id=css-81af377f!./src/components/organisms/WaterLabelsLayer/WaterLabelsLayer.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".leaflet-water-labels-tooltip-pane .leaflet-tooltip {\n  background-color: transparent;\n  border: none;\n  box-shadow: none;\n  opacity: 1 !important;\n}\n\n.leaflet-water-labels-tooltip-pane .leaflet-tooltip:before {\n  display: none;\n}\n\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/leaflet/dist/images/layers-2x.png":
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAQAAABvcdNgAAAEsklEQVR4AWL4TydIhpZK1kpWOlg0w3ZXP6D2soBtG42jeI6ZmQTHzAxiTbSJsYLjO9HhP+WOmcuhciVnmHVQcJnp7DFvScowZorad/+V/fVzMdMT2g9Cv9guXGv/7pYOrXh2U+RRR3dSd9JRx6bIFc/ekqHI29JC6pJ5ZEh1yWkhkbcFeSjxgx3L2m1cb1C7bceyxA+CNjT/Ifff+/kDk2u/w/33/IeCMOSaWZ4glosqT3DNnNZQ7Cs58/3Ce5HL78iZH/vKVIaYlqzfdLu8Vi7dnvUbEza5Idt36tquZFldl6N5Z/POLof0XLK61mZCmJSWjVF9tEjUluu74IUXvgttuVIHE7YxSkaYhJZam7yiM9Pv82JYfl9nptxZaxMJE4YSPty+vF0+Y2up9d3wwijfjZbabqm/3bZ9ecKHsiGmRflnn1MW4pjHf9oLufyn2z3y1D6n8g8TZhxyzipLNPnAUpsOiuWimg52psrTZYnOWYNDTMuWBWa0tJb4rgq1UvmutpaYEbZlwU3CLJm/ayYjHW5/h7xWLn9Hh1vepDkyf7dE7MtT5LR4e7yYpHrkhOUpEfssBLq2pPhAqoSWKUkk7EDqkmK6RrCEzqDjhNDWNE+XSMvkJRDWlZTmCW0l0PHQGRZY5t1L83kT0Y3l2SItk5JAWHl2dCOBm+fPu3fo5/3v61RMCO9Jx2EEYYhb0rmNQMX/vm7gqOEJLcXTGw3CAuRNeyaPWwjR8PRqKQ1PDA/dpv+on9Shox52WFnx0KY8onHayrJzm87i5h9xGw/tfkev0jGsQizqezUKjk12hBMKJ4kbCqGPVNXudyyrShovGw5CgxsRICxF6aRmSjlBnHRzg7Gx8fKqEubI2rahQYdR1YgDIRQO7JvQyD52hoIQx0mxa0ODtW2Iozn1le2iIRdzwWewedyZzewidueOGqlsn1MvcnQpuVwLGG3/IR1hIKxCjelIDZ8ldqWz25jWAsnldEnK0Zxro19TGVb2ffIZEsIO89EIEDvKMPrzmBOQcKQ+rroye6NgRRxqR4U8EAkz0CL6uSGOm6KQCdWjvjRiSP1BPalCRS5iQYiEIvxuBMJEWgzSoHADcVMuN7IuqqTeyUPq22qFimFtxDyBBJEwNyt6TM88blFHao/6tWWhuuOM4SAK4EI4QmFHA+SEyWlp4EQoJ13cYGzMu7yszEIBOm2rVmHUNqwAIQabISNMRstmdhNWcFLsSm+0tjJH1MdRxO5Nx0WDMhCtgD6OKgZeljJqJKc9po8juskR9XN0Y1lZ3mWjLR9JCO1jRDMd0fpYC2VnvjBSEFg7wBENc0R9HFlb0xvF1+TBEpF68d+DHR6IOWVv2BECtxo46hOFUBd/APU57WIoEwJhIi2CdpyZX0m93BZicktMj1AS9dClteUFAUNUIEygRZCtik5zSxI9MubTBH1GOiHsiLJ3OCoSZkILa9PxiN0EbvhsAo8tdAf9Seepd36lGWHmtNANTv5Jd0z4QYyeo/UEJqxKRpg5LZx6btLPsOaEmdMyxYdlc8LMaJnikDlhclqmPiQnTEpLUIZEwkRagjYkEibQErwhkTAKCLQEbUgkzJQWc/0PstHHcfEdQ+UAAAAASUVORK5CYII="

/***/ }),

/***/ "./node_modules/leaflet/dist/images/layers.png":
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAQAAAADQ4RFAAACf0lEQVR4AY1UM3gkARTePdvdoTxXKc+qTl3aU5U6b2Kbkz3Gtq3Zw6ziLGNPzrYx7946Tr6/ee/XeCQ4D3ykPtL5tHno4n0d/h3+xfuWHGLX81cn7r0iTNzjr7LrlxCqPtkbTQEHeqOrTy4Yyt3VCi/IOB0v7rVC7q45Q3Gr5K6jt+3Gl5nCoDD4MtO+j96Wu8atmhGqcNGHObuf8OM/x3AMx38+4Z2sPqzCxRFK2aF2e5Jol56XTLyggAMTL56XOMoS1W4pOyjUcGGQdZxU6qRh7B9Zp+PfpOFlqt0zyDZckPi1ttmIp03jX8gyJ8a/PG2yutpS/Vol7peZIbZcKBAEEheEIAgFbDkz5H6Zrkm2hVWGiXKiF4Ycw0RWKdtC16Q7qe3X4iOMxruonzegJzWaXFrU9utOSsLUmrc0YjeWYjCW4PDMADElpJSSQ0vQvA1Tm6/JlKnqFs1EGyZiFCqnRZTEJJJiKRYzVYzJck2Rm6P4iH+cmSY0YzimYa8l0EtTODFWhcMIMVqdsI2uiTvKmTisIDHJ3od5GILVhBCarCfVRmo4uTjkhrhzkiBV7SsaqS+TzrzM1qpGGUFt28pIySQHR6h7F6KSwGWm97ay+Z+ZqMcEjEWebE7wxCSQwpkhJqoZA5ivCdZDjJepuJ9IQjGGUmuXJdBFUygxVqVsxFsLMbDe8ZbDYVCGKxs+W080max1hFCarCfV+C1KATwcnvE9gRRuMP2prdbWGowm1KB1y+zwMMENkM755cJ2yPDtqhTI6ED1M/82yIDtC/4j4BijjeObflpO9I9MwXTCsSX8jWAFeHr05WoLTJ5G8IQVS/7vwR6ohirYM7f6HzYpogfS3R2OAAAAAElFTkSuQmCC"

/***/ }),

/***/ "./node_modules/leaflet/dist/images/marker-icon.png":
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII="

/***/ }),

/***/ "./node_modules/leaflet/dist/leaflet.css":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/happypack/loader.js?id=css-81af377f!./node_modules/leaflet/dist/leaflet.css");
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__("./node_modules/style-loader/addStyles.js")(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("./node_modules/happypack/loader.js?id=css-81af377f!./node_modules/leaflet/dist/leaflet.css", function() {
			var newContent = __webpack_require__("./node_modules/happypack/loader.js?id=css-81af377f!./node_modules/leaflet/dist/leaflet.css");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/query-string/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strictUriEncode = __webpack_require__("./node_modules/strict-uri-encode/index.js");
var objectAssign = __webpack_require__("./node_modules/object-assign/index.js");

function encoderForArrayFormat(opts) {
	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, index) {
				return value === null ? [
					encode(key, opts),
					'[',
					index,
					']'
				].join('') : [
					encode(key, opts),
					'[',
					encode(index, opts),
					']=',
					encode(value, opts)
				].join('');
			};

		case 'bracket':
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'[]=',
					encode(value, opts)
				].join('');
			};

		default:
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'=',
					encode(value, opts)
				].join('');
			};
	}
}

function parserForArrayFormat(opts) {
	var result;

	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, accumulator) {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return function (key, value, accumulator) {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				} else if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		default:
			return function (key, value, accumulator) {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function encode(value, opts) {
	if (opts.encode) {
		return opts.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	} else if (typeof input === 'object') {
		return keysSorter(Object.keys(input)).sort(function (a, b) {
			return Number(a) - Number(b);
		}).map(function (key) {
			return input[key];
		});
	}

	return input;
}

exports.extract = function (str) {
	return str.split('?')[1] || '';
};

exports.parse = function (str, opts) {
	opts = objectAssign({arrayFormat: 'none'}, opts);

	var formatter = parserForArrayFormat(opts);

	// Create an object with no prototype
	// https://github.com/sindresorhus/query-string/issues/47
	var ret = Object.create(null);

	if (typeof str !== 'string') {
		return ret;
	}

	str = str.trim().replace(/^(\?|#|&)/, '');

	if (!str) {
		return ret;
	}

	str.split('&').forEach(function (param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		// Firefox (pre 40) decodes `%3D` to `=`
		// https://github.com/sindresorhus/query-string/pull/37
		var key = parts.shift();
		var val = parts.length > 0 ? parts.join('=') : undefined;

		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeURIComponent(val);

		formatter(decodeURIComponent(key), val, ret);
	});

	return Object.keys(ret).sort().reduce(function (result, key) {
		var val = ret[key];
		if (Boolean(val) && typeof val === 'object' && !Array.isArray(val)) {
			// Sort object keys, not values
			result[key] = keysSorter(val);
		} else {
			result[key] = val;
		}

		return result;
	}, Object.create(null));
};

exports.stringify = function (obj, opts) {
	var defaults = {
		encode: true,
		strict: true,
		arrayFormat: 'none'
	};

	opts = objectAssign(defaults, opts);

	var formatter = encoderForArrayFormat(opts);

	return obj ? Object.keys(obj).sort().map(function (key) {
		var val = obj[key];

		if (val === undefined) {
			return '';
		}

		if (val === null) {
			return encode(key, opts);
		}

		if (Array.isArray(val)) {
			var result = [];

			val.slice().forEach(function (val2) {
				if (val2 === undefined) {
					return;
				}

				result.push(formatter(key, val2, result.length));
			});

			return result.join('&');
		}

		return encode(key, opts) + '=' + encode(val, opts);
	}).filter(function (x) {
		return x.length > 0;
	}).join('&') : '';
};


/***/ }),

/***/ "./node_modules/rc-slider/assets/index.css":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/happypack/loader.js?id=css-81af377f!./node_modules/rc-slider/assets/index.css");
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__("./node_modules/style-loader/addStyles.js")(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("./node_modules/happypack/loader.js?id=css-81af377f!./node_modules/rc-slider/assets/index.css", function() {
			var newContent = __webpack_require__("./node_modules/happypack/loader.js?id=css-81af377f!./node_modules/rc-slider/assets/index.css");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/rc-tooltip/assets/bootstrap.css":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/happypack/loader.js?id=css-81af377f!./node_modules/rc-tooltip/assets/bootstrap.css");
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__("./node_modules/style-loader/addStyles.js")(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("./node_modules/happypack/loader.js?id=css-81af377f!./node_modules/rc-tooltip/assets/bootstrap.css", function() {
			var newContent = __webpack_require__("./node_modules/happypack/loader.js?id=css-81af377f!./node_modules/rc-tooltip/assets/bootstrap.css");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/react-addons-create-fragment/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */



var React = __webpack_require__("./node_modules/react/react.js");

var REACT_ELEMENT_TYPE =
  (typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element')) ||
  0xeac7;

var emptyFunction = __webpack_require__("./node_modules/fbjs/lib/emptyFunction.js");
var invariant = __webpack_require__("./node_modules/fbjs/lib/invariant.js");
var warning = __webpack_require__("./node_modules/fbjs/lib/warning.js");

var SEPARATOR = '.';
var SUBSEPARATOR = ':';

var didWarnAboutMaps = false;

var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

function getIteratorFn(maybeIterable) {
  var iteratorFn =
    maybeIterable &&
    ((ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL]) ||
      maybeIterable[FAUX_ITERATOR_SYMBOL]);
  if (typeof iteratorFn === 'function') {
    return iteratorFn;
  }
}

function escape(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = ('' + key).replace(escapeRegex, function(match) {
    return escaperLookup[match];
  });

  return '$' + escapedString;
}

function getComponentKey(component, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (component && typeof component === 'object' && component.key != null) {
    // Explicit key
    return escape(component.key);
  }
  // Implicit key determined by the index in the set
  return index.toString(36);
}

function traverseAllChildrenImpl(
  children,
  nameSoFar,
  callback,
  traverseContext
) {
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  if (
    children === null ||
    type === 'string' ||
    type === 'number' ||
    // The following is inlined from ReactElement. This means we can optimize
    // some checks. React Fiber also inlines this logic for similar purposes.
    (type === 'object' && children.$$typeof === REACT_ELEMENT_TYPE)
  ) {
    callback(
      traverseContext,
      children,
      // If it's the only child, treat the name as if it was wrapped in an array
      // so that it's consistent if the number of children grows.
      nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar
    );
    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0; // Count of children found in the current subtree.
  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(
        child,
        nextName,
        callback,
        traverseContext
      );
    }
  } else {
    var iteratorFn = getIteratorFn(children);
    if (iteratorFn) {
      if (true) {
        // Warn about using Maps as children
        if (iteratorFn === children.entries) {
          warning(
            didWarnAboutMaps,
            'Using Maps as children is unsupported and will likely yield ' +
              'unexpected results. Convert it to a sequence/iterable of keyed ' +
              'ReactElements instead.'
          );
          didWarnAboutMaps = true;
        }
      }

      var iterator = iteratorFn.call(children);
      var step;
      var ii = 0;
      while (!(step = iterator.next()).done) {
        child = step.value;
        nextName = nextNamePrefix + getComponentKey(child, ii++);
        subtreeCount += traverseAllChildrenImpl(
          child,
          nextName,
          callback,
          traverseContext
        );
      }
    } else if (type === 'object') {
      var addendum = '';
      if (true) {
        addendum =
          ' If you meant to render a collection of children, use an array ' +
          'instead or wrap the object using createFragment(object) from the ' +
          'React add-ons.';
      }
      var childrenString = '' + children;
      invariant(
        false,
        'Objects are not valid as a React child (found: %s).%s',
        childrenString === '[object Object]'
          ? 'object with keys {' + Object.keys(children).join(', ') + '}'
          : childrenString,
        addendum
      );
    }
  }

  return subtreeCount;
}

function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}

var userProvidedKeyEscapeRegex = /\/+/g;
function escapeUserProvidedKey(text) {
  return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
}

function cloneAndReplaceKey(oldElement, newKey) {
  return React.cloneElement(
    oldElement,
    {key: newKey},
    oldElement.props !== undefined ? oldElement.props.children : undefined
  );
}

var DEFAULT_POOL_SIZE = 10;
var DEFAULT_POOLER = oneArgumentPooler;

var oneArgumentPooler = function(copyFieldsFrom) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, copyFieldsFrom);
    return instance;
  } else {
    return new Klass(copyFieldsFrom);
  }
};

var addPoolingTo = function addPoolingTo(CopyConstructor, pooler) {
  // Casting as any so that flow ignores the actual implementation and trusts
  // it to match the type we declared
  var NewKlass = CopyConstructor;
  NewKlass.instancePool = [];
  NewKlass.getPooled = pooler || DEFAULT_POOLER;
  if (!NewKlass.poolSize) {
    NewKlass.poolSize = DEFAULT_POOL_SIZE;
  }
  NewKlass.release = standardReleaser;
  return NewKlass;
};

var standardReleaser = function standardReleaser(instance) {
  var Klass = this;
  invariant(
    instance instanceof Klass,
    'Trying to release an instance into a pool of a different type.'
  );
  instance.destructor();
  if (Klass.instancePool.length < Klass.poolSize) {
    Klass.instancePool.push(instance);
  }
};

var fourArgumentPooler = function fourArgumentPooler(a1, a2, a3, a4) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3, a4);
    return instance;
  } else {
    return new Klass(a1, a2, a3, a4);
  }
};

function MapBookKeeping(mapResult, keyPrefix, mapFunction, mapContext) {
  this.result = mapResult;
  this.keyPrefix = keyPrefix;
  this.func = mapFunction;
  this.context = mapContext;
  this.count = 0;
}
MapBookKeeping.prototype.destructor = function() {
  this.result = null;
  this.keyPrefix = null;
  this.func = null;
  this.context = null;
  this.count = 0;
};
addPoolingTo(MapBookKeeping, fourArgumentPooler);

function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  var result = bookKeeping.result;
  var keyPrefix = bookKeeping.keyPrefix;
  var func = bookKeeping.func;
  var context = bookKeeping.context;

  var mappedChild = func.call(context, child, bookKeeping.count++);
  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(
      mappedChild,
      result,
      childKey,
      emptyFunction.thatReturnsArgument
    );
  } else if (mappedChild != null) {
    if (React.isValidElement(mappedChild)) {
      mappedChild = cloneAndReplaceKey(
        mappedChild,
        // Keep both the (mapped) and old keys if they differ, just as
        // traverseAllChildren used to do for objects as children
        keyPrefix +
          (mappedChild.key && (!child || child.key !== mappedChild.key)
            ? escapeUserProvidedKey(mappedChild.key) + '/'
            : '') +
          childKey
      );
    }
    result.push(mappedChild);
  }
}

function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  var escapedPrefix = '';
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }
  var traverseContext = MapBookKeeping.getPooled(
    array,
    escapedPrefix,
    func,
    context
  );
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  MapBookKeeping.release(traverseContext);
}

var numericPropertyRegex = /^\d+$/;

var warnedAboutNumeric = false;

function createReactFragment(object) {
  if (typeof object !== 'object' || !object || Array.isArray(object)) {
    warning(
      false,
      'React.addons.createFragment only accepts a single object. Got: %s',
      object
    );
    return object;
  }
  if (React.isValidElement(object)) {
    warning(
      false,
      'React.addons.createFragment does not accept a ReactElement ' +
        'without a wrapper object.'
    );
    return object;
  }

  invariant(
    object.nodeType !== 1,
    'React.addons.createFragment(...): Encountered an invalid child; DOM ' +
      'elements are not valid children of React components.'
  );

  var result = [];

  for (var key in object) {
    if (true) {
      if (!warnedAboutNumeric && numericPropertyRegex.test(key)) {
        warning(
          false,
          'React.addons.createFragment(...): Child objects should have ' +
            'non-numeric keys so ordering is preserved.'
        );
        warnedAboutNumeric = true;
      }
    }
    mapIntoWithKeyPrefixInternal(
      object[key],
      result,
      key,
      emptyFunction.thatReturnsArgument
    );
  }

  return result;
}

module.exports = createReactFragment;


/***/ }),

/***/ "./node_modules/react-icon-base/lib/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var IconBase = function IconBase(_ref, _ref2) {
  var children = _ref.children;
  var color = _ref.color;
  var size = _ref.size;
  var style = _ref.style;

  var props = _objectWithoutProperties(_ref, ['children', 'color', 'size', 'style']);

  var _ref2$reactIconBase = _ref2.reactIconBase;
  var reactIconBase = _ref2$reactIconBase === undefined ? {} : _ref2$reactIconBase;

  var computedSize = size || reactIconBase.size || '1em';
  return _react2.default.createElement('svg', _extends({
    children: children,
    fill: 'currentColor',
    preserveAspectRatio: 'xMidYMid meet',
    height: computedSize,
    width: computedSize
  }, reactIconBase, props, {
    style: _extends({
      verticalAlign: 'middle',
      color: color || reactIconBase.color
    }, reactIconBase.style || {}, style)
  }));
};

IconBase.propTypes = {
  color: _propTypes2.default.string,
  size: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  style: _propTypes2.default.object
};

IconBase.contextTypes = {
  reactIconBase: _propTypes2.default.shape(IconBase.propTypes)
};

exports.default = IconBase;
module.exports = exports['default'];

/***/ }),

/***/ "./node_modules/react-icons/lib/md/assignment.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reactIconBase = __webpack_require__("./node_modules/react-icon-base/lib/index.js");

var _reactIconBase2 = _interopRequireDefault(_reactIconBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MdAssignment = function MdAssignment(props) {
    return _react2.default.createElement(
        _reactIconBase2.default,
        _extends({ viewBox: '0 0 40 40' }, props),
        _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement('path', { d: 'm28.4 15v-3.4h-16.8v3.4h16.8z m0 6.6v-3.2h-16.8v3.2h16.8z m-5 6.8v-3.4h-11.8v3.4h11.8z m-3.4-23.4c-0.9 0-1.6 0.7-1.6 1.6s0.7 1.8 1.6 1.8 1.6-0.8 1.6-1.8-0.7-1.6-1.6-1.6z m11.6 0c1.8 0 3.4 1.6 3.4 3.4v23.2c0 1.8-1.6 3.4-3.4 3.4h-23.2c-1.8 0-3.4-1.6-3.4-3.4v-23.2c0-1.8 1.6-3.4 3.4-3.4h6.9c0.7-2 2.5-3.4 4.7-3.4s4 1.4 4.7 3.4h6.9z' })
        )
    );
};

exports.default = MdAssignment;
module.exports = exports['default'];

/***/ }),

/***/ "./node_modules/react-icons/lib/md/comment.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reactIconBase = __webpack_require__("./node_modules/react-icon-base/lib/index.js");

var _reactIconBase2 = _interopRequireDefault(_reactIconBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MdComment = function MdComment(props) {
    return _react2.default.createElement(
        _reactIconBase2.default,
        _extends({ viewBox: '0 0 40 40' }, props),
        _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement('path', { d: 'm30 13.4v-3.4h-20v3.4h20z m0 5v-3.4h-20v3.4h20z m0 5v-3.4h-20v3.4h20z m6.6-16.8v30l-6.6-6.6h-23.4c-1.8 0-3.2-1.6-3.2-3.4v-20c0-1.8 1.4-3.2 3.2-3.2h26.8c1.8 0 3.2 1.4 3.2 3.2z' })
        )
    );
};

exports.default = MdComment;
module.exports = exports['default'];

/***/ }),

/***/ "./node_modules/react-icons/lib/md/help-outline.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reactIconBase = __webpack_require__("./node_modules/react-icon-base/lib/index.js");

var _reactIconBase2 = _interopRequireDefault(_reactIconBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MdHelpOutline = function MdHelpOutline(props) {
    return _react2.default.createElement(
        _reactIconBase2.default,
        _extends({ viewBox: '0 0 40 40' }, props),
        _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement('path', { d: 'm20 10c3.7 0 6.6 3 6.6 6.6 0 4.2-5 4.7-5 8.4h-3.2c0-5.4 5-5 5-8.4 0-1.8-1.6-3.2-3.4-3.2s-3.4 1.4-3.4 3.2h-3.2c0-3.6 2.9-6.6 6.6-6.6z m0 23.4c7.3 0 13.4-6.1 13.4-13.4s-6.1-13.4-13.4-13.4-13.4 6.1-13.4 13.4 6.1 13.4 13.4 13.4z m0-30c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z m-1.6 26.6v-3.4h3.2v3.4h-3.2z' })
        )
    );
};

exports.default = MdHelpOutline;
module.exports = exports['default'];

/***/ }),

/***/ "./node_modules/react-icons/lib/md/home.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reactIconBase = __webpack_require__("./node_modules/react-icon-base/lib/index.js");

var _reactIconBase2 = _interopRequireDefault(_reactIconBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MdHome = function MdHome(props) {
    return _react2.default.createElement(
        _reactIconBase2.default,
        _extends({ viewBox: '0 0 40 40' }, props),
        _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement('path', { d: 'm16.6 33.4h-8.2v-13.4h-5l16.6-15 16.6 15h-5v13.4h-8.2v-10h-6.8v10z' })
        )
    );
};

exports.default = MdHome;
module.exports = exports['default'];

/***/ }),

/***/ "./node_modules/react-icons/lib/md/public.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reactIconBase = __webpack_require__("./node_modules/react-icon-base/lib/index.js");

var _reactIconBase2 = _interopRequireDefault(_reactIconBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MdPublic = function MdPublic(props) {
    return _react2.default.createElement(
        _reactIconBase2.default,
        _extends({ viewBox: '0 0 40 40' }, props),
        _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement('path', { d: 'm29.8 29c2.2-2.4 3.6-5.6 3.6-9 0-5.5-3.5-10.4-8.4-12.3v0.7c0 1.8-1.6 3.2-3.4 3.2h-3.2v3.4c0 0.9-0.8 1.6-1.8 1.6h-3.2v3.4h10c0.9 0 1.6 0.7 1.6 1.6v5h1.6c1.5 0 2.8 1.1 3.2 2.4z m-11.4 4.2v-3.2c-1.8 0-3.4-1.6-3.4-3.4v-1.6l-8-8c-0.2 1-0.4 2-0.4 3 0 6.8 5.2 12.4 11.8 13.2z m1.6-29.8c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z' })
        )
    );
};

exports.default = MdPublic;
module.exports = exports['default'];

/***/ }),

/***/ "./node_modules/react-icons/lib/md/visibility-off.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reactIconBase = __webpack_require__("./node_modules/react-icon-base/lib/index.js");

var _reactIconBase2 = _interopRequireDefault(_reactIconBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MdVisibilityOff = function MdVisibilityOff(props) {
    return _react2.default.createElement(
        _reactIconBase2.default,
        _extends({ viewBox: '0 0 40 40' }, props),
        _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement('path', { d: 'm19.8 15h0.2c2.7 0 5 2.3 5 5v0.3z m-7.2 1.3c-0.6 1.1-1 2.4-1 3.7 0 4.6 3.8 8.4 8.4 8.4 1.3 0 2.6-0.4 3.7-1l-2.6-2.6c-0.3 0.1-0.7 0.2-1.1 0.2-2.7 0-5-2.3-5-5 0-0.4 0.1-0.8 0.2-1.1z m-9.2-9.2l2.1-2.1 29.5 29.5-2.1 2.1c-1.9-1.8-3.8-3.6-5.6-5.5-2.3 0.9-4.7 1.4-7.3 1.4-8.4 0-15.5-5.2-18.4-12.5 1.4-3.3 3.6-6.1 6.3-8.3-1.5-1.5-3-3.1-4.5-4.6z m16.6 4.5c-1.1 0-2.1 0.3-3 0.7l-3.6-3.6c2-0.8 4.3-1.2 6.6-1.2 8.4 0 15.4 5.2 18.3 12.5-1.3 3.1-3.2 5.8-5.7 7.9l-4.9-4.9c0.4-0.9 0.7-1.9 0.7-3 0-4.6-3.8-8.4-8.4-8.4z' })
        )
    );
};

exports.default = MdVisibilityOff;
module.exports = exports['default'];

/***/ }),

/***/ "./node_modules/react-icons/lib/md/visibility.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reactIconBase = __webpack_require__("./node_modules/react-icon-base/lib/index.js");

var _reactIconBase2 = _interopRequireDefault(_reactIconBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MdVisibility = function MdVisibility(props) {
    return _react2.default.createElement(
        _reactIconBase2.default,
        _extends({ viewBox: '0 0 40 40' }, props),
        _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement('path', { d: 'm20 15c2.7 0 5 2.3 5 5s-2.3 5-5 5-5-2.3-5-5 2.3-5 5-5z m0 13.4c4.6 0 8.4-3.8 8.4-8.4s-3.8-8.4-8.4-8.4-8.4 3.8-8.4 8.4 3.8 8.4 8.4 8.4z m0-20.9c8.4 0 15.5 5.2 18.4 12.5-2.9 7.3-10 12.5-18.4 12.5s-15.5-5.2-18.4-12.5c2.9-7.3 10-12.5 18.4-12.5z' })
        )
    );
};

exports.default = MdVisibility;
module.exports = exports['default'];

/***/ }),

/***/ "./node_modules/strict-uri-encode/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function (str) {
	return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
		return '%' + c.charCodeAt(0).toString(16).toUpperCase();
	});
};


/***/ }),

/***/ "./node_modules/style-loader/addStyles.js":
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader 
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	}),
	getElement = (function(fn) {
		var memo = {};
		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}
			return memo[selector]
		};
	})(function (styleTarget) {
		return document.querySelector(styleTarget)
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__("./node_modules/style-loader/fixUrls.js");

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (typeof options.insertInto === "undefined") options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list, options);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list, options) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var styleTarget = getElement(options.insertInto)
	if (!styleTarget) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			styleTarget.insertBefore(styleElement, styleTarget.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			styleTarget.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		styleTarget.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove, transformResult;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    transformResult = options.transform(obj.css);
	    
	    if (transformResult) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = transformResult;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css. 
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "./node_modules/style-loader/fixUrls.js":
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ "./node_modules/styled-theme/composer.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./node_modules/styled-theme/dist/composer.js")


/***/ }),

/***/ "./node_modules/url-loader/index.js!./src/components/atoms/LogoImage/logo.svg":
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,bW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArICI0MDVhYWVlYjYyMTQ3MWM0MTQ0MWRiYmY4YmZlYmFmYi5zdmciOw=="

/***/ }),

/***/ "./src/components recursive \\.\\/[^\\/]+\\/[^\\/]+\\/index\\.js$":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./atoms/Bold/index.js": "./src/components/atoms/Bold/index.js",
	"./atoms/Button/index.js": "./src/components/atoms/Button/index.js",
	"./atoms/CanvasCircle/index.js": "./src/components/atoms/CanvasCircle/index.js",
	"./atoms/CanvasDelegate/index.js": "./src/components/atoms/CanvasDelegate/index.js",
	"./atoms/CanvasTriangle/index.js": "./src/components/atoms/CanvasTriangle/index.js",
	"./atoms/Caption/index.js": "./src/components/atoms/Caption/index.js",
	"./atoms/CedejWatermark/index.js": "./src/components/atoms/CedejWatermark/index.js",
	"./atoms/Checkbox/index.js": "./src/components/atoms/Checkbox/index.js",
	"./atoms/CircleSizesSymbol/index.js": "./src/components/atoms/CircleSizesSymbol/index.js",
	"./atoms/Content/index.js": "./src/components/atoms/Content/index.js",
	"./atoms/ContextualInfo/index.js": "./src/components/atoms/ContextualInfo/index.js",
	"./atoms/DesertName/index.js": "./src/components/atoms/DesertName/index.js",
	"./atoms/FacebookIcon/index.js": "./src/components/atoms/FacebookIcon/index.js",
	"./atoms/Heading/index.js": "./src/components/atoms/Heading/index.js",
	"./atoms/HomeNavLink/index.js": "./src/components/atoms/HomeNavLink/index.js",
	"./atoms/Icon/index.js": "./src/components/atoms/Icon/index.js",
	"./atoms/Label/index.js": "./src/components/atoms/Label/index.js",
	"./atoms/LegendCategoryName/index.js": "./src/components/atoms/LegendCategoryName/index.js",
	"./atoms/Link/index.js": "./src/components/atoms/Link/index.js",
	"./atoms/LoadingIcon/index.js": "./src/components/atoms/LoadingIcon/index.js",
	"./atoms/LogoImage/index.js": "./src/components/atoms/LogoImage/index.js",
	"./atoms/Markdown/index.js": "./src/components/atoms/Markdown/index.js",
	"./atoms/MarkdownContent/index.js": "./src/components/atoms/MarkdownContent/index.js",
	"./atoms/NavItem/index.js": "./src/components/atoms/NavItem/index.js",
	"./atoms/NavLink/index.js": "./src/components/atoms/NavLink/index.js",
	"./atoms/PDFIcon/index.js": "./src/components/atoms/PDFIcon/index.js",
	"./atoms/PNGIcon/index.js": "./src/components/atoms/PNGIcon/index.js",
	"./atoms/RangeSlider/index.js": "./src/components/atoms/RangeSlider/index.js",
	"./atoms/Reduced/index.js": "./src/components/atoms/Reduced/index.js",
	"./atoms/SmallScreensWarning/index.js": "./src/components/atoms/SmallScreensWarning/index.js",
	"./atoms/Spinner/index.js": "./src/components/atoms/Spinner/index.js",
	"./atoms/Svg/index.js": "./src/components/atoms/Svg/index.js",
	"./atoms/SvgIcon/index.js": "./src/components/atoms/SvgIcon/index.js",
	"./atoms/Td/index.js": "./src/components/atoms/Td/index.js",
	"./atoms/TemperatureLegendPattern/index.js": "./src/components/atoms/TemperatureLegendPattern/index.js",
	"./atoms/Th/index.js": "./src/components/atoms/Th/index.js",
	"./atoms/ToggleButton/index.js": "./src/components/atoms/ToggleButton/index.js",
	"./atoms/TrName/index.js": "./src/components/atoms/TrName/index.js",
	"./atoms/TrNameContent/index.js": "./src/components/atoms/TrNameContent/index.js",
	"./atoms/TwitterIcon/index.js": "./src/components/atoms/TwitterIcon/index.js",
	"./atoms/WaterLabel/index.js": "./src/components/atoms/WaterLabel/index.js",
	"./molecules/AtlasExportButton/index.js": "./src/components/molecules/AtlasExportButton/index.js",
	"./molecules/CanvasTiles/index.js": "./src/components/molecules/CanvasTiles/index.js",
	"./molecules/CirclesLegend/index.js": "./src/components/molecules/CirclesLegend/index.js",
	"./molecules/ContextualInfoPopup/index.js": "./src/components/molecules/ContextualInfoPopup/index.js",
	"./molecules/ExportPreview/index.js": "./src/components/molecules/ExportPreview/index.js",
	"./molecules/FixedPartnersLogo/index.js": "./src/components/molecules/FixedPartnersLogo/index.js",
	"./molecules/GeoJSONLabelsLayer/index.js": "./src/components/molecules/GeoJSONLabelsLayer/index.js",
	"./molecules/IconButton/index.js": "./src/components/molecules/IconButton/index.js",
	"./molecules/IconLink/index.js": "./src/components/molecules/IconLink/index.js",
	"./molecules/LayerFilterGroup/index.js": "./src/components/molecules/LayerFilterGroup/index.js",
	"./molecules/LegendContent/index.js": "./src/components/molecules/LegendContent/index.js",
	"./molecules/LegendMoreInfos/index.js": "./src/components/molecules/LegendMoreInfos/index.js",
	"./molecules/LegendMoreInfosPrint/index.js": "./src/components/molecules/LegendMoreInfosPrint/index.js",
	"./molecules/LegendToggleButton/index.js": "./src/components/molecules/LegendToggleButton/index.js",
	"./molecules/LegendTooltips/index.js": "./src/components/molecules/LegendTooltips/index.js",
	"./molecules/LoadingIndicator/index.js": "./src/components/molecules/LoadingIndicator/index.js",
	"./molecules/Modal/index.js": "./src/components/molecules/Modal/index.js",
	"./molecules/PartnersLogo/index.js": "./src/components/molecules/PartnersLogo/index.js",
	"./molecules/PrintCircleMonthRangeLegend/index.js": "./src/components/molecules/PrintCircleMonthRangeLegend/index.js",
	"./molecules/PrintOverlay/index.js": "./src/components/molecules/PrintOverlay/index.js",
	"./molecules/RangeSliderFilter/index.js": "./src/components/molecules/RangeSliderFilter/index.js",
	"./molecules/SidebarToggleButton/index.js": "./src/components/molecules/SidebarToggleButton/index.js",
	"./molecules/SocialSharing/index.js": "./src/components/molecules/SocialSharing/index.js",
	"./molecules/TemperaturesLegend/index.js": "./src/components/molecules/TemperaturesLegend/index.js",
	"./molecules/ToggleAridityVisibility/index.js": "./src/components/molecules/ToggleAridityVisibility/index.js",
	"./molecules/ToggleFilter/index.js": "./src/components/molecules/ToggleFilter/index.js",
	"./organisms/AridityFilters/index.js": "./src/components/organisms/AridityFilters/index.js",
	"./organisms/AridityTemperaturesLayer/index.js": "./src/components/organisms/AridityTemperaturesLayer/index.js",
	"./organisms/Atlas/index.js": "./src/components/organisms/Atlas/index.js",
	"./organisms/AtlasFilters/index.js": "./src/components/organisms/AtlasFilters/index.js",
	"./organisms/AtlasLegend/index.js": "./src/components/organisms/AtlasLegend/index.js",
	"./organisms/CircleSizesFilters/index.js": "./src/components/organisms/CircleSizesFilters/index.js",
	"./organisms/CircleTypesFilters/index.js": "./src/components/organisms/CircleTypesFilters/index.js",
	"./organisms/CirclesLayer/index.js": "./src/components/organisms/CirclesLayer/index.js",
	"./organisms/DesertLabelsLayer/index.js": "./src/components/organisms/DesertLabelsLayer/index.js",
	"./organisms/DryFilters/index.js": "./src/components/organisms/DryFilters/index.js",
	"./organisms/ExportModal/index.js": "./src/components/organisms/ExportModal/index.js",
	"./organisms/LakesRiversLayer/index.js": "./src/components/organisms/LakesRiversLayer/index.js",
	"./organisms/Navbar/index.js": "./src/components/organisms/Navbar/index.js",
	"./organisms/NavbarTabs/index.js": "./src/components/organisms/NavbarTabs/index.js",
	"./organisms/Sidebar/index.js": "./src/components/organisms/Sidebar/index.js",
	"./organisms/TemperaturesFilters/index.js": "./src/components/organisms/TemperaturesFilters/index.js",
	"./organisms/TutorialModal/index.js": "./src/components/organisms/TutorialModal/index.js",
	"./organisms/WaterLabelsLayer/index.js": "./src/components/organisms/WaterLabelsLayer/index.js",
	"./pages/ContentPage/index.js": "./src/components/pages/ContentPage/index.js",
	"./pages/HomePage/index.js": "./src/components/pages/HomePage/index.js",
	"./templates/PageTemplate/index.js": "./src/components/templates/PageTemplate/index.js"
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/components recursive \\.\\/[^\\/]+\\/[^\\/]+\\/index\\.js$";

/***/ }),

/***/ "./src/components/App.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  body {\n    margin: 0;\n  }\n  html, body, div, *{\n    box-sizing: border-box;\n  }\n  a {\n    cursor: pointer;\n  }\n  strong a {\n    font-weight: bold !important;\n  }\n  *[data-tip] {\n    cursor: help;\n    position: relative;\n    &:after {\n      content: \' \';\n      position: absolute;\n      bottom: -2px;\n      left: 2px;\n      right: 2px;\n      border-bottom: 1px dashed #BBB;\n\n    }\n  }\n  span[data-tip]:after {\n    left: 0;\n    right:0;\n  }\n\n  h6 {\n    font-size: 0.85rem !important;\n  }\n'], ['\n  body {\n    margin: 0;\n  }\n  html, body, div, *{\n    box-sizing: border-box;\n  }\n  a {\n    cursor: pointer;\n  }\n  strong a {\n    font-weight: bold !important;\n  }\n  *[data-tip] {\n    cursor: help;\n    position: relative;\n    &:after {\n      content: \' \';\n      position: absolute;\n      bottom: -2px;\n      left: 2px;\n      right: 2px;\n      border-bottom: 1px dashed #BBB;\n\n    }\n  }\n  span[data-tip]:after {\n    left: 0;\n    right:0;\n  }\n\n  h6 {\n    font-size: 0.85rem !important;\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  z-index: 10;\n  position: fixed;\n  top: ', 'px;\n  bottom: 0;\n  left: 0;\n  right: 0;\n'], ['\n  z-index: 10;\n  position: fixed;\n  top: ', 'px;\n  bottom: 0;\n  left: 0;\n  right: 0;\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  background: rgb(255,255,255);\n  top: ', 'px;\n  bottom: 0px;\n\n  position: fixed;\n  width: 100%;\n  overflow: auto;\n  padding-bottom: 50px;\n  z-index: 20;\n  transition: transform .2s ease-in-out;\n  transform: translate(0, ', ');\n\n'], ['\n  background: rgb(255,255,255);\n  top: ', 'px;\n  bottom: 0px;\n\n  position: fixed;\n  width: 100%;\n  overflow: auto;\n  padding-bottom: 50px;\n  z-index: 20;\n  transition: transform .2s ease-in-out;\n  transform: translate(0, ', ');\n\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__("./node_modules/react-router-dom/es/index.js");

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _components = __webpack_require__("./src/components/index.js");

var _containers = __webpack_require__("./src/containers/index.js");

var _default2 = __webpack_require__("./src/components/themes/default.js");

var _default3 = _interopRequireDefault(_default2);

var _styles = __webpack_require__("./src/utils/styles.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
// https://github.com/diegohaz/arc/wiki/Styling


(0, _styledComponents.injectGlobal)(_templateObject);

var AtlasHolder = _styledComponents2.default.div(_templateObject2, _styles.navbar.height);

var OverlayHolder = _styledComponents2.default.div(_templateObject3, _styles.navbar.height, function (_ref) {
  var visible = _ref.visible;
  return visible ? 0 : '100vh';
});

var App = function App() {
  return _react2.default.createElement(
    _styledComponents.ThemeProvider,
    { theme: _default3.default },
    _react2.default.createElement(
      _components.PageTemplate,
      null,
      _react2.default.createElement(_components.SmallScreensWarning, null),
      _react2.default.createElement(_components.ExportModal, null),
      _react2.default.createElement(
        AtlasHolder,
        { className: 'atlas-holder' },
        _react2.default.createElement(_containers.Atlas, null),
        _react2.default.createElement(_reactRouterDom.Route, { path: '/map', exact: true, children: function children(mapProps) {
            return _react2.default.createElement(_components.TutorialModal, { inMap: mapProps.match != null });
          } })
      ),
      _react2.default.createElement(_reactRouterDom.Route, { path: '/', exact: true, children: function children(homeProps) {
          var inHome = homeProps.match != null;
          return _react2.default.createElement(
            OverlayHolder,
            { className: 'home-page-holder', visible: inHome },
            _react2.default.createElement(_components.HomePage, null)
          );
        } }),
      _react2.default.createElement(_reactRouterDom.Route, { path: '/page', children: function children(pageProps) {
          var inPage = pageProps.match != null;
          return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              OverlayHolder,
              { className: 'content-page-holder', visible: inPage },
              inPage && _react2.default.createElement(_components.ContentPage, null)
            ),
            _react2.default.createElement(_components.FixedPartnersLogo, { visible: inPage })
          );
        } })
    )
  );
};

var _default = App;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(AtlasHolder, 'AtlasHolder', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/App.js');

  __REACT_HOT_LOADER__.register(OverlayHolder, 'OverlayHolder', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/App.js');

  __REACT_HOT_LOADER__.register(App, 'App', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/App.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/App.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/Bold/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  font-weight: bold;\n'], ['\n  font-weight: bold;\n']);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Bold = _styledComponents2.default.span(_templateObject);

var _default = Bold;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Bold, 'Bold', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Bold/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Bold/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/Button/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _templateObject = _taggedTemplateLiteral(['\n  display: inline-flex;\n  font-family: ', ';\n  align-items: center;\n  white-space: nowrap;\n  font-size: ', ';\n  border: 0.0625em solid ', ';\n  height: 2.5em;\n  justify-content: center;\n  text-decoration: none;\n  cursor: ', ';\n  appearance: none;\n  padding: 0 1em;\n  border-radius: 0.125em;\n  box-sizing: border-box;\n  pointer-events: ', ';\n  transition: background-color 250ms ease-out, color 250ms ease-out, border-color 250ms ease-out;\n  background-color: ', ';\n  color: ', ';\n\n  &:hover, &:focus, &:active {\n    background-color: ', ';\n    color: ', ';\n  }\n\n  &:focus {\n    outline: none\n  }\n'], ['\n  display: inline-flex;\n  font-family: ', ';\n  align-items: center;\n  white-space: nowrap;\n  font-size: ', ';\n  border: 0.0625em solid ', ';\n  height: 2.5em;\n  justify-content: center;\n  text-decoration: none;\n  cursor: ', ';\n  appearance: none;\n  padding: 0 1em;\n  border-radius: 0.125em;\n  box-sizing: border-box;\n  pointer-events: ', ';\n  transition: background-color 250ms ease-out, color 250ms ease-out, border-color 250ms ease-out;\n  background-color: ', ';\n  color: ', ';\n\n  &:hover, &:focus, &:active {\n    background-color: ', ';\n    color: ', ';\n  }\n\n  &:focus {\n    outline: none\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['', ''], ['', '']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _reactRouterDom = __webpack_require__("./node_modules/react-router-dom/es/index.js");

var _styledTheme = __webpack_require__("./node_modules/styled-theme/index.js");

var _styledTools = __webpack_require__("./node_modules/styled-tools/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var fontSize = function fontSize(_ref) {
  var height = _ref.height;
  return height / 40 + 'rem';
};

var backgroundColor = function backgroundColor(_ref2) {
  var transparent = _ref2.transparent,
      disabled = _ref2.disabled;
  return transparent ? 'transparent' : (0, _styledTheme.palette)(disabled ? 2 : 1);
};

var foregroundColor = function foregroundColor(_ref3) {
  var transparent = _ref3.transparent,
      disabled = _ref3.disabled;
  return transparent ? (0, _styledTheme.palette)(disabled ? 2 : 1) : (0, _styledTheme.palette)('grayscale', 0, true);
};

var hoverBackgroundColor = function hoverBackgroundColor(_ref4) {
  var disabled = _ref4.disabled,
      transparent = _ref4.transparent;
  return !disabled && !transparent && (0, _styledTheme.palette)(0);
};
var hoverForegroundColor = function hoverForegroundColor(_ref5) {
  var disabled = _ref5.disabled,
      transparent = _ref5.transparent;
  return !disabled && transparent && (0, _styledTheme.palette)(0);
};

var styles = (0, _styledComponents.css)(_templateObject, (0, _styledTheme.font)('primary'), fontSize, (0, _styledTools.ifProp)('transparent', 'currentcolor', 'transparent'), (0, _styledTools.ifProp)('disabled', 'default', 'pointer'), (0, _styledTools.ifProp)('disabled', 'none', 'auto'), backgroundColor, foregroundColor, hoverBackgroundColor, hoverForegroundColor);

var StyledLink = (0, _styledComponents2.default)(function (_ref6) {
  var disabled = _ref6.disabled,
      transparent = _ref6.transparent,
      reverse = _ref6.reverse,
      palette = _ref6.palette,
      height = _ref6.height,
      theme = _ref6.theme,
      props = _objectWithoutProperties(_ref6, ['disabled', 'transparent', 'reverse', 'palette', 'height', 'theme']);

  return _react2.default.createElement(_reactRouterDom.Link, props);
})(_templateObject2, styles);

var Anchor = _styledComponents2.default.a(_templateObject2, styles);
var StyledButton = _styledComponents2.default.button(_templateObject2, styles);

var Button = function Button(_ref7) {
  var type = _ref7.type,
      props = _objectWithoutProperties(_ref7, ['type']);

  if (props.to) {
    return _react2.default.createElement(StyledLink, props);
  } else if (props.href) {
    return _react2.default.createElement(Anchor, props);
  }
  return _react2.default.createElement(StyledButton, _extends({}, props, { type: type }));
};

Button.propTypes = {
  disabled: _propTypes2.default.bool,
  palette: _propTypes2.default.string,
  transparent: _propTypes2.default.bool,
  reverse: _propTypes2.default.bool,
  height: _propTypes2.default.number,
  type: _propTypes2.default.string,
  to: _propTypes2.default.string,
  href: _propTypes2.default.string
};

Button.defaultProps = {
  palette: 'primary',
  type: 'button',
  height: 40
};

var _default = Button;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(fontSize, 'fontSize', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Button/index.js');

  __REACT_HOT_LOADER__.register(backgroundColor, 'backgroundColor', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Button/index.js');

  __REACT_HOT_LOADER__.register(foregroundColor, 'foregroundColor', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Button/index.js');

  __REACT_HOT_LOADER__.register(hoverBackgroundColor, 'hoverBackgroundColor', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Button/index.js');

  __REACT_HOT_LOADER__.register(hoverForegroundColor, 'hoverForegroundColor', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Button/index.js');

  __REACT_HOT_LOADER__.register(styles, 'styles', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Button/index.js');

  __REACT_HOT_LOADER__.register(StyledLink, 'StyledLink', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Button/index.js');

  __REACT_HOT_LOADER__.register(Anchor, 'Anchor', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Button/index.js');

  __REACT_HOT_LOADER__.register(StyledButton, 'StyledButton', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Button/index.js');

  __REACT_HOT_LOADER__.register(Button, 'Button', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Button/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Button/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/CanvasCircle/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CanvasCircle = function (_Component) {
  _inherits(CanvasCircle, _Component);

  function CanvasCircle() {
    _classCallCheck(this, CanvasCircle);

    return _possibleConstructorReturn(this, (CanvasCircle.__proto__ || Object.getPrototypeOf(CanvasCircle)).apply(this, arguments));
  }

  _createClass(CanvasCircle, [{
    key: 'draw',
    value: function draw(canvas) {
      var _props = this.props,
          strokeWidth = _props.strokeWidth,
          stroke = _props.stroke,
          radius = _props.radius;

      var ctx = canvas.getContext('2d');
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.beginPath();
      ctx.arc(radius + strokeWidth, radius + strokeWidth, radius, 0, Math.PI * 2, false);
      ctx.stroke();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          width = _props2.width,
          height = _props2.height,
          props = _objectWithoutProperties(_props2, ['width', 'height']);

      return _react2.default.createElement('canvas', _extends({}, props, {
        width: width,
        height: height,
        ref: function ref(_ref) {
          return _this2.draw(_ref);
        } }));
    }
  }]);

  return CanvasCircle;
}(_react.Component);

CanvasCircle.propTypes = {
  width: _propTypes2.default.number.isRequired,
  height: _propTypes2.default.number.isRequired,
  radius: _propTypes2.default.number.isRequired,
  stroke: _propTypes2.default.string,
  strokeWidth: _propTypes2.default.number,
  style: _propTypes2.default.objet
};
CanvasCircle.defaultProps = {
  stroke: '#BBB',
  strokeWidth: 1
};
var _default = CanvasCircle;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(CanvasCircle, 'CanvasCircle', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/CanvasCircle/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/CanvasCircle/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/CanvasDelegate/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d3Path = __webpack_require__("./node_modules/d3-path/index.js");

var _geojsonVt = __webpack_require__("./node_modules/geojson-vt/src/index.js");

var _geojsonVt2 = _interopRequireDefault(_geojsonVt);

var _utils = __webpack_require__("./src/utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CanvasDelegate = function () {
  function CanvasDelegate(data) {
    _classCallCheck(this, CanvasDelegate);

    this.tiled = {};
    this.tileOptions = {
      maxZoom: 7,
      tolerance: 2,
      extent: 4096,
      buffer: 64,
      debug: 0,
      indexMaxZoom: 3,
      indexMaxPoints: 10000,
      solidChildren: false
    };
    this.processData(data);
  }

  _createClass(CanvasDelegate, [{
    key: 'processData',
    value: function processData(data) {
      var _this = this;

      Object.keys(data).forEach(function (key) {
        _this.tiled[key] = (0, _geojsonVt2.default)(data[key], _this.tileOptions);
      });
    }
  }, {
    key: 'getTileFeatures',
    value: function getTileFeatures(_ref) {
      var _this2 = this;

      var x = _ref.x,
          y = _ref.y,
          z = _ref.z;

      var res = {};
      Object.keys(this.tiled).forEach(function (key) {
        var fTiled = _this2.tiled[key].getTile(z, x, y);
        res[key] = fTiled ? fTiled.features : [];
      });
      return res;
    }
  }, {
    key: 'createCanvas',
    value: function createCanvas(modelCanvas) {
      var canvas = document.createElement('canvas');
      canvas.width = modelCanvas.width;
      canvas.height = modelCanvas.height;
      return canvas;
    }
  }, {
    key: 'setLayer',
    value: function setLayer(layer) {
      this.layer = layer;
    }
  }, {
    key: 'updateData',
    value: function updateData(data) {
      this.processData(data);
    }
  }, {
    key: 'draw',
    value: function draw() {
      throw new Error('You have to implement the draw method !');
    }
  }, {
    key: 'drawPath',
    value: function drawPath(feature, ctx) {
      var pad = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      var type = feature.type;
      var ratio = ctx.canvas.height / 4096;
      var path = (0, _d3Path.path)();
      var j = 0;
      var k = 0;
      var glen = feature.geometry.length;
      for (j; j < feature.geometry.length; j += 1) {
        var geom = feature.geometry[j];
        var sglen = geo.length;
        if (type === 1) {
          path.arc(geom[0] * ratio + pad, geom[1] * ratio + pad, 2, 0, 2 * Math.PI, false);
          continue;
        }

        for (k = 0; k < sglen; k += 1) {
          var p = geom[k];
          if (k) {
            path.lineTo(p[0] * ratio + pad, p[1] * ratio + pad);
          } else {
            path.moveTo(p[0] * ratio + pad, p[1] * ratio + pad);
          }
        }
      }
      return path;
    }
  }, {
    key: 'drawArea',
    value: function drawArea(_ref2) {
      var context = _ref2.context,
          area = _ref2.area,
          fillStyle = _ref2.fillStyle,
          strokeStyle = _ref2.strokeStyle,
          _ref2$strokeWidth = _ref2.strokeWidth,
          strokeWidth = _ref2$strokeWidth === undefined ? 1 : _ref2$strokeWidth;

      context.lineWidth = strokeWidth;
      context.fillStyle = fillStyle;
      if (strokeStyle) {
        context.strokeStyle = strokeStyle;
      }
      var path = new Path2D(this.drawPath(area, context));
      if (strokeWidth > 0) {
        context.stroke(path);
      }
      context.fill(path, 'evenodd');
    }
  }, {
    key: 'drawAreas',
    value: function drawAreas(_ref3) {
      var context = _ref3.context,
          features = _ref3.features,
          fillStyle = _ref3.fillStyle,
          strokeStyle = _ref3.strokeStyle,
          _ref3$strokeWidth = _ref3.strokeWidth,
          strokeWidth = _ref3$strokeWidth === undefined ? 1 : _ref3$strokeWidth,
          stopCondition = _ref3.stopCondition;

      var i = 0;
      var n = features.length;
      for (i; i < n; i++) {
        var area = features[i];
        if (stopCondition) {
          if (stopCondition(area)) {
            continue;
          }
        }

        var fill = (0, _utils.isFunction)(fillStyle) ? fillStyle(area) : fillStyle;
        var stroke = (0, _utils.isFunction)(strokeStyle) ? strokeStyle(area) : strokeStyle;
        var strokeW = (0, _utils.isFunction)(strokeWidth) ? strokeWidth(area) : strokeWidth;
        // draw zones with different colors to do
        this.drawArea({
          area: area,
          context: context,
          fillStyle: fill,
          strokeStyle: stroke,
          strokeWidth: strokeW
        });
      }
    }
  }]);

  return CanvasDelegate;
}();

var _default = CanvasDelegate;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(CanvasDelegate, 'CanvasDelegate', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/CanvasDelegate/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/CanvasDelegate/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/CanvasTriangle/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CanvasTriangle = function (_Component) {
  _inherits(CanvasTriangle, _Component);

  function CanvasTriangle() {
    _classCallCheck(this, CanvasTriangle);

    return _possibleConstructorReturn(this, (CanvasTriangle.__proto__ || Object.getPrototypeOf(CanvasTriangle)).apply(this, arguments));
  }

  _createClass(CanvasTriangle, [{
    key: 'draw',
    value: function draw(canvas) {
      var _props = this.props,
          strokeWidth = _props.strokeWidth,
          stroke = _props.stroke,
          radius = _props.radius;

      var ctx = canvas.getContext('2d');
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.beginPath();
      ctx.moveTo(strokeWidth, strokeWidth);
      ctx.lineTo(radius * 2, strokeWidth);
      ctx.lineTo(radius, radius * 2);
      ctx.lineTo(strokeWidth, strokeWidth);
      ctx.stroke();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          width = _props2.width,
          height = _props2.height,
          props = _objectWithoutProperties(_props2, ['width', 'height']);

      return _react2.default.createElement('canvas', _extends({}, props, {
        width: width,
        height: height,
        ref: function ref(_ref) {
          return _this2.draw(_ref);
        } }));
    }
  }]);

  return CanvasTriangle;
}(_react.Component);

CanvasTriangle.propTypes = {
  width: _propTypes2.default.number.isRequired,
  height: _propTypes2.default.number.isRequired,
  radius: _propTypes2.default.number.isRequired,
  stroke: _propTypes2.default.string,
  strokeWidth: _propTypes2.default.number,
  style: _propTypes2.default.object
};
CanvasTriangle.defaultProps = {
  stroke: '#BBB',
  strokeWidth: 1
};
var _default = CanvasTriangle;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(CanvasTriangle, 'CanvasTriangle', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/CanvasTriangle/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/CanvasTriangle/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/Caption/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  font-family: ', ';\n  color: ', ';\n  font-weight: 500;\n  line-height: 2rem;\n  font-size: 0.875rem;\n  text-transform: uppercase;\n'], ['\n  font-family: ', ';\n  color: ', ';\n  font-weight: 500;\n  line-height: 2rem;\n  font-size: 0.875rem;\n  text-transform: uppercase;\n']);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledTheme = __webpack_require__("./node_modules/styled-theme/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Caption = _styledComponents2.default.caption(_templateObject, (0, _styledTheme.font)('primary'), (0, _styledTheme.palette)('grayscale', 1));

Caption.propTypes = {
  reverse: _propTypes2.default.bool
};

var _default = Caption;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Caption, 'Caption', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Caption/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Caption/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/CedejWatermark/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _leaflet = __webpack_require__("./node_modules/leaflet/dist/leaflet-src.js");

var _reactLeaflet = __webpack_require__("./node_modules/react-leaflet/es/index.js");

var _images = __webpack_require__("./src/images/index.js");

__webpack_require__("./src/components/atoms/CedejWatermark/styles.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Watermark = _leaflet.Control.extend({
  options: {
    position: 'bottomright',
    logoUrl: '',
    logoAltText: ''

  },

  onAdd: function onAdd(map) {
    var className = 'leaflet-watermark';
    var container = _leaflet.DomUtil.create('div', className);
    var options = this.options;
    container.style.width = options.width + 'px';
    this._addWatermark(options, className + '-link', container);
    return container;
  },

  _addWatermark: function _addWatermark(options, className, container) {
    var watermark = _leaflet.DomUtil.create('a', className, container);
    var image = _leaflet.DomUtil.create('img', null, watermark);
    image.src = options.logoUrl;
    image.alt = options.logoTitle;
    watermark.target = '_blank';
    watermark.href = options.linkUrl;
    watermark.title = options.linkTitle;
  }
});

var CedejWatermark = function (_MapControl) {
  _inherits(CedejWatermark, _MapControl);

  function CedejWatermark() {
    _classCallCheck(this, CedejWatermark);

    return _possibleConstructorReturn(this, (CedejWatermark.__proto__ || Object.getPrototypeOf(CedejWatermark)).apply(this, arguments));
  }

  _createClass(CedejWatermark, [{
    key: 'createLeafletElement',
    value: function createLeafletElement(props) {
      return new Watermark(_extends({
        logoUrl: _images.Watermark,
        logoAlt: 'Logo du CEDEJ',
        linkUrl: 'http://cedej-eg.org/',
        linkTitle: 'Visiter le site du CEDEJ'
      }, props));
    }
  }]);

  return CedejWatermark;
}(_reactLeaflet.MapControl);

CedejWatermark.propTypes = {
  width: _propTypes2.default.number,
  logoUrl: _propTypes2.default.string,
  logoTitle: _propTypes2.default.string,
  linkUrl: _propTypes2.default.string,
  linkTitle: _propTypes2.default.string
};
CedejWatermark.defaultProps = {
  width: 50
};
var _default = CedejWatermark;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Watermark, 'Watermark', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/CedejWatermark/index.js');

  __REACT_HOT_LOADER__.register(CedejWatermark, 'CedejWatermark', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/CedejWatermark/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/CedejWatermark/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/CedejWatermark/styles.css":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/happypack/loader.js?id=css-81af377f!./src/components/atoms/CedejWatermark/styles.css");
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__("./node_modules/style-loader/addStyles.js")(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("./node_modules/happypack/loader.js?id=css-81af377f!./src/components/atoms/CedejWatermark/styles.css", function() {
			var newContent = __webpack_require__("./node_modules/happypack/loader.js?id=css-81af377f!./src/components/atoms/CedejWatermark/styles.css");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/components/atoms/Checkbox/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n'], ['\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  font-family: ', ';\n  font-size: 0.7rem;\n  & * {\n    cursor: ', ';\n  }\n'], ['\n  font-family: ', ';\n  font-size: 0.7rem;\n  & * {\n    cursor: ', ';\n  }\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledTheme = __webpack_require__("./node_modules/styled-theme/index.js");

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Check = _styledComponents2.default.input.attrs({
  type: 'checkbox'
})(_templateObject);

var Wrapper = _styledComponents2.default.span(_templateObject2, (0, _styledTheme.font)('primary'), function (_ref) {
  var disabled = _ref.disabled;
  return disabled ? 'not-allowed' : 'pointer';
});

var Checkbox = function (_Component) {
  _inherits(Checkbox, _Component);

  function Checkbox() {
    _classCallCheck(this, Checkbox);

    return _possibleConstructorReturn(this, (Checkbox.__proto__ || Object.getPrototypeOf(Checkbox)).apply(this, arguments));
  }

  _createClass(Checkbox, [{
    key: 'onChange',
    value: function onChange(event) {
      var _this2 = this;

      this.props.onBeforeChange && this.props.onBeforeChange();
      setTimeout(function () {
        _this2.props.onChange && _this2.props.onChange();
      }, 100);
    }
  }, {
    key: 'bindLabel',
    value: function bindLabel(label) {
      var _this3 = this;

      if (!this.label) {
        this.label = label;
        this.label.onclick = function () {
          if (!_this3.props.disabled) {
            _this3.input.value = _this3.input.value === 'on' ? 'off' : 'on';
            _this3.input.checked = !_this3.input.checked;
            _this3.onChange();
          }
        };
      }
    }
  }, {
    key: 'bindInput',
    value: function bindInput(input) {
      var _this4 = this;

      if (this.props && !this.input) {
        this.input = input;
        this.input.checked = this.props.checked;
        this.input.value = this.props.checked ? 'on' : 'off';
        this.input.onclick = function (e) {
          // this.input.checked = !this.input.checked;
          _this4.onChange();
        };
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      return _react2.default.createElement(
        Wrapper,
        { disabled: this.props.disabled },
        _react2.default.createElement('input', { type: 'checkbox',
          ref: function ref(_ref2) {
            return _this5.bindInput(_ref2);
          },
          disabled: this.props.disabled }),
        _react2.default.createElement(
          'label',
          { ref: function ref(_ref3) {
              return _this5.bindLabel(_ref3);
            } },
          this.props.label
        )
      );
    }
  }]);

  return Checkbox;
}(_react.Component);

Checkbox.propTypes = {
  onChange: _propTypes2.default.func,
  onBeforeChange: _propTypes2.default.func,
  disabled: _propTypes2.default.bool,
  checked: _propTypes2.default.bool
};
var _default = Checkbox;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Check, 'Check', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Checkbox/index.js');

  __REACT_HOT_LOADER__.register(Wrapper, 'Wrapper', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Checkbox/index.js');

  __REACT_HOT_LOADER__.register(Checkbox, 'Checkbox', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Checkbox/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Checkbox/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/CircleSizesSymbol/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

__webpack_require__("./src/components/atoms/CircleSizesSymbol/style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var baseShapeStyle = {
  fill: 'none',
  stroke: '#000000',
  strokeMiterlimit: 4,
  strokeLinejoin: 'miter',
  storkeOpacity: 1
};
var circleStyle = _extends({}, baseShapeStyle, {
  strokeWidth: 1,
  strokeDasharray: 'none'
});
var dashedCircleStyle = _extends({}, baseShapeStyle, {
  strokeWidth: 0.7,
  strokeDasharray: '3, 3',
  strokeDashoffset: 0
});

var triangleStyle = _extends({}, baseShapeStyle, {
  strokeWidth: 0.7
});

var CircleRangeSymbol = function CircleRangeSymbol(_ref) {
  var width = _ref.width,
      height = _ref.height;
  return _react2.default.createElement(
    'svg',
    {
      width: width,
      height: height,
      viewBox: '0 0 50 50' },
    _react2.default.createElement(
      'g',
      {
        transform: 'translate(0,-1002.3622)' },
      _react2.default.createElement('circle', {
        style: circleStyle,
        cy: 1027.3622,
        cx: 25,
        r: 24 }),
      _react2.default.createElement('circle', {
        style: dashedCircleStyle,
        cy: 1030,
        cx: 25,
        r: 20 }),
      _react2.default.createElement('circle', {
        style: _extends({}, dashedCircleStyle, {
          strokeDashoffset: 1.85
        }),
        cy: 1035,
        cx: 25,
        r: 15 }),
      _react2.default.createElement('path', {
        style: triangleStyle,
        d: 'm 15.80357,1031.648 9.696142,-0.062 9.696142,-0.062 -4.794069,8.4283 -4.794069,8.4283 -4.902073,-8.366 z',
        transform: 'matrix(0.99997317,0.00732457,-0.00732457,0.99997317,7.0566701,-0.15921565)' })
    )
  );
};

CircleRangeSymbol.propTypes = {
  width: _propTypes2.default.number,
  height: _propTypes2.default.number
};

var _default = CircleRangeSymbol;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(baseShapeStyle, 'baseShapeStyle', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/CircleSizesSymbol/index.js');

  __REACT_HOT_LOADER__.register(circleStyle, 'circleStyle', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/CircleSizesSymbol/index.js');

  __REACT_HOT_LOADER__.register(dashedCircleStyle, 'dashedCircleStyle', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/CircleSizesSymbol/index.js');

  __REACT_HOT_LOADER__.register(triangleStyle, 'triangleStyle', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/CircleSizesSymbol/index.js');

  __REACT_HOT_LOADER__.register(CircleRangeSymbol, 'CircleRangeSymbol', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/CircleSizesSymbol/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/CircleSizesSymbol/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/CircleSizesSymbol/style.css":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/happypack/loader.js?id=css-81af377f!./src/components/atoms/CircleSizesSymbol/style.css");
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__("./node_modules/style-loader/addStyles.js")(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("./node_modules/happypack/loader.js?id=css-81af377f!./src/components/atoms/CircleSizesSymbol/style.css", function() {
			var newContent = __webpack_require__("./node_modules/happypack/loader.js?id=css-81af377f!./src/components/atoms/CircleSizesSymbol/style.css");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/components/atoms/Content/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral([''], ['']),
    _templateObject2 = _taggedTemplateLiteral(['\n  font-family: ', ';\n  line-height: 1.5em;\n  & h1 {\n    font-size: 3.5em;\n    margin-top: ', ';\n  }\n\n  & h2 {\n    font-size: 2.2em;\n  }\n  p {\n    text-align: justify;\n  }\n  a {\n    color: ', ';\n    text-decoration: none;\n    &:hover {\n      text-decoration: underline;\n    }\n  }\n  \n  img {\n    max-width: 100%;\n  }\n  \n'], ['\n  font-family: ', ';\n  line-height: 1.5em;\n  & h1 {\n    font-size: 3.5em;\n    margin-top: ', ';\n  }\n\n  & h2 {\n    font-size: 2.2em;\n  }\n  p {\n    text-align: justify;\n  }\n  a {\n    color: ', ';\n    text-decoration: none;\n    &:hover {\n      text-decoration: underline;\n    }\n  }\n  \n  img {\n    max-width: 100%;\n  }\n  \n']);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledTheme = __webpack_require__("./node_modules/styled-theme/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Holder = _styledComponents2.default.div(_templateObject);

var Content = _styledComponents2.default.div(_templateObject2, (0, _styledTheme.font)('primary'), function (_ref) {
  var noTopPadding = _ref.noTopPadding;
  return noTopPadding ? 0 : '0.75em';
}, (0, _styledTheme.palette)('primary', 0));

var _default = Content;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Holder, 'Holder', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Content/index.js');

  __REACT_HOT_LOADER__.register(Content, 'Content', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Content/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Content/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/ContextualInfo/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n'], ['\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  list-style: none;\n  margin: 0;\n  padding:0;\n'], ['\n  list-style: none;\n  margin: 0;\n  padding:0;\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  margin: 0;\n  padding: 0;\n'], ['\n  margin: 0;\n  padding: 0;\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _circles = __webpack_require__("./src/utils/circles.js");

var circlesUtils = _interopRequireWildcard(_circles);

var _temperatures = __webpack_require__("./src/utils/temperatures.js");

var temperaturesUtils = _interopRequireWildcard(_temperatures);

var _aridity = __webpack_require__("./src/utils/aridity.js");

var aridityUtils = _interopRequireWildcard(_aridity);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Holder = _styledComponents2.default.div(_templateObject);

var InfoList = _styledComponents2.default.ul(_templateObject2);
var Info = _styledComponents2.default.li(_templateObject3);

var InfoRow = function InfoRow(_ref) {
  var title = _ref.title,
      info = _ref.info;
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'b',
      null,
      title,
      ':'
    ),
    '\xA0',
    info
  );
};

var TemperaturesInfo = function TemperaturesInfo(_ref2) {
  var Temperatur = _ref2.temperatures.properties.Temperatur;

  var summerRange = temperaturesUtils.getSummerRange(Temperatur);
  var winterRange = temperaturesUtils.getWinterRange(Temperatur);
  return _react2.default.createElement(
    Info,
    null,
    _react2.default.createElement(InfoRow, { title: 'Températures en été', info: _react2.default.createElement(
        'span',
        null,
        summerRange.length === 1 && _react2.default.createElement(
          'span',
          null,
          'Plus de ',
          summerRange[0],
          ' degr\xE9s'
        ),
        summerRange.length > 1 && _react2.default.createElement(
          'span',
          null,
          'Entre ',
          summerRange[0],
          ' et ',
          summerRange[1],
          ' degr\xE9s'
        )
      ) }),
    _react2.default.createElement(InfoRow, { title: 'Températures en hiver', info: _react2.default.createElement(
        'span',
        null,
        winterRange.length === 1 && _react2.default.createElement(
          'span',
          null,
          'Moins de ',
          winterRange[0],
          ' degr\xE9s'
        ),
        winterRange.length > 1 && _react2.default.createElement(
          'span',
          null,
          'Entre ',
          winterRange[0],
          ' et ',
          winterRange[1],
          ' degr\xE9s'
        )
      ) })
  );
};

var AridityInfo = function AridityInfo(_ref3) {
  var d_TYPE = _ref3.aridity.properties.d_TYPE;
  return _react2.default.createElement(
    Info,
    null,
    _react2.default.createElement(InfoRow, { title: 'Type d\'aridité', info: aridityUtils.getName(d_TYPE) })
  );
};

var CirclesInfo = function CirclesInfo(_ref4) {
  var _ref4$circles$propert = _ref4.circles.properties,
      size_ = _ref4$circles$propert.size_,
      colours = _ref4$circles$propert.colours;

  var droughtMonths = circlesUtils.getDroughtMonths(size_);
  return _react2.default.createElement(
    Info,
    null,
    _react2.default.createElement(InfoRow, { title: 'Régime de précipitation', info: _react2.default.createElement(
        'span',
        null,
        circlesUtils.droughtRegimeSingle(colours)
      ) }),
    _react2.default.createElement(InfoRow, { title: 'Nombre de mois de sécheresse', info: _react2.default.createElement(
        'span',
        null,
        size_ === '01' && _react2.default.createElement(
          'span',
          null,
          'Moins de \xA0'
        ),
        droughtMonths.length > 1 && _react2.default.createElement(
          'span',
          null,
          'De ',
          droughtMonths[0],
          ' \xE0 ',
          droughtMonths[1],
          '\xA0'
        ),
        droughtMonths.length === 1 && _react2.default.createElement(
          'span',
          null,
          droughtMonths[0],
          '\xA0'
        ),
        'mois'
      ) })
  );
};
var ContextualInfo = function ContextualInfo(_ref5) {
  var _ref5$data = _ref5.data,
      temperatures = _ref5$data.temperatures,
      aridity = _ref5$data.aridity,
      circles = _ref5$data.circles;

  if (!temperatures && !aridity && !circles) {
    return null;
  };
  return _react2.default.createElement(
    Holder,
    null,
    _react2.default.createElement(
      InfoList,
      null,
      temperatures && _react2.default.createElement(TemperaturesInfo, { temperatures: temperatures }),
      aridity && _react2.default.createElement(AridityInfo, { aridity: aridity }),
      circles && _react2.default.createElement(CirclesInfo, { circles: circles })
    )
  );
};

var _default = ContextualInfo;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Holder, 'Holder', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/ContextualInfo/index.js');

  __REACT_HOT_LOADER__.register(InfoList, 'InfoList', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/ContextualInfo/index.js');

  __REACT_HOT_LOADER__.register(Info, 'Info', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/ContextualInfo/index.js');

  __REACT_HOT_LOADER__.register(InfoRow, 'InfoRow', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/ContextualInfo/index.js');

  __REACT_HOT_LOADER__.register(TemperaturesInfo, 'TemperaturesInfo', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/ContextualInfo/index.js');

  __REACT_HOT_LOADER__.register(AridityInfo, 'AridityInfo', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/ContextualInfo/index.js');

  __REACT_HOT_LOADER__.register(CirclesInfo, 'CirclesInfo', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/ContextualInfo/index.js');

  __REACT_HOT_LOADER__.register(ContextualInfo, 'ContextualInfo', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/ContextualInfo/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/ContextualInfo/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/DesertName/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  font-size: ', ';\n  text-shadow: ', '; \n  font-style: italic;\n'], ['\n  font-size: ', ';\n  text-shadow: ', '; \n  font-style: italic;\n']);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var getFontSize = function getFontSize(_ref) {
  var scalerank = _ref.desert.properties.scalerank;

  switch (scalerank) {
    case 1:
      return '2em';
    case 2:
      return '1.5em';
    case 3:
      return '1.25em';
    default:
      return '1em';
  }
};

var textBorders = ['0.01em 0 1px #FFF', '-0.01em 0 1px #FFF', '0 0.01em 1px #FFF', '0 -0.01em 1px #FFF', '0.01em 0.01em 1px #FFF', '-0.01em -0.01em 1px #FFF'].join(', ');
var DesertName = _styledComponents2.default.span(_templateObject, getFontSize, textBorders);
var _default = DesertName;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(getFontSize, 'getFontSize', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/DesertName/index.js');

  __REACT_HOT_LOADER__.register(textBorders, 'textBorders', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/DesertName/index.js');

  __REACT_HOT_LOADER__.register(DesertName, 'DesertName', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/DesertName/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/DesertName/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/FacebookIcon/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// took from https://github.com/simple-icons/simple-icons/ 
var Facebook = function Facebook(props) {
  return _react2.default.createElement(
    _components.SvgIcon,
    _extends({}, props, { viewBox: '0 0 24 24' }),
    _react2.default.createElement('path', { d: 'M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.408.593 24 1.324 24h11.494v-9.294H9.689v-3.621h3.129V8.41c0-3.099 1.894-4.785 4.659-4.785 1.325 0 2.464.097 2.796.141v3.24h-1.921c-1.5 0-1.792.721-1.792 1.771v2.311h3.584l-.465 3.63H16.56V24h6.115c.733 0 1.325-.592 1.325-1.324V1.324C24 .593 23.408 0 22.676 0' }),
    '  '
  );
};

var _default = Facebook;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Facebook, 'Facebook', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/FacebookIcon/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/FacebookIcon/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/Heading/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fontSize = undefined;

var _templateObject = _taggedTemplateLiteral(['\n  text-transform: ', ';\n  font-family: ', ';\n  font-weight: 500;\n  font-size: ', ';\n  margin: 0;\n  margin-top: 0.55714em;\n  margin-bottom: 0.27142em;\n  color: ', ';\n'], ['\n  text-transform: ', ';\n  font-family: ', ';\n  font-weight: 500;\n  font-size: ', ';\n  margin: 0;\n  margin-top: 0.55714em;\n  margin-bottom: 0.27142em;\n  color: ', ';\n']),
    _templateObject2 = _taggedTemplateLiteral(['', ''], ['', '']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledTheme = __webpack_require__("./node_modules/styled-theme/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var fontSize = exports.fontSize = function fontSize(_ref) {
  var level = _ref.level;
  return 0.75 + 1 * (1 / level) + 'rem';
};

var styles = (0, _styledComponents.css)(_templateObject, function (_ref2) {
  var uppercase = _ref2.uppercase;
  return uppercase ? 'uppercase' : 'none';
}, (0, _styledTheme.font)('primary'), fontSize, (0, _styledTheme.palette)({ grayscale: 0 }, 1));

var Heading = (0, _styledComponents2.default)(function (_ref3) {
  var level = _ref3.level,
      children = _ref3.children,
      reverse = _ref3.reverse,
      palette = _ref3.palette,
      theme = _ref3.theme,
      uppercase = _ref3.uppercase,
      props = _objectWithoutProperties(_ref3, ['level', 'children', 'reverse', 'palette', 'theme', 'uppercase']);

  return _react2.default.createElement('h' + level, props, children);
})(_templateObject2, styles);

Heading.propTypes = {
  uppercase: _propTypes2.default.bool,
  level: _propTypes2.default.number,
  children: _propTypes2.default.node,
  palette: _propTypes2.default.string,
  reverse: _propTypes2.default.bool
};

Heading.defaultProps = {
  level: 1,
  palette: 'grayscale',
  uppercase: false
};

var _default = Heading;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(fontSize, 'fontSize', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Heading/index.js');

  __REACT_HOT_LOADER__.register(styles, 'styles', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Heading/index.js');

  __REACT_HOT_LOADER__.register(Heading, 'Heading', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Heading/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Heading/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/HomeNavLink/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  background-color: ', ';\n  color: ', ';\n  &:hover:not(.active){\n    background-color: ', ';\n  }\n  &.active {\n    color: #000;\n    background-color: ', ';\n  }\n'], ['\n  background-color: ', ';\n  color: ', ';\n  &:hover:not(.active){\n    background-color: ', ';\n  }\n  &.active {\n    color: #000;\n    background-color: ', ';\n  }\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledTheme = __webpack_require__("./node_modules/styled-theme/index.js");

var _NavLink = __webpack_require__("./src/components/atoms/NavLink/index.js");

var _NavLink2 = _interopRequireDefault(_NavLink);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var HomeNavLink = (0, _styledComponents2.default)(_NavLink2.default)(_templateObject, (0, _styledTheme.palette)('white', 2), (0, _styledTheme.palette)('grayscale', 0), (0, _styledTheme.palette)('white', 0), (0, _styledTheme.palette)('grayscale', 4));

var _default = HomeNavLink;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(HomeNavLink, 'HomeNavLink', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/HomeNavLink/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/HomeNavLink/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/Icon/icons/close.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lineStyle = {
  strokeWidth: 2,
  strokeMitterlimit: 10
};
var CloseIcon = function CloseIcon(props) {
  return _react2.default.createElement(
    _components.SvgIcon,
    { viewBox: '0 0 32 32', style: {
        enableBackground: 'new 0 0 32 32'
      } },
    _react2.default.createElement('line', { style: lineStyle, x1: '8', y1: '8', x2: '24', y2: '24', fill: 'none' }),
    _react2.default.createElement('line', { style: lineStyle, x1: '24', y1: '8', x2: '8', y2: '24', fill: 'none' })
  );
};

var _default = CloseIcon;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(lineStyle, 'lineStyle', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Icon/icons/close.js');

  __REACT_HOT_LOADER__.register(CloseIcon, 'CloseIcon', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Icon/icons/close.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Icon/icons/close.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/Icon/icons/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.close = undefined;

var _close = __webpack_require__("./src/components/atoms/Icon/icons/close.js");

var _close2 = _interopRequireDefault(_close);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.close = _close2.default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }
}();

;

/***/ }),

/***/ "./src/components/atoms/Icon/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fontSize = undefined;

var _templateObject = _taggedTemplateLiteral(['\n  display: inline-block;\n  font-size: ', ';\n  color: ', ';\n  width: 1em;\n  height: 1em;\n  margin: 0.1em;\n  box-sizing: border-box;\n\n  & > svg {\n    width: 100%;\n    height: 100%;\n    fill: currentcolor;\n    stroke: currentcolor;\n  }\n'], ['\n  display: inline-block;\n  font-size: ', ';\n  color: ', ';\n  width: 1em;\n  height: 1em;\n  margin: 0.1em;\n  box-sizing: border-box;\n\n  & > svg {\n    width: 100%;\n    height: 100%;\n    fill: currentcolor;\n    stroke: currentcolor;\n  }\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledTheme = __webpack_require__("./node_modules/styled-theme/index.js");

var _styledTools = __webpack_require__("./node_modules/styled-tools/index.js");

var _icons = __webpack_require__("./src/components/atoms/Icon/icons/index.js");

var icons = _interopRequireWildcard(_icons);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var fontSize = exports.fontSize = function fontSize(_ref) {
  var height = _ref.height;
  return height ? height / 16 + 'rem' : '1.25em';
};

var Wrapper = _styledComponents2.default.span(_templateObject, fontSize, (0, _styledTools.ifProp)('palette', (0, _styledTheme.palette)({ grayscale: 0 }, 1), 'currentcolor'));

var Icon = function Icon(_ref2) {
  var icon = _ref2.icon,
      props = _objectWithoutProperties(_ref2, ['icon']);

  var SvgIcon = icons[icon];

  return _react2.default.createElement(
    Wrapper,
    props,
    _react2.default.createElement(SvgIcon, null)
  );
};

Icon.propTypes = {
  icon: _propTypes2.default.string.isRequired,
  height: _propTypes2.default.number,
  palette: _propTypes2.default.string,
  reverse: _propTypes2.default.bool
};

var _default = Icon;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(fontSize, 'fontSize', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Icon/index.js');

  __REACT_HOT_LOADER__.register(Wrapper, 'Wrapper', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Icon/index.js');

  __REACT_HOT_LOADER__.register(Icon, 'Icon', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Icon/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Icon/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/Label/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  font-family: ', ';\n  color: ', ';\n  font-size: 0.7rem;\n  line-height: 2em;\n'], ['\n  font-family: ', ';\n  color: ', ';\n  font-size: 0.7rem;\n  line-height: 2em;\n']);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledTheme = __webpack_require__("./node_modules/styled-theme/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Label = _styledComponents2.default.label(_templateObject, (0, _styledTheme.font)('primary'), (0, _styledTheme.palette)('grayscale', 1));

Label.propTypes = {
  reverse: _propTypes2.default.bool
};

var _default = Label;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Label, 'Label', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Label/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Label/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/LegendCategoryName/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  font-size: 0.85rem;\n  line-height: 0.9rem;\n  padding-top: 0.2rem;\n  display: block;\n'], ['\n  font-size: 0.85rem;\n  line-height: 0.9rem;\n  padding-top: 0.2rem;\n  display: block;\n']);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var LegendCategoryName = _styledComponents2.default.span(_templateObject);

var _default = LegendCategoryName;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(LegendCategoryName, 'LegendCategoryName', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/LegendCategoryName/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/LegendCategoryName/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/Link/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.styles = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _templateObject = _taggedTemplateLiteral(['\n  font-family: ', ';\n  text-decoration: none;\n  font-weight: 500;\n  color: ', ';\n\n  &:hover {\n    text-decoration: underline;\n  }\n\n  &.active {\n    color: ', ';\n  }\n'], ['\n  font-family: ', ';\n  text-decoration: none;\n  font-weight: 500;\n  color: ', ';\n\n  &:hover {\n    text-decoration: underline;\n  }\n\n  &.active {\n    color: ', ';\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['', ''], ['', '']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledTheme = __webpack_require__("./node_modules/styled-theme/index.js");

var _reactRouterDom = __webpack_require__("./node_modules/react-router-dom/es/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var styles = exports.styles = (0, _styledComponents.css)(_templateObject, (0, _styledTheme.font)('primary'), (0, _styledTheme.palette)({ grayscale: 0 }, 1), (0, _styledTheme.palette)({ primary: 0 }, 1));

var StyledLink = (0, _styledComponents2.default)(function (_ref) {
  var theme = _ref.theme,
      reverse = _ref.reverse,
      palette = _ref.palette,
      props = _objectWithoutProperties(_ref, ['theme', 'reverse', 'palette']);

  return _react2.default.createElement(_reactRouterDom.Link, props);
})(_templateObject2, styles);

var Anchor = _styledComponents2.default.a(_templateObject2, styles);

var Link = function Link(_ref2) {
  var to = _ref2.to,
      nodeKey = _ref2.nodeKey,
      href = _ref2.href,
      literal = _ref2.literal,
      props = _objectWithoutProperties(_ref2, ['to', 'nodeKey', 'href', 'literal']);

  var _to = to;
  if (href && href.startsWith('/')) {
    _to = href;
  }
  if (_to) {
    return _react2.default.createElement(StyledLink, _extends({ to: _to }, props));
  }
  return _react2.default.createElement(Anchor, _extends({ href: href }, props));
};

Link.propTypes = {
  nodeKey: _propTypes2.default.any,
  palette: _propTypes2.default.string,
  reverse: _propTypes2.default.bool,
  to: _propTypes2.default.string
};

Link.defaultProps = {
  palette: 'primary'
};

var _default = Link;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(styles, 'styles', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Link/index.js');

  __REACT_HOT_LOADER__.register(StyledLink, 'StyledLink', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Link/index.js');

  __REACT_HOT_LOADER__.register(Anchor, 'Anchor', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Link/index.js');

  __REACT_HOT_LOADER__.register(Link, 'Link', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Link/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Link/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/LoadingIcon/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n0%, 80%, 100% {\n  transform: scale(0);\n} 40% {\n  transform: scale(1.0);\n}\n'], ['\n0%, 80%, 100% {\n  transform: scale(0);\n} 40% {\n  transform: scale(1.0);\n}\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  text-align: center;\n  width: 100%;\n'], ['\n  text-align: center;\n  width: 100%;\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  width: 1em;\n  height: 1em;\n  background-color: ', ';\n  border-radius: 100%;\n  display: inline-block;\n  animation: ', ' 1.4s infinite ease-in-out both;\n  animation-delay: ', 's;\n'], ['\n  width: 1em;\n  height: 1em;\n  background-color: ', ';\n  border-radius: 100%;\n  display: inline-block;\n  animation: ', ' 1.4s infinite ease-in-out both;\n  animation-delay: ', 's;\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledTheme = __webpack_require__("./node_modules/styled-theme/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

// took from http://tobiasahlin.com/spinkit/
var bounce = (0, _styledComponents.keyframes)(_templateObject);

var Spinner = _styledComponents2.default.div(_templateObject2);

var color = function color(reverse) {
  return reverse ? 'white' : (0, _styledTheme.palette)('primary', 0);
};

var Dot = _styledComponents2.default.div(_templateObject3, function (_ref) {
  var reverse = _ref.reverse;
  return color(reverse);
}, bounce, function (_ref2) {
  var _ref2$delay = _ref2.delay,
      delay = _ref2$delay === undefined ? 0 : _ref2$delay;
  return delay;
});

var LoadingIcon = function LoadingIcon(_ref3) {
  var reverse = _ref3.reverse;
  return _react2.default.createElement(
    Spinner,
    null,
    _react2.default.createElement(Dot, { reverse: reverse, delay: -0.32 }),
    _react2.default.createElement(Dot, { reverse: reverse, delay: -0.16 }),
    _react2.default.createElement(Dot, { reverse: reverse })
  );
};

LoadingIcon.propTypes = {
  reverse: _propTypes2.default.bool
};

LoadingIcon.defaultProps = {
  reverse: false
};

var _default = LoadingIcon;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(bounce, 'bounce', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/LoadingIcon/index.js');

  __REACT_HOT_LOADER__.register(Spinner, 'Spinner', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/LoadingIcon/index.js');

  __REACT_HOT_LOADER__.register(color, 'color', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/LoadingIcon/index.js');

  __REACT_HOT_LOADER__.register(Dot, 'Dot', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/LoadingIcon/index.js');

  __REACT_HOT_LOADER__.register(LoadingIcon, 'LoadingIcon', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/LoadingIcon/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/LoadingIcon/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/LogoImage/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// eslint-disable-next-line import/no-webpack-loader-syntax


var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _logo = __webpack_require__("./node_modules/url-loader/index.js!./src/components/atoms/LogoImage/logo.svg");

var _logo2 = _interopRequireDefault(_logo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LogoImage = function LogoImage(props) {
  return _react2.default.createElement('img', _extends({ alt: 'Logo' }, props, { src: _logo2.default }));
};

var _default = LogoImage;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(LogoImage, 'LogoImage', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/LogoImage/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/LogoImage/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/Markdown/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reactMarkdown = __webpack_require__("./node_modules/react-markdown/src/react-markdown.js");

var _reactMarkdown2 = _interopRequireDefault(_reactMarkdown);

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var customRenderers = {
  Link: _components.Link
};

var Markdown = function Markdown(_ref) {
  var props = _objectWithoutProperties(_ref, []);

  return _react2.default.createElement(_reactMarkdown2.default, _extends({ renderers: customRenderers }, props));
};

var _default = Markdown;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(customRenderers, 'customRenderers', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Markdown/index.js');

  __REACT_HOT_LOADER__.register(Markdown, 'Markdown', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Markdown/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Markdown/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/MarkdownContent/content/about.md":
/***/ (function(module, exports) {

module.exports = "# À Propos\n\nLe **[Centre d’Études et de Documentation Économiques, Juridiques et sociales](cedej-eg.org)** (CEDEJ) est un centre de recherches en sciences humaines et sociales spécialisé sur l’Égypte contemporaine. Ce centre, créé en 1968, est implanté au Caire. Il constitue une Unité Mixte des Instituts Français de Recherche à l’Étranger (UMIFRE) placée sous la double tutelle du Ministère de l'Europe et des Affaires Etrangères (MEAE) ainsi que du Centre National de la Recherche Scientifique (CNRS) dont il constitue, depuis 2006, une Unité de Service et de Recherche, l’USR 3123.</br>\nAu sein du CEDEJ, Manal Ghoneim, Mahmoud Abdallah, Mohammed El-Samman et Mahmoud Hassab El-Nabi ont apporté une contribution décisive à la réalisation de la carte numérique mondiale de l'aridité.\n</br></br>\n\nLe **[Laboratoire Cognitions Humaine et Artificielle](http://www.cognition-usages.org/chart2/)** (CHArt) est une équipe interdisciplinaire regroupant des chercheurs en sciences cognitives, en mathématique et en informatique. Cette Équipe d’Accueil (EA 4004) placée sous quatre tutelles (EPHE, Université Paris 8, Université Paris 10, Université Paris 12) a comme objet d’étude les systèmes cognitifs naturels et artificiels ainsi que leurs interactions pragmatiques et sémantiques. </br>\n\n## Mentions légales\n\n### Éditeur du site\n[CEDEJ](http://cedej-eg.org/) </br>\nEtablissement à Autonomie financière</br>\nResponsable éditoriale : Hala Bayoumi </br>\nAdresse : Ministère de l'Europe et  des Affaires Etrangères, </br>\nService de la Valise diplomatique - Ambassade de France en République Arabe d’Egypte\nCEDEJ – Le Caire | 13 rue Louveau 92438 Chatillon Cedex </br>\nTéléphone : (00 202) 27 93 03 50</br>\nEmail : cedej@cedej-eg.org</br>\nSite web : www.cedej-eg.org</br>\n\n### Hébergement\nHébergeur : Github </br>\nSan Francisco - California - USA</br>\nwww.github.com</br>\n\n### Développement\n[Skoli](www.skoli.fr)</br>\nSiège : 11 rue Duphot – 69003 Lyon</br>\nAdresse professionnelle :\n9, rue de la Martinière 69001 - Lyon</br>\nTéléphone : + 33 (0)4 72 45 79 37</br>\nEmail : contact@skoli.fr</br>\nSite web : www.skoli.fr\n\n### Technologies utilisées\n\nApplication web :\n- [React](https://facebook.github.io/react/)\n- [React-Redux](http://redux.js.org/docs/basics/UsageWithReact.html)\n- [React-Router](https://github.com/ReactTraining/react-router)\n- [React-Markdown](https://github.com/rexxars/react-markdown)\n- [Whatwg-fetch](https://github.github.io/fetch/)\n- [Babel](https://babeljs.io/)\n- [Webpack](https://webpack.github.io/)\n- [jspdf](https://github.com/MrRio/jsPDF)\n- [html2canvas](https://github.com/niklasvh/html2canvas)\n- [styled-components](https://github.com/styled-components/styled-components)\n- [styled-theme](https://github.com/diegohaz/styled-theme)\n- [styled-tools](https://github.com/diegohaz/styled-tools)\n\n\nCartographie et visualisation :\n- [Leaflet](http://leafletjs.com/)\n- [Turf](http://turfjs.org/)\n- [React-Leaflet](https://github.com/PaulLeCam/react-leaflet)\n- [Leaflet-Image](https://github.com/mapbox/leaflet-image)\n- [GeojsonVT](https://github.com/mapbox/geojson-vt)\n- [d3-path](https://github.com/d3/d3-path)\n\n### Conditions d’utilisation\n\nLes cartes générées par cette interface doivent être utilisées en mentionnant « ©CEDEJ-2017 ».\n\n\n### Droits de propriété\nLes cartes générées à partir des données initiales restent la propriété intellectuelle de l’UNESCO.\n\nCette carte ne préjuge en rien du statut de tout territoire, de la souveraineté s’exerçant sur ce dernier, du tracé des frontières et limites internationales, et du nom de tout territoire, ville ou région.\n"

/***/ }),

/***/ "./src/components/atoms/MarkdownContent/content/modal.md":
/***/ (function(module, exports) {

module.exports = "Une première évaluation des **degrés d'aridité bioclimatique** à l'échelle mondiale est donnée par l'importance relative des précipitations et de l'évaporation et transpiration du sol et des plantes. </br>\n\nLa détermination des régions arides a été établie sur la base des valeurs du rapport P/Etp (calculé pour 1600 stations), dans lequel P représente le total des précipitations moyennes annuelles et Etp l'*évapotranspiration potentielle* calculée selon la formule de Penman. Le tracé des courbes limitant les zones d'aridité a été effectué en tenant compte des conditions locales du relief, des sols et de la végétation. </br>\nDans chacune des zones les **modalités de régime thermique** sont définies par la température moyenne (en °C.) du mois le plus froid (hiver) puis du mois le plus chaud (été) de l'année. </br>\n\nLa durée des **périodes de sécheresse** et le régime des précipitations sont indiqués par des cercles colorés pour un millier de stations représentatives.\n\n*Carte établie sous la coordination de l'Unesco préparée et réalisée par le Laboratoire de Cartographie thématique du CERCG, Centre National de la Recherche Scientifique, Paris, 1977*\n\nSource : Carte UNESCO, 1977.\n"

/***/ }),

/***/ "./src/components/atoms/MarkdownContent/content/participate.md":
/***/ (function(module, exports) {

module.exports = "# Participer\n\n*Aridity World Map* s’inscrit dans une démarche de science collaborative et partagée pour améliorer les connaissances sur l’aridité dans le monde. </br>\nLe CEDEJ invite le grand public et les experts à participer à l’alimentation et à la mise à jour de la base de données sur l’aridité à référence spatiale.\n\nMerci de soumettre toutes vos propositions de données à [cedej@cedej-eg.org](mailto:cedej@cedej-eg.org) en fournissant les informations suivantes : </br>\n- Pour les données sur l’aridité, renvoyez le formulaire à [télécharger ici](http://www.aridityworldmap.org/Formulaire-de-participation-WorldAridityMap.doc).\n\nUn comité scientifique réunissant des membres du CEDEJ et présidé par Madame Marie-Françoise COUREL examinera les informations reçues avant leur mise en ligne.\n"

/***/ }),

/***/ "./src/components/atoms/MarkdownContent/content/project.md":
/***/ (function(module, exports) {

module.exports = "# Le projet\n\nAridity World Map permet de créer des cartes personnalisables à différentes échelles, avec un calcul en temps réel des données relatives à l’aridité. Cette interface offre un support exceptionnel pour modéliser et envisager différents scenarii d’évolution des zones arides.\n\nCette carte interactive a été conçue à partir de la carte mondiale des zones arides et semi-arides, préparée au Laboratoire de cartographie thématique du CNRS et publiée en 1977 par l’UNESCO à l’échelle 1/25 000 000e. En analysant sa légende, deux laboratoires de recherche ont élaboré une base de données à référence spatiale (SIRS) : à Paris, le Laboratoire d’Informatique et de Systèmes Complexes (LaISC) de l’[École Pratique des Hautes Études](https://www.ephe.fr/) (EPHE) aujourd’hui devenu [Laboratoire Cognition Artificielle et humaine](http://www.cognition-usages.org/chart2/) (CHArt) et, au Caire, le [Centre d’Études et de Documentation Juridiques, Économiques et sociales](cedej-eg.org) (CEDEJ) rattaché au CNRS.\n\n## Les étapes\n\n- En 2011, à l’issue de la 3ème conférence internationale WATARID, le comité scientifique de la manifestation suggère la création d’une carte mondiale interactive des zones arides.\n\n- Entre 2011 et 2014, le CEDEJ et le LaISC se sont employés à constituer une base de données sur l’aridité à partir d’une lecture minutieuse et approfondie de la carte mondiale éditée par l’UNESCO. Cette carte (fig.1) combine plusieurs types de projections astronomiques et différents systèmes géodésiques : les régions du monde n’y sont pas représentées selon le même référentiel géographique. Une projection conforme bipolaire oblique est utilisée pour les Amériques tandis que le système Miller stéréographique aplati est employé pour le reste du monde.\n\n\n![Carte originale de l'Unesco](/images/Fig_1.jpg)\n\n- La première étape du travail accompli par le CEDEJ et le LaISC a consisté à établir un géoréférencement uniforme de l’image de la carte publiée par l’UNESCO selon le système géodésique mondial WGS84 (World Geodesic System 1984). Ce référentiel géographique WGS84 est associé au GPS et au type de projection UTM (Universal Transverse Mercator).\nLa carte initiale a ainsi été découpée en carrés, tous géoréférencés selon un unique référentiel géographique. Des algorithmes ont permis d’ajuster cette mosaïque  (fig.2) qui constitue une nouvelle image (*raster*).\n\n![Carte découpée en raster](/images/Fig_2.jpg)\n\nDans un second temps, cette nouvelle image a fait l’objet d’une digitalisation (vectorisation) de façon à mettre au point une carte digitalisée muette du monde (fig.3).\n\n![Carte digitalisée](/images/Fig_3.jpg)\n\n- A défaut de disposer d’une base de données numérique sur l’aridité, les équipes du CEDEJ et du LaISC ont entrepris la création de cette base à partir des informations fournies dans la carte éditée par l’UNESCO et sa légende, lesquelles croisent quatre variables : le type d’aridité, la température, le nombre de mois secs par an et le régime des précipitations.\nLes zones subhumides, arides et hyperarides de la carte de l’aridité (1977) ont chacune été identifiées et tracées selon un codage inédit pour construire une base de données à référence spatiale (SIRS). Cette base consigne, au moyen de calques (fig.4), toutes les caractéristiques propres aux critères de l’aridité définis dans le « Programme mondial  de recherches sur la zone aride » de l’UNESCO (1951-1964).\n\n![Calques d'aridité](/images/Fig_4.jpg)\n\n- En 2017, le pôle « Humanités numériques » du CEDEJ lance le portail *http://aridityworldmap.com*, en libre accès, sous la conduite de Hala Bayoumi, ingénieure de recherches au CNRS. Cette interface propose une carte mondiale de l’aridité à référence spatiale (SIRS) associée à la base de données établie avec les quatre variables initiales (type d’aridité, température, durée de la sécheresse, régime pluviométrique). Cette carte mondiale SIRS est une carte interactive : elle permet la sélection ou/et la combinaison des variables de l’aridité à différentes échelles spatiales.\n\n- *Aridity World Map* s’inscrit dans une démarche de science participative et citoyenne. La base de données sur l’aridité à référence spatiale pourra être actualisée et enrichie d’illustrations et de données, grâce à la [collaboration de la communauté scientifique, des décideurs ou des acteurs de la société civile](/page/contribute).\n"

/***/ }),

/***/ "./src/components/atoms/MarkdownContent/content/tutorial.md":
/***/ (function(module, exports) {

module.exports = "### Légende\nLa légende se trouve à gauche de l'écran, vous pouvez la masquer. Vous pouvez afficher des informations supplémentaires\nà l'aide des éléments <span data-tip data-for=\"tutorial-tootlip\">soulignés en pointillés</span>. [Voir note explicative de la légende](http://www.aridityworldmap.org/Notice-explicative-legende-AridityWorldMap.docx)\n\n### Exploration\nCliquer sur une zone colorée de la carte permet d'afficher les informations correspondant à cette zone.\n\n### Personnalisation\nLa barre de droite permet de filtrer les informations affichées afin de personnaliser la carte. Vous pouvez exporter la carte personnalisée en format image. \n"

/***/ }),

/***/ "./src/components/atoms/MarkdownContent/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _about = __webpack_require__("./src/components/atoms/MarkdownContent/content/about.md");

var _about2 = _interopRequireDefault(_about);

var _project = __webpack_require__("./src/components/atoms/MarkdownContent/content/project.md");

var _project2 = _interopRequireDefault(_project);

var _participate = __webpack_require__("./src/components/atoms/MarkdownContent/content/participate.md");

var _participate2 = _interopRequireDefault(_participate);

var _modal = __webpack_require__("./src/components/atoms/MarkdownContent/content/modal.md");

var _modal2 = _interopRequireDefault(_modal);

var _tutorial = __webpack_require__("./src/components/atoms/MarkdownContent/content/tutorial.md");

var _tutorial2 = _interopRequireDefault(_tutorial);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = { About: _about2.default, Contribute: _participate2.default, LegendInfos: _modal2.default, Project: _project2.default, Tutorial: _tutorial2.default };
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/MarkdownContent/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/NavItem/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  display: inline-block;\n  width: 0.5em;\n'], ['\n  display: inline-block;\n  width: 0.5em;\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  margin:0;\n  list-style: none;\n  text-align: center;\n'], ['\n  margin:0;\n  list-style: none;\n  text-align: center;\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  & svg {\n    margin-bottom: 3px;\n  }\n'], ['\n  & svg {\n    margin-bottom: 3px;\n  }\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Blank = _styledComponents2.default.span(_templateObject);

var Item = _styledComponents2.default.li(_templateObject2);

var IconHolder = _styledComponents2.default.span(_templateObject3);

var NavItem = function NavItem(_ref) {
  var to = _ref.to,
      icon = _ref.icon,
      title = _ref.title,
      isHome = _ref.isHome;

  var Link = isHome ? _components.HomeNavLink : _components.NavLink;
  return _react2.default.createElement(
    Item,
    null,
    _react2.default.createElement(
      Link,
      { to: to },
      _react2.default.createElement(
        IconHolder,
        null,
        icon
      ),
      _react2.default.createElement(Blank, null),
      title
    )
  );
};

NavItem.propTypes = {
  to: _propTypes2.default.string.isRequired,
  icon: _propTypes2.default.node.isRequired,
  title: _propTypes2.default.string.isRequired,
  isHome: _propTypes2.default.bool
};

var _default = NavItem;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Blank, 'Blank', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/NavItem/index.js');

  __REACT_HOT_LOADER__.register(Item, 'Item', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/NavItem/index.js');

  __REACT_HOT_LOADER__.register(IconHolder, 'IconHolder', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/NavItem/index.js');

  __REACT_HOT_LOADER__.register(NavItem, 'NavItem', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/NavItem/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/NavItem/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/NavLink/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _templateObject = _taggedTemplateLiteral(['\n', '\ndisplay:block;\nbackground-color:', ';\npadding: 0 15px;\ncolor: white;\ntransition: background .2s ease;\n&.active {\n  background-color: ', ';\n  color: white;\n  cursor: default;\n}\n&:hover {\n  text-decoration: none;\n}\n&:hover:not(.active) {\n  background: ', ';\n}\n'], ['\n', '\ndisplay:block;\nbackground-color:', ';\npadding: 0 15px;\ncolor: white;\ntransition: background .2s ease;\n&.active {\n  background-color: ', ';\n  color: white;\n  cursor: default;\n}\n&:hover {\n  text-decoration: none;\n}\n&:hover:not(.active) {\n  background: ', ';\n}\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _reactRouterDom = __webpack_require__("./node_modules/react-router-dom/es/index.js");

var _Link = __webpack_require__("./src/components/atoms/Link/index.js");

var _styledTheme = __webpack_require__("./node_modules/styled-theme/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var StyledNavLink = (0, _styledComponents2.default)(function (_ref) {
  var theme = _ref.theme,
      reverse = _ref.reverse,
      palette = _ref.palette,
      props = _objectWithoutProperties(_ref, ['theme', 'reverse', 'palette']);

  return _react2.default.createElement(_reactRouterDom.NavLink, _extends({ exact: true, activeClassName: 'active' }, props));
})(_templateObject, _Link.styles, (0, _styledTheme.palette)('grayscale', 0), (0, _styledTheme.palette)('primary', 2), (0, _styledTheme.palette)('grayscale', 1));

var NavLink = function NavLink(_ref2) {
  var props = _objectWithoutProperties(_ref2, []);

  return _react2.default.createElement(StyledNavLink, props);
};

NavLink.propTypes = {
  palette: _propTypes2.default.string,
  reverse: _propTypes2.default.bool,
  to: _propTypes2.default.string.isRequired
};

NavLink.defaultProps = {
  palette: 'primary'
};

var _default = NavLink;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(StyledNavLink, 'StyledNavLink', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/NavLink/index.js');

  __REACT_HOT_LOADER__.register(NavLink, 'NavLink', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/NavLink/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/NavLink/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/PDFIcon/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PDFIcon = function PDFIcon(props) {
  return _react2.default.createElement(
    _components.SvgIcon,
    _extends({}, props, { x: '0px', y: '0px', viewBox: '0 0 482.14 482.14', style: {
        enableBackground: 'new 0 0 482.14 482.14'
      } }),
    _react2.default.createElement(
      'g',
      null,
      _react2.default.createElement('path', { d: 'M142.024,310.194c0-8.007-5.556-12.782-15.359-12.782c-4.003,0-6.714,0.395-8.132,0.773v25.69   c1.679,0.378,3.743,0.504,6.588,0.504C135.57,324.379,142.024,319.1,142.024,310.194z' }),
      _react2.default.createElement('path', { d: 'M202.709,297.681c-4.39,0-7.227,0.379-8.905,0.772v56.896c1.679,0.394,4.39,0.394,6.841,0.394   c17.809,0.126,29.424-9.677,29.424-30.449C230.195,307.231,219.611,297.681,202.709,297.681z' }),
      _react2.default.createElement('path', { d: 'M315.458,0H121.811c-28.29,0-51.315,23.041-51.315,51.315v189.754h-5.012c-11.418,0-20.678,9.251-20.678,20.679v125.404   c0,11.427,9.259,20.677,20.678,20.677h5.012v22.995c0,28.305,23.025,51.315,51.315,51.315h264.223   c28.272,0,51.3-23.011,51.3-51.315V121.449L315.458,0z M99.053,284.379c6.06-1.024,14.578-1.796,26.579-1.796   c12.128,0,20.772,2.315,26.58,6.965c5.548,4.382,9.292,11.615,9.292,20.127c0,8.51-2.837,15.745-7.999,20.646   c-6.714,6.32-16.643,9.157-28.258,9.157c-2.585,0-4.902-0.128-6.714-0.379v31.096H99.053V284.379z M386.034,450.713H121.811   c-10.954,0-19.874-8.92-19.874-19.889v-22.995h246.31c11.42,0,20.679-9.25,20.679-20.677V261.748   c0-11.428-9.259-20.679-20.679-20.679h-246.31V51.315c0-10.938,8.921-19.858,19.874-19.858l181.89-0.19v67.233   c0,19.638,15.934,35.587,35.587,35.587l65.862-0.189l0.741,296.925C405.891,441.793,396.987,450.713,386.034,450.713z    M174.065,369.801v-85.422c7.225-1.15,16.642-1.796,26.58-1.796c16.516,0,27.226,2.963,35.618,9.282   c9.031,6.714,14.704,17.416,14.704,32.781c0,16.643-6.06,28.133-14.453,35.224c-9.157,7.612-23.096,11.222-40.125,11.222   C186.191,371.092,178.966,370.446,174.065,369.801z M314.892,319.226v15.996h-31.23v34.973h-19.74v-86.966h53.16v16.122h-33.42   v19.875H314.892z' })
    )
  );
};

var _default = PDFIcon;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(PDFIcon, 'PDFIcon', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/PDFIcon/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/PDFIcon/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/PNGIcon/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PNGIcon = function PNGIcon(props) {
  return _react2.default.createElement(
    _components.SvgIcon,
    _extends({}, props, { x: '0px', y: '0px', viewBox: '0 0 550.801 550.801', style: {
        enableBackground: 'new 0 0 550.801 550.801'
      } }),
    _react2.default.createElement(
      'g',
      null,
      _react2.default.createElement('path', { d: 'M146.747,276.708c0-13.998-9.711-22.352-26.887-22.352c-6.99,0-11.726,0.675-14.204,1.355v44.927   c2.932,0.676,6.539,0.896,11.52,0.896C135.449,301.546,146.747,292.28,146.747,276.708z' }),
      _react2.default.createElement('path', { d: 'M488.426,197.019H475.2v-63.816c0-0.398-0.063-0.799-0.116-1.202c-0.021-2.534-0.827-5.023-2.562-6.995L366.325,3.694   c-0.032-0.031-0.063-0.042-0.085-0.076c-0.633-0.707-1.371-1.295-2.151-1.804c-0.231-0.155-0.464-0.285-0.706-0.419   c-0.676-0.369-1.393-0.675-2.131-0.896c-0.2-0.056-0.38-0.138-0.58-0.19C359.87,0.119,359.037,0,358.193,0H97.2   c-11.918,0-21.6,9.693-21.6,21.601v175.413H62.377c-17.049,0-30.873,13.818-30.873,30.873v160.545   c0,17.043,13.824,30.87,30.873,30.87h13.224V529.2c0,11.907,9.682,21.601,21.6,21.601h356.4c11.907,0,21.6-9.693,21.6-21.601   V419.302h13.226c17.044,0,30.871-13.827,30.871-30.87v-160.54C519.297,210.838,505.47,197.019,488.426,197.019z M97.2,21.605   h250.193v110.513c0,5.967,4.841,10.8,10.8,10.8h95.407v54.108H97.2V21.605z M234.344,335.86v45.831h-31.601V229.524h40.184   l31.611,55.759c9.025,16.031,18.064,34.983,24.825,52.154h0.675c-2.257-20.103-2.933-40.643-2.933-63.44v-44.473h31.614v152.167   h-36.117l-32.516-58.703c-9.049-16.253-18.971-35.892-26.438-53.727l-0.665,0.222C233.906,289.58,234.344,311.027,234.344,335.86z    M71.556,381.691V231.56c10.613-1.804,25.516-3.159,46.506-3.159c21.215,0,36.353,4.061,46.509,12.192   c9.698,7.673,16.255,20.313,16.255,35.219c0,14.897-4.959,27.549-13.999,36.123c-11.738,11.063-29.123,16.031-49.441,16.031   c-4.522,0-8.593-0.231-11.736-0.675v54.411H71.556V381.691z M453.601,523.353H97.2V419.302h356.4V523.353z M485.652,374.688   c-10.61,3.607-30.713,8.585-50.805,8.585c-27.759,0-47.872-7.003-61.857-20.545c-13.995-13.1-21.684-32.97-21.452-55.318   c0.222-50.569,37.03-79.463,86.917-79.463c19.644,0,34.783,3.829,42.219,7.446l-7.214,27.543c-8.369-3.617-18.752-6.55-35.458-6.55   c-28.656,0-50.341,16.256-50.341,49.22c0,31.382,19.649,49.892,47.872,49.892c7.895,0,14.218-0.901,16.934-2.257v-31.835h-23.493   v-26.869h56.679V374.688z' })
    )
  );
};

var _default = PNGIcon;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(PNGIcon, 'PNGIcon', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/PNGIcon/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/PNGIcon/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/RangeSlider/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n.rc-slider {\n  padding: 4px 0;\n}\n.rc-slider-tooltip {\n  z-index: 800;\n  font-familiy: \'Helvetica\';\n}\n.rc-slider-track {\n  background-color: ', ';\n}\n.rc-slider-tooltip-inner {\n  font-size: 0.7rem;\n  box-shadow: 0 0 3px #bbb; \n  border-radius: 0;\n  padding-left: 2px;\n  padding-right: 2px;\n}\n\n.rc-slider-disabled {\n  background-color: transparent;\n}\n\n.rc-slider-handle {\n  border: transparent;\n  background-color: white;\n}\n'], ['\n.rc-slider {\n  padding: 4px 0;\n}\n.rc-slider-tooltip {\n  z-index: 800;\n  font-familiy: \'Helvetica\';\n}\n.rc-slider-track {\n  background-color: ', ';\n}\n.rc-slider-tooltip-inner {\n  font-size: 0.7rem;\n  box-shadow: 0 0 3px #bbb; \n  border-radius: 0;\n  padding-left: 2px;\n  padding-right: 2px;\n}\n\n.rc-slider-disabled {\n  background-color: transparent;\n}\n\n.rc-slider-handle {\n  border: transparent;\n  background-color: white;\n}\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  padding-left: 5px;\n  padding-right: 5px;\n'], ['\n  padding-left: 5px;\n  padding-right: 5px;\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

__webpack_require__("./node_modules/rc-slider/assets/index.css");

__webpack_require__("./node_modules/rc-tooltip/assets/bootstrap.css");

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledTheme = __webpack_require__("./node_modules/styled-theme/index.js");

var _default2 = __webpack_require__("./src/components/themes/default.js");

var _default3 = _interopRequireDefault(_default2);

var _rcSlider = __webpack_require__("./node_modules/rc-slider/es/index.js");

var _rcSlider2 = _interopRequireDefault(_rcSlider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

(0, _styledComponents.injectGlobal)(_templateObject, _default3.default.palette.primary[0]);

var Range = _rcSlider2.default.createSliderWithTooltip(_rcSlider2.default.Range);

var Holder = _styledComponents2.default.div(_templateObject2);

var RangeSlider = function RangeSlider(props) {
  return _react2.default.createElement(
    Holder,
    null,
    _react2.default.createElement(Range, props)
  );
};

var _default = RangeSlider;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Range, 'Range', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/RangeSlider/index.js');

  __REACT_HOT_LOADER__.register(Holder, 'Holder', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/RangeSlider/index.js');

  __REACT_HOT_LOADER__.register(RangeSlider, 'RangeSlider', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/RangeSlider/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/RangeSlider/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/Reduced/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  font-size: 0.75rem;\n  line-height: 0.7rem;\n'], ['\n  font-size: 0.75rem;\n  line-height: 0.7rem;\n']);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Reduced = _styledComponents2.default.span(_templateObject);

var _default = Reduced;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Reduced, 'Reduced', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Reduced/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Reduced/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/SmallScreensWarning/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reactResponsive = __webpack_require__("./node_modules/react-responsive/dist/react-responsive.js");

var _reactResponsive2 = _interopRequireDefault(_reactResponsive);

var _utils = __webpack_require__("./src/utils/index.js");

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Title = function Title() {
  return _react2.default.createElement(
    'span',
    null,
    '\xC9cran non support\xE9'
  );
};

var SmallScreensWarning = function (_Component) {
  _inherits(SmallScreensWarning, _Component);

  function SmallScreensWarning(props) {
    _classCallCheck(this, SmallScreensWarning);

    var _this = _possibleConstructorReturn(this, (SmallScreensWarning.__proto__ || Object.getPrototypeOf(SmallScreensWarning)).call(this, props));

    _this.state = {
      closed: false
    };
    return _this;
  }

  _createClass(SmallScreensWarning, [{
    key: 'close',
    value: function close() {
      this.setState({ closed: true });
    }
  }, {
    key: 'render',
    value: function render() {
      var closed = this.state.closed;

      return _react2.default.createElement(
        _reactResponsive2.default,
        { query: '(max-width: 1200px)' },
        _react2.default.createElement(
          _components.Modal,
          { title: _react2.default.createElement(Title, null), isOpen: !closed, closeable: true, onClose: this.close.bind(this) },
          _react2.default.createElement(
            'p',
            null,
            'Cette application est con\xE7ue pour les \xE9crans larges et risque de mal fonctionner. ',
            _react2.default.createElement('br', null),
            ' Optimisez la taille de la fen\xEAtre de votre navigateur, ou privil\xE9giez une exp\xE9rience sur ordinateur.'
          )
        )
      );
    }
  }]);

  return SmallScreensWarning;
}(_react.Component);

var _default = SmallScreensWarning;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Title, 'Title', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/SmallScreensWarning/index.js');

  __REACT_HOT_LOADER__.register(SmallScreensWarning, 'SmallScreensWarning', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/SmallScreensWarning/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/SmallScreensWarning/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/Spinner/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  0% { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n'], ['\n  0% { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  position: relative;\n  border: 0.2em solid ', ';\n  border-bottom-color: ', ';\n  border-radius: 50%;\n  margin: 0 auto;\n  width: 1em;\n  height: 1em;\n  animation: ', ' 1s linear infinite;\n'], ['\n  position: relative;\n  border: 0.2em solid ', ';\n  border-bottom-color: ', ';\n  border-radius: 50%;\n  margin: 0 auto;\n  width: 1em;\n  height: 1em;\n  animation: ', ' 1s linear infinite;\n']);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledTheme = __webpack_require__("./node_modules/styled-theme/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var spin = (0, _styledComponents.keyframes)(_templateObject);

var Spinner = _styledComponents2.default.div(_templateObject2, (0, _styledTheme.palette)('grayscale', 1, true), (0, _styledTheme.palette)(1), spin);

Spinner.propTypes = {
  palette: _propTypes2.default.string,
  reverse: _propTypes2.default.bool
};

Spinner.defaultProps = {
  palette: 'primary'
};

var _default = Spinner;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(spin, 'spin', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Spinner/index.js');

  __REACT_HOT_LOADER__.register(Spinner, 'Spinner', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Spinner/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Spinner/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/Svg/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral([''], ['']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Svg = _styledComponents2.default.svg.attrs({ xmlns: "http://www.w3.org/2000/svg" })(_templateObject);
var _default = Svg;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Svg, 'Svg', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Svg/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Svg/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/SvgIcon/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  cursor: pointer;\n  & path {\n    fill: ', ';\n    transition: fill .2s ease;\n  }\n  &:hover path {\n    fill: ', ';\n  }\n'], ['\n  cursor: pointer;\n  & path {\n    fill: ', ';\n    transition: fill .2s ease;\n  }\n  &:hover path {\n    fill: ', ';\n  }\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledTheme = __webpack_require__("./node_modules/styled-theme/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Svg = _styledComponents2.default.svg(_templateObject, (0, _styledTheme.palette)('white', 0), (0, _styledTheme.palette)('primary', 0));

var SvgIcon = function SvgIcon(_ref) {
  var children = _ref.children,
      props = _objectWithoutProperties(_ref, ['children']);

  return _react2.default.createElement(
    Svg,
    props,
    children
  );
};

var _default = SvgIcon;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Svg, 'Svg', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/SvgIcon/index.js');

  __REACT_HOT_LOADER__.register(SvgIcon, 'SvgIcon', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/SvgIcon/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/SvgIcon/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/Td/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  padding-left: 2px;\n  padding-right: 2px;\n  text-align: ', ';\n'], ['\n  padding-left: 2px;\n  padding-right: 2px;\n  text-align: ', ';\n']);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Td = _styledComponents2.default.td(_templateObject, function (_ref) {
  var _ref$align = _ref.align,
      align = _ref$align === undefined ? 'center' : _ref$align;
  return align;
});

var _default = Td;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Td, 'Td', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Td/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Td/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/TemperatureLegendPattern/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _components = __webpack_require__("./src/components/index.js");

var _boundaries = __webpack_require__("./src/utils/boundaries.js");

var boundaries = _interopRequireWildcard(_boundaries);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var areaPatternPath = function areaPatternPath(_ref) {
  var w = _ref.width,
      h = _ref.height;
  return '\n  M2,2L' + (w - 2) + ',2L' + (w - 2) + ',' + (h - 2) + 'L2,' + (h - 2) + 'Z\n';
};

var AreaPattern = function (_Component) {
  _inherits(AreaPattern, _Component);

  function AreaPattern() {
    _classCallCheck(this, AreaPattern);

    return _possibleConstructorReturn(this, (AreaPattern.__proto__ || Object.getPrototypeOf(AreaPattern)).apply(this, arguments));
  }

  _createClass(AreaPattern, [{
    key: 'drawCanvas',
    value: function drawCanvas(canvas) {
      if (!canvas) {
        return;
      }
      var _props = this.props,
          patterns = _props.patterns,
          aridity = _props.aridity,
          pTemperature = _props.temperature;

      var context = canvas.getContext('2d');
      var pattern = void 0;
      var temperature = pTemperature;
      if (aridity) {
        pattern = patterns.findByKey(aridity.name);
      }
      var p = areaPatternPath(canvas);
      var props = new boundaries.pathProperties(p);
      var path = {
        isExterior: true,
        path: p,
        properties: props,
        length: props.totalLength()
      };

      var p2d = new Path2D(path.path);
      if (!temperature) {
        temperature = { color: 'white' };
      }

      context.fillStyle = temperature.color;
      context.fill(p2d);

      if (pattern && pattern.stripes) {

        /// context.globalCompositeOperation = 'destination-out';
        context.fillStyle = pattern.canvasPattern;
        context.beginPath();
        context.fill(p2d);
        context.closePath();
      }
      if (aridity) {
        context.globalCompositeOperation = 'source-over';
        boundaries.addBoundary({ context: context, path: path, pattern: pattern, gap: 20 });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        _components.Td,
        null,
        _react2.default.createElement('canvas', {
          width: 35,
          height: 15,
          ref: function ref(canvas) {
            return _this2.drawCanvas(canvas);
          } })
      );
    }
  }]);

  return AreaPattern;
}(_react.Component);

var _default = AreaPattern;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(areaPatternPath, 'areaPatternPath', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/TemperatureLegendPattern/index.js');

  __REACT_HOT_LOADER__.register(AreaPattern, 'AreaPattern', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/TemperatureLegendPattern/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/TemperatureLegendPattern/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/Th/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  padding-left: 2px;\n  padding-right: 2px;\n  text-align: ', ';\n  width: ', ';\n'], ['\n  padding-left: 2px;\n  padding-right: 2px;\n  text-align: ', ';\n  width: ', ';\n']);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Th = _styledComponents2.default.th(_templateObject, function (_ref) {
  var _ref$align = _ref.align,
      align = _ref$align === undefined ? 'center' : _ref$align;
  return align;
}, function (_ref2) {
  var width = _ref2.width;
  return width ? width + 'px' : 'auto';
});

var _default = Th;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Th, 'Th', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Th/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Th/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/ToggleButton/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  height: ', 'px;\n  line-height: ', 'px;\n  font-weight: bold;\n  font-size: 0.8rem;\n  width: 100%;\n  border-radius: 0;\n  display: block;\n  position: relative;\n'], ['\n  height: ', 'px;\n  line-height: ', 'px;\n  font-weight: bold;\n  font-size: 0.8rem;\n  width: 100%;\n  border-radius: 0;\n  display: block;\n  position: relative;\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  display: flex;\n  align-items: center;\n  left: ', ';\n  right: ', ';\n'], ['\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  display: flex;\n  align-items: center;\n  left: ', ';\n  right: ', ';\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var BUTTON_HEIGHT = 25;
var Button = (0, _styledComponents2.default)(_components.Button)(_templateObject, BUTTON_HEIGHT, BUTTON_HEIGHT);

var _Symbol = _styledComponents2.default.div(_templateObject2, function (_ref) {
  var align = _ref.align;
  return align === 'left' ? '17px' : 'auto';
}, function (_ref2) {
  var align = _ref2.align;
  return align === 'right' ? '17px' : 'auto';
});

var ToggleSymbol = function ToggleSymbol(_ref3) {
  var align = _ref3.align,
      toggled = _ref3.toggled;

  var openedSign = align === 'left' ? '>' : '<';
  var closedSign = align === 'left' ? '<' : '>';
  var symbolToUse = toggled ? openedSign : closedSign;
  return _react2.default.createElement(
    _Symbol,
    { align: align },
    _react2.default.createElement(
      'span',
      null,
      symbolToUse
    )
  );
};

var ToggleButton = function ToggleButton(_ref4) {
  var toggled = _ref4.toggled,
      toggle = _ref4.toggle,
      align = _ref4.align,
      children = _ref4.children,
      props = _objectWithoutProperties(_ref4, ['toggled', 'toggle', 'align', 'children']);

  return _react2.default.createElement(
    'div',
    props,
    _react2.default.createElement(
      Button,
      { align: align,
        onClick: toggle },
      _react2.default.createElement(ToggleSymbol, { align: align, toggled: toggled }),
      children
    )
  );
};

ToggleButton.defaultProps = {
  align: 'left'
};

var _default = ToggleButton;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(BUTTON_HEIGHT, 'BUTTON_HEIGHT', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/ToggleButton/index.js');

  __REACT_HOT_LOADER__.register(Button, 'Button', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/ToggleButton/index.js');

  __REACT_HOT_LOADER__.register(_Symbol, 'Symbol', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/ToggleButton/index.js');

  __REACT_HOT_LOADER__.register(ToggleSymbol, 'ToggleSymbol', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/ToggleButton/index.js');

  __REACT_HOT_LOADER__.register(ToggleButton, 'ToggleButton', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/ToggleButton/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/ToggleButton/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/TrName/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  text-transform: uppercase;\n  width: 200px;\n  padding-right: 6px;\n'], ['\n  text-transform: uppercase;\n  width: 200px;\n  padding-right: 6px;\n']);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var TrName = _styledComponents2.default.th(_templateObject);

var _default = TrName;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(TrName, 'TrName', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/TrName/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/TrName/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/TrNameContent/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  background: #bbb;\n  padding-top: 2px;\n  padding-bottom: 2px;\n  display: block;\n'], ['\n  background: #bbb;\n  padding-top: 2px;\n  padding-bottom: 2px;\n  display: block;\n']);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var TrNameContent = _styledComponents2.default.span(_templateObject);

var _default = TrNameContent;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(TrNameContent, 'TrNameContent', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/TrNameContent/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/TrNameContent/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/TwitterIcon/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// took from https://github.com/simple-icons/simple-icons/ 
var Twitter = function Twitter(props) {
  return _react2.default.createElement(
    _components.SvgIcon,
    _extends({}, props, { viewBox: '0 0 24 24' }),
    _react2.default.createElement('path', { d: 'M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z'
    })
  );
};

var _default = Twitter;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Twitter, 'Twitter', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/TwitterIcon/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/TwitterIcon/index.js');
}();

;

/***/ }),

/***/ "./src/components/atoms/WaterLabel/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  font-size: ', ';\n  font-weight: bold;\n  font-style: ', ';\n  color: #111583;\n'], ['\n  font-size: ', ';\n  font-weight: bold;\n  font-style: ', ';\n  color: #111583;\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  font-style: italic;\n  color: #6f9fdd;\n  text-shadow: 1px 1px 0.05rem ', ',\n    -1px -1px 0.05rem ', ',\n    1px 0px 0.05rem', ',\n    0px 1px 0.05rem ', ',\n    -1px 0px 0.05rem ', ',\n    0px -1px 0.05rem ', ';\n'], ['\n  font-style: italic;\n  color: #6f9fdd;\n  text-shadow: 1px 1px 0.05rem ', ',\n    -1px -1px 0.05rem ', ',\n    1px 0px 0.05rem', ',\n    0px 1px 0.05rem ', ',\n    -1px 0px 0.05rem ', ',\n    0px -1px 0.05rem ', ';\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var oceanFontSize = function oceanFontSize(_ref) {
  var scalerank = _ref.feature.properties.scalerank;

  switch (scalerank) {
    case 0:
      return '1.75em';
    case 1:
      return '1.5em';
    case 2:
      return '1.15em';
    default:
      return '1em';
  }
};

var oceanFontStyle = function oceanFontStyle(_ref2) {
  var featurecla = _ref2.feature.properties.featurecla;
  return featurecla === 'sea' ? 'italic' : 'normal';
};

var OceanLabel = _styledComponents2.default.span(_templateObject, oceanFontSize, oceanFontStyle);

var opacity = 0.6;
var color = 'rgba(68,40,230,' + opacity + ')';
var LakeLabel = _styledComponents2.default.span(_templateObject2, color, color, color, color, color, color);

var WaterLabel = function WaterLabel(props) {
  switch (props.feature.properties.featurecla) {
    case 'sea':
    case 'gulf':
    case 'ocean':
      return _react2.default.createElement(OceanLabel, props);
    default:
      return _react2.default.createElement(LakeLabel, props);
  }
};

var _default = WaterLabel;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(oceanFontSize, 'oceanFontSize', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/WaterLabel/index.js');

  __REACT_HOT_LOADER__.register(oceanFontStyle, 'oceanFontStyle', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/WaterLabel/index.js');

  __REACT_HOT_LOADER__.register(OceanLabel, 'OceanLabel', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/WaterLabel/index.js');

  __REACT_HOT_LOADER__.register(opacity, 'opacity', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/WaterLabel/index.js');

  __REACT_HOT_LOADER__.register(color, 'color', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/WaterLabel/index.js');

  __REACT_HOT_LOADER__.register(LakeLabel, 'LakeLabel', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/WaterLabel/index.js');

  __REACT_HOT_LOADER__.register(WaterLabel, 'WaterLabel', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/WaterLabel/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/WaterLabel/index.js');
}();

;

/***/ }),

/***/ "./src/components/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://github.com/diegohaz/arc/wiki/Atomic-Design#do-not-worry
var req = __webpack_require__("./src/components recursive \\.\\/[^\\/]+\\/[^\\/]+\\/index\\.js$");

req.keys().forEach(function (key) {
  var componentName = key.replace(/^.+\/([^/]+)\/index\.js/, '$1');
  module.exports[componentName] = req(key).default;
});
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(req, 'req', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/index.js');
}();

;

/***/ }),

/***/ "./src/components/molecules/AtlasExportButton/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  width:100%;\n  pointer-events: ', ';\n  opacity: ', ';\n  transition: opacity .5s ease-in-out;\n'], ['\n  width:100%;\n  pointer-events: ', ';\n  opacity: ', ';\n  transition: opacity .5s ease-in-out;\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  position: fixed;\n  left: 0;\n  right:0;\n  bottom:0;\n'], ['\n  position: fixed;\n  left: 0;\n  right:0;\n  bottom:0;\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__("./node_modules/react-redux/es/index.js");

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _components = __webpack_require__("./src/components/index.js");

var _selectors = __webpack_require__("./src/store/selectors.js");

var _actions = __webpack_require__("./src/store/actions.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Button = (0, _styledComponents2.default)(_components.Button)(_templateObject, function (_ref) {
  var visible = _ref.visible;
  return visible ? 'auto' : 'none';
}, function (_ref2) {
  var visible = _ref2.visible;
  return visible ? 1 : 0;
});

var Holder = _styledComponents2.default.div(_templateObject2);

var AtlasExportButton = function AtlasExportButton(props) {
  return _react2.default.createElement(
    Holder,
    null,
    _react2.default.createElement(
      Button,
      props,
      'Exporter'
    )
  );
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    visible: _selectors.fromSidebar.isOpened(state),
    disabled: _selectors.fromAtlas.isRendering(state)
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    onClick: function onClick() {
      return dispatch((0, _actions.openExportModal)());
    }
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(AtlasExportButton);

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Button, 'Button', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/AtlasExportButton/index.js');

  __REACT_HOT_LOADER__.register(Holder, 'Holder', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/AtlasExportButton/index.js');

  __REACT_HOT_LOADER__.register(AtlasExportButton, 'AtlasExportButton', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/AtlasExportButton/index.js');

  __REACT_HOT_LOADER__.register(mapStateToProps, 'mapStateToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/AtlasExportButton/index.js');

  __REACT_HOT_LOADER__.register(mapDispatchToProps, 'mapDispatchToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/AtlasExportButton/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/AtlasExportButton/index.js');
}();

;

/***/ }),

/***/ "./src/components/molecules/CanvasTiles/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactLeaflet = __webpack_require__("./node_modules/react-leaflet/es/index.js");

var _utils = __webpack_require__("./src/utils/index.js");

var _layer = __webpack_require__("./src/components/molecules/CanvasTiles/layer.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CanvasTiles = function (_MapLayer) {
  _inherits(CanvasTiles, _MapLayer);

  function CanvasTiles() {
    _classCallCheck(this, CanvasTiles);

    return _possibleConstructorReturn(this, (CanvasTiles.__proto__ || Object.getPrototypeOf(CanvasTiles)).apply(this, arguments));
  }

  _createClass(CanvasTiles, [{
    key: 'createLeafletElement',
    value: function createLeafletElement(props) {
      var _getOptions = this.getOptions(props),
          delegate = _getOptions.delegate,
          onRendered = _getOptions.onRendered,
          data = _getOptions.data,
          options = _objectWithoutProperties(_getOptions, ['delegate', 'onRendered', 'data']);

      this.delegate = new delegate(data);
      return (0, _layer.canvasTiles)(this.delegate, onRendered, options);
    }
  }, {
    key: 'updateData',
    value: function updateData(data) {
      this.delegate.updateData(data);
      this.redraw();
    }
  }, {
    key: 'redraw',
    value: function redraw() {
      this.leafletElement.redraw();
      this.onRendered();
    }
  }, {
    key: 'onRendered',
    value: function onRendered() {
      this.props.onRendered && this.props.onRendered();
    }
  }]);

  return CanvasTiles;
}(_reactLeaflet.MapLayer);

CanvasTiles.propTypes = {
  delegate: _propTypes2.default.func.isRequired,
  zIndex: _propTypes2.default.number,
  bbox: _propTypes2.default.array,
  onRendered: _propTypes2.default.func,
  data: _propTypes2.default.object
};
CanvasTiles.defaultProps = {
  onRendered: _utils.noop
};
var _default = CanvasTiles;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(CanvasTiles, 'CanvasTiles', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/CanvasTiles/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/CanvasTiles/index.js');
}();

;

/***/ }),

/***/ "./src/components/molecules/CanvasTiles/layer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canvasTiles = exports.CanvasTiles = undefined;

var _leaflet = __webpack_require__("./node_modules/leaflet/dist/leaflet-src.js");

var CanvasTiles = exports.CanvasTiles = _leaflet.GridLayer.extend({
  isCanvasLayer: function isCanvasLayer() {
    return true;
  },

  initialize: function initialize(drawDelegate, onRendered, options) {
    this._drawDelegate = drawDelegate;

    this._drawDelegate.setLayer(this);
    this._onRendered = onRendered;
    (0, _leaflet.setOptions)(this, options);
    return this;
  },

  drawing: function drawing(drawDelegate) {
    this._drawDelegate = drawDelegate;
    return this;
  },

  params: function params(options) {
    (0, _leaflet.setOptions)(this, options);
    return this;
  },

  addTo: function addTo(map) {
    map.addLayer(this);
    return this;
  },

  _drawDebugInfo: function _drawDebugInfo(tileCanvas, tilePoint, zoom) {

    var max = this.options.tileSize;
    var g = tileCanvas.getContext('2d');
    g.globalCompositeOperation = 'destination-over';
    g.strokeStyle = '#FFFFFF';
    g.fillStyle = '#FFFFFF';
    g.strokeRect(0, 0, max, max);
    g.font = "12px Arial";
    g.fillRect(0, 0, 5, 5);
    g.fillRect(0, max - 5, 5, 5);
    g.fillRect(max - 5, 0, 5, 5);
    g.fillRect(max - 5, max - 5, 5, 5);
    g.fillRect(max / 2 - 5, max / 2 - 5, 10, 10);
    g.strokeText(tilePoint.x + ' ' + tilePoint.y + ' ' + zoom, max / 2 - 30, max / 2 - 10);
  },

  tilePoint: function tilePoint(map, coords, _tilePoint, tileSize) {
    // start coords to tile 'space'
    var s = _tilePoint.multiplyBy(tileSize);

    // actual coords to tile 'space'
    var p = map.project(new _leaflet.LatLng(coords[0], coords[1]));

    // point to draw
    var x = Math.round(p.x - s.x);
    var y = Math.round(p.y - s.y);
    return { x: x, y: y };
  },
  /**
   * Creates a query for the quadtree from bounds
   */
  _boundsToQuery: function _boundsToQuery(bounds) {
    if (bounds.getSouthWest() == undefined) {
      return { x: 0, y: 0, width: 0.1, height: 0.1 };
    } // for empty data sets
    return {
      x: bounds.getSouthWest().lng,
      y: bounds.getSouthWest().lat,
      width: bounds.getNorthEast().lng - bounds.getSouthWest().lng,
      height: bounds.getNorthEast().lat - bounds.getSouthWest().lat
    };
  },

  getZoom: function getZoom() {
    return this._map.getZoom();
  },

  createTile: function createTile(coords) {
    var tile = _leaflet.DomUtil.create('canvas', 'leaflet-tile');
    var size = this.getTileSize();
    var zoom = this.getZoom();
    tile.width = size.x;
    tile.height = size.y;
    if (this._drawDelegate) {
      this._drawDelegate.draw({
        canvas: tile,
        layer: this,
        size: size,
        coords: coords,
        zoom: zoom
      });
    }
    return tile;
  }
});

var canvasTiles = exports.canvasTiles = function canvasTiles(drawDelegate, onRendered, options) {
  return new CanvasTiles(drawDelegate, onRendered, options);
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(CanvasTiles, 'CanvasTiles', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/CanvasTiles/layer.js');

  __REACT_HOT_LOADER__.register(canvasTiles, 'canvasTiles', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/CanvasTiles/layer.js');
}();

;

/***/ }),

/***/ "./src/components/molecules/CirclesLegend/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\ntext-align: left;\n& > .cols {\n  display: flex;\n  align-items: center;\n  svg {\n    flex-grow: 0;\n    flex-shrink: 0;\n    width: 40px;\n  }\n  span {\n    padding-left: 1em;\n  }\n}\n'], ['\ntext-align: left;\n& > .cols {\n  display: flex;\n  align-items: center;\n  svg {\n    flex-grow: 0;\n    flex-shrink: 0;\n    width: 40px;\n  }\n  span {\n    padding-left: 1em;\n  }\n}\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  background-color: ', ';\n  width: 10px;\n  height: 10px;\n  border: 1px solid black;\n  border-radius: 100%;\n  display: inline-block;\n'], ['\n  background-color: ', ';\n  width: 10px;\n  height: 10px;\n  border: 1px solid black;\n  border-radius: 100%;\n  display: inline-block;\n']),
    _templateObject3 = _taggedTemplateLiteral(['font-weight: normal'], ['font-weight: normal']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _reactMarkdown = __webpack_require__("./node_modules/react-markdown/src/react-markdown.js");

var _reactMarkdown2 = _interopRequireDefault(_reactMarkdown);

var _reactTooltip = __webpack_require__("./node_modules/react-tooltip/dist/index.js");

var _reactTooltip2 = _interopRequireDefault(_reactTooltip);

var _components = __webpack_require__("./src/components/index.js");

var _utils = __webpack_require__("./src/utils/index.js");

var _circles = __webpack_require__("./src/utils/circles.js");

var circlesUtils = _interopRequireWildcard(_circles);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var CircleSizesLegend = (0, _styledComponents2.default)(_components.Td).attrs({
  colSpan: 4
})(_templateObject);

var CircleTypeSymbol = _styledComponents2.default.span(_templateObject2, function (_ref) {
  var circle = _ref.circle;
  return circlesUtils.colorByValue(circle);
});

var CircleTypeRow = function CircleTypeRow(_ref2) {
  var circle = _ref2.circle,
      print = _ref2.print;

  return _react2.default.createElement(
    'tr',
    null,
    _react2.default.createElement(
      'td',
      { colSpan: 5 },
      _react2.default.createElement(
        'span',
        { 'data-tip': true, 'data-for': 'tooltip-circle-' + circle },
        _react2.default.createElement(CircleTypeSymbol, { circle: circle }),
        '\xA0',
        _react2.default.createElement(
          _components.Reduced,
          null,
          !print ? circlesUtils.droughtRegime(circle) : circlesUtils.droughtFullRegime(circle)
        )
      )
    )
  );
};

var NormalWeight = _styledComponents2.default.span(_templateObject3);

var CirclesLegend = function CirclesLegend(_ref3) {
  var filters = _ref3.filters,
      circleSizes = _ref3.circleSizes,
      print = _ref3.print;

  var types = filters.circles.types;
  var visibleTypes = Object.keys(types).map(function (k) {
    return types[k];
  }).filter(function (t) {
    return t.visible;
  });
  var isVisible = function isVisible(t) {
    return types[t].visible;
  };
  var hasTypes = function hasTypes(types, ctrl) {
    var i = 0;
    for (i; i < types.length; i += 1) {
      if (ctrl[types[i]].visible) {
        return true;
      }
    }
    return false;
  };

  return _react2.default.createElement(
    'tbody',
    null,
    _react2.default.createElement(
      'tr',
      null,
      _react2.default.createElement(
        _components.TrName,
        { style: { paddingTop: '5px' } },
        _react2.default.createElement(
          _components.TrNameContent,
          null,
          'S\xE9cheresse'
        )
      )
    ),
    _react2.default.createElement(
      'tr',
      null,
      _react2.default.createElement(
        _components.Th,
        { align: 'left', style: { marginTop: '-5px' } },
        _react2.default.createElement(
          _components.LegendCategoryName,
          null,
          _react2.default.createElement(
            'span',
            { 'data-tip': true, 'data-for': 'tooltip-nb-months' },
            'Nombre de mois secs'
          ),
          print && _react2.default.createElement(
            NormalWeight,
            null,
            '\xA0recevant moins de 30mm de pr\xE9cipitations'
          )
        )
      ),
      !print && _react2.default.createElement(
        CircleSizesLegend,
        null,
        _react2.default.createElement(
          'div',
          { className: 'cols' },
          _react2.default.createElement(_components.CircleSizesSymbol, { width: 40, height: 40 }),
          _react2.default.createElement(
            _components.Reduced,
            null,
            'Valeur exacte disponible au clic sur chaque cercle'
          )
        )
      )
    ),
    print && _react2.default.createElement(
      'tr',
      null,
      _react2.default.createElement(
        'td',
        { colSpan: 5 },
        _react2.default.createElement(_components.PrintCircleMonthRangeLegend, { sizes: circleSizes })
      )
    ),
    visibleTypes.length > 0 && _react2.default.createElement(
      'tr',
      null,
      _react2.default.createElement(
        _components.Th,
        { colSpan: 2, align: 'left', style: { marginTop: '-5px' } },
        _react2.default.createElement(
          _components.LegendCategoryName,
          null,
          _react2.default.createElement(
            'span',
            { 'data-tip': true, 'data-for': 'tooltip-regime' },
            'P\xE9riodes des s\xE9cheresses'
          ),
          print && _react2.default.createElement(
            NormalWeight,
            null,
            '\xA0et r\xE9gimes des pr\xE9cipitations'
          )
        )
      )
    ),
    hasTypes(['A', 'B'], types) && _react2.default.createElement(
      'tr',
      null,
      _react2.default.createElement(
        _components.Th,
        { colSpan: 3, align: 'left' },
        _react2.default.createElement(
          _components.LegendCategoryName,
          null,
          _react2.default.createElement(
            _components.Reduced,
            null,
            'S\xE9cheresse d\'\xE9t\xE9 dominante'
          )
        )
      )
    ),
    isVisible('A') && _react2.default.createElement(CircleTypeRow, { print: print, circle: 'A' }),
    isVisible('B') && _react2.default.createElement(CircleTypeRow, { print: print, circle: 'B' }),
    hasTypes(['C', 'D'], types) && _react2.default.createElement(
      'tr',
      null,
      _react2.default.createElement(
        _components.Th,
        { colSpan: 3, align: 'left' },
        _react2.default.createElement(
          _components.LegendCategoryName,
          null,
          _react2.default.createElement(
            _components.Reduced,
            null,
            'S\xE9cheresse d\'hiver dominante'
          )
        )
      )
    ),
    isVisible('C') && _react2.default.createElement(CircleTypeRow, { print: print, circle: 'C' }),
    isVisible('D') && _react2.default.createElement(CircleTypeRow, { print: print, circle: 'D' }),
    hasTypes(['E', 'F'], types) && _react2.default.createElement(
      'tr',
      null,
      _react2.default.createElement(
        _components.Th,
        { align: 'left' },
        _react2.default.createElement(
          _components.LegendCategoryName,
          null,
          _react2.default.createElement(
            _components.Reduced,
            null,
            'R\xE9gimes de transition'
          )
        )
      )
    ),
    isVisible('E') && _react2.default.createElement(CircleTypeRow, { print: print, circle: 'E' }),
    isVisible('F') && _react2.default.createElement(CircleTypeRow, { print: print, circle: 'F' })
  );
};

var _default = CirclesLegend;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(CircleSizesLegend, 'CircleSizesLegend', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/CirclesLegend/index.js');

  __REACT_HOT_LOADER__.register(CircleTypeSymbol, 'CircleTypeSymbol', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/CirclesLegend/index.js');

  __REACT_HOT_LOADER__.register(CircleTypeRow, 'CircleTypeRow', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/CirclesLegend/index.js');

  __REACT_HOT_LOADER__.register(NormalWeight, 'NormalWeight', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/CirclesLegend/index.js');

  __REACT_HOT_LOADER__.register(CirclesLegend, 'CirclesLegend', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/CirclesLegend/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/CirclesLegend/index.js');
}();

;

/***/ }),

/***/ "./src/components/molecules/ContextualInfoPopup/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reactLeaflet = __webpack_require__("./node_modules/react-leaflet/es/index.js");

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ContextualInfoPopup = function ContextualInfoPopup(_ref) {
  var show = _ref.show,
      data = _ref.data,
      position = _ref.position,
      onClose = _ref.onClose;

  if (!show) {
    return null;
  }
  var props = { data: data };
  return _react2.default.createElement(
    _reactLeaflet.Popup,
    { onClose: onClose, position: position },
    _react2.default.createElement(_components.ContextualInfo, props)
  );
};

var _default = ContextualInfoPopup;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(ContextualInfoPopup, 'ContextualInfoPopup', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/ContextualInfoPopup/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/ContextualInfoPopup/index.js');
}();

;

/***/ }),

/***/ "./src/components/molecules/ExportPreview/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral([''], ['']),
    _templateObject2 = _taggedTemplateLiteral(['\n  max-width: 100%;\n'], ['\n  max-width: 100%;\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var PreviewHolder = _styledComponents2.default.div(_templateObject);
var PreviewImage = _styledComponents2.default.img(_templateObject2);

var ExportPreview = function ExportPreview(_ref) {
  var isPreviewing = _ref.isPreviewing,
      mapPreview = _ref.mapPreview;
  return _react2.default.createElement(
    PreviewHolder,
    null,
    _react2.default.createElement(_components.LoadingIndicator, { isLoading: isPreviewing }),
    !isPreviewing && mapPreview && _react2.default.createElement(PreviewImage, { src: mapPreview.url, alt: 'Apper\xE7u de la carte avant export' })
  );
};

ExportPreview.propTypes = {
  mapPreview: _propTypes2.default.object,
  isPreviewing: _propTypes2.default.bool
};

var _default = ExportPreview;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(PreviewHolder, 'PreviewHolder', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/ExportPreview/index.js');

  __REACT_HOT_LOADER__.register(PreviewImage, 'PreviewImage', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/ExportPreview/index.js');

  __REACT_HOT_LOADER__.register(ExportPreview, 'ExportPreview', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/ExportPreview/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/ExportPreview/index.js');
}();

;

/***/ }),

/***/ "./src/components/molecules/FixedPartnersLogo/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  position: fixed;\n  width: ', 'px;\n  top:', 'px;\n  bottom:0;\n  right:', 'px;\n  z-index: 1000;\n  transition-delay: ', 's;\n  transition-duration: ', 's;\n  transition-property: right;\n  transition-timing-function: ease-in-out;\n  display: flex;\n  align-items:center;\n  flex-direction: column;\n  justify-content: space-around;\n  & > div {\n    max-height: 900px;\n    flex-grow: 1;\n    display: flex;\n    justify-content: space-between;\n    padding-top: 50px;\n    padding-bottom: 50px;\n  }\n'], ['\n  position: fixed;\n  width: ', 'px;\n  top:', 'px;\n  bottom:0;\n  right:', 'px;\n  z-index: 1000;\n  transition-delay: ', 's;\n  transition-duration: ', 's;\n  transition-property: right;\n  transition-timing-function: ease-in-out;\n  display: flex;\n  align-items:center;\n  flex-direction: column;\n  justify-content: space-around;\n  & > div {\n    max-height: 900px;\n    flex-grow: 1;\n    display: flex;\n    justify-content: space-between;\n    padding-top: 50px;\n    padding-bottom: 50px;\n  }\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styles = __webpack_require__("./src/utils/styles.js");

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var FixedBar = _styledComponents2.default.div(_templateObject, _styles.sidebar.width, _styles.navbar.height, function (_ref) {
  var visible = _ref.visible;
  return visible ? 0 : -400;
}, function (_ref2) {
  var visible = _ref2.visible;
  return visible ? .33 : 0;
}, function (_ref3) {
  var visible = _ref3.visible;
  return visible ? .33 : 0;
});

var FixedPartnersLogo = function FixedPartnersLogo(props) {
  return _react2.default.createElement(
    FixedBar,
    props,
    _react2.default.createElement(_components.PartnersLogo, null)
  );
};

var _default = FixedPartnersLogo;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(FixedBar, 'FixedBar', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/FixedPartnersLogo/index.js');

  __REACT_HOT_LOADER__.register(FixedPartnersLogo, 'FixedPartnersLogo', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/FixedPartnersLogo/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/FixedPartnersLogo/index.js');
}();

;

/***/ }),

/***/ "./src/components/molecules/GeoJSONLabelsLayer/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactLeaflet = __webpack_require__("./node_modules/react-leaflet/es/index.js");

var _leaflet = __webpack_require__("./node_modules/leaflet/dist/leaflet-src.js");

var _centroid2 = __webpack_require__("./node_modules/@turf/centroid/index.js");

var _centroid3 = _interopRequireDefault(_centroid2);

var _bbox = __webpack_require__("./node_modules/@turf/bbox/index.js");

var _bbox2 = _interopRequireDefault(_bbox);

var _bboxPolygon = __webpack_require__("./node_modules/@turf/bbox-polygon/index.js");

var _bboxPolygon2 = _interopRequireDefault(_bboxPolygon);

var _flatten = __webpack_require__("./node_modules/@turf/flatten/index.js");

var _flatten2 = _interopRequireDefault(_flatten);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GeoJSONLabelsLayer = function (_Component) {
  _inherits(GeoJSONLabelsLayer, _Component);

  function GeoJSONLabelsLayer(props, context) {
    _classCallCheck(this, GeoJSONLabelsLayer);

    var _this = _possibleConstructorReturn(this, (GeoJSONLabelsLayer.__proto__ || Object.getPrototypeOf(GeoJSONLabelsLayer)).call(this, props, context));

    _this.tooltips = [];
    return _this;
  }

  _createClass(GeoJSONLabelsLayer, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      return false;
    }
  }, {
    key: 'addToTooltips',
    value: function addToTooltips(ref, scalerank) {
      this.tooltips.push({
        tooltipRef: ref,
        scalerank: scalerank
      });
    }
  }, {
    key: 'checkZoom',
    value: function checkZoom() {
      var minZoom = this.props.minZoom;
      var map = this.context.map;

      var zoom = map.getZoom();
      if (zoom >= minZoom) {
        this.tooltips.filter(function (_ref) {
          var scalerank = _ref.scalerank;
          return scalerank > zoom;
        }).forEach(this.hideTooltip);

        this.tooltips.filter(function (_ref2) {
          var scalerank = _ref2.scalerank;
          return scalerank <= zoom;
        }).forEach(this.showTooltip);
      } else {
        this.tooltips.forEach(this.hideTooltip);
      }
    }
  }, {
    key: 'showTooltip',
    value: function showTooltip(tooltip) {
      if (tooltip.tooltipRef) {
        var leafletElement = tooltip.tooltipRef.leafletElement;

        var content = leafletElement._tooltip._container.firstChild;
        if (content.style.opacity != 1 || !content.style.opacity) {
          content.style.opacity = 1;
        }
      }
    }
  }, {
    key: 'hideTooltip',
    value: function hideTooltip(tooltip) {
      if (tooltip.tooltipRef) {
        var leafletElement = tooltip.tooltipRef.leafletElement;

        var content = leafletElement._tooltip._container.firstChild;
        if (content.style.opacity != 0 || !content.style.opacity) {
          content.style.opacity = 0;
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          data = _props.data,
          layerName = _props.layerName,
          bindFeatureToLabel = _props.bindFeatureToLabel,
          useMultipleCentroids = _props.useMultipleCentroids;
      var map = this.context.map;

      map.on('zoomend', function () {
        return _this2.checkZoom();
      });
      var i = 0;
      var j = 0;
      var len = data.features.length;
      var Tooltips = [];

      var _loop = function _loop() {
        var feature = data.features[i];
        var label = feature.properties.name;
        var labelElement = bindFeatureToLabel(feature, label);
        var centroids = [];

        if (useMultipleCentroids && feature.geometry.type === 'MultiPolygon') {
          var polygons = (0, _flatten2.default)(feature);
          polygons.features.forEach(function (p) {
            return centroids.push((0, _centroid3.default)(p));
          });
        } else {
          centroids.push((0, _centroid3.default)(feature));
        }

        centroids.forEach(function (_centroid, j) {
          var center = _centroid.geometry.coordinates;
          Tooltips.push(_react2.default.createElement(
            _reactLeaflet.CircleMarker,
            {
              ref: function ref(_ref3) {
                return _this2.addToTooltips(_ref3, feature.properties.scalerank);
              },
              fill: false,
              stroke: false,
              key: 'marker-' + i + '-' + j,
              center: [center[1], center[0]]
            },
            _react2.default.createElement(
              _reactLeaflet.Tooltip,
              {
                pane: layerName + '-tooltip',
                style: { opacity: 1 },
                direction: 'center',
                sticky: false,
                interactive: false,
                permanent: true
              },
              labelElement
            )
          ));
        });
      };

      for (i; i < len; i++) {
        _loop();
      }
      return _react2.default.createElement(
        _reactLeaflet.Pane,
        { name: layerName + '-tooltip', style: { zIndex: 1200 } },
        _react2.default.createElement(
          _reactLeaflet.LayerGroup,
          { onAdd: function onAdd() {
              return _this2.checkZoom();
            } },
          Tooltips
        )
      );
    }
  }]);

  return GeoJSONLabelsLayer;
}(_react.Component);

GeoJSONLabelsLayer.propTypes = {
  bindFeatureToLabel: _propTypes2.default.func.isRequired,
  minZoom: _propTypes2.default.number,
  data: _propTypes2.default.shape({
    features: _propTypes2.default.array
  }).isRequired
};
GeoJSONLabelsLayer.defaultProps = {
  minZoom: 0,
  useMultipleCentroids: false
};


GeoJSONLabelsLayer.contextTypes = {
  map: _propTypes2.default.object
};
var _default = GeoJSONLabelsLayer;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(GeoJSONLabelsLayer, 'GeoJSONLabelsLayer', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/GeoJSONLabelsLayer/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/GeoJSONLabelsLayer/index.js');
}();

;

/***/ }),

/***/ "./src/components/molecules/IconButton/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _templateObject = _taggedTemplateLiteral(['\n  0% { display: none; opacity: 0; }\n  1% { display: block: opacity: 0; }\n  100% { display: block; opacity: 1; }\n'], ['\n  0% { display: none; opacity: 0; }\n  1% { display: block: opacity: 0; }\n  100% { display: block; opacity: 1; }\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  max-width: ', ';\n  width: ', ';\n  padding: ', ';\n  flex: 0 0 2.5em;\n  box-sizing: border-box;\n  ', '\n  ', '\n'], ['\n  max-width: ', ';\n  width: ', ';\n  padding: ', ';\n  flex: 0 0 2.5em;\n  box-sizing: border-box;\n  ', '\n  ', '\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n    overflow: hidden;\n    transition: max-width 250ms ease-in-out;\n    will-change: max-width;\n    & .text {\n      display: none;\n    }\n    &:hover {\n      max-width: 100%;\n      & .text {\n        display: block;\n        animation: ', ' 250ms;\n      }\n    }\n  '], ['\n    overflow: hidden;\n    transition: max-width 250ms ease-in-out;\n    will-change: max-width;\n    & .text {\n      display: none;\n    }\n    &:hover {\n      max-width: 100%;\n      & .text {\n        display: block;\n        animation: ', ' 250ms;\n      }\n    }\n  ']),
    _templateObject4 = _taggedTemplateLiteral(['\n    @media screen and (max-width: ', 'px) {\n      width: auto;\n      flex: 0 !important;\n    }\n  '], ['\n    @media screen and (max-width: ', 'px) {\n      width: auto;\n      flex: 0 !important;\n    }\n  ']),
    _templateObject5 = _taggedTemplateLiteral(['\n  padding: 0.4375em;\n  @media screen and (max-width: ', 'px) {\n    display: ', ';\n  }\n'], ['\n  padding: 0.4375em;\n  @media screen and (max-width: ', 'px) {\n    display: ', ';\n  }\n']),
    _templateObject6 = _taggedTemplateLiteral(['\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n'], ['\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n']),
    _templateObject7 = _taggedTemplateLiteral(['\n  flex: none;\n'], ['\n  flex: none;\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledTools = __webpack_require__("./node_modules/styled-tools/index.js");

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var fadeIn = (0, _styledComponents.keyframes)(_templateObject);

var StyledButton = (0, _styledComponents2.default)(_components.Button)(_templateObject2, function (props) {
  return props.hasText && !props.collapsed ? '100%' : '2.5em';
}, (0, _styledTools.ifProp)('hasText', 'auto', '2.5em'), (0, _styledTools.ifProp)('hasText', '0 0.4375em', 0), (0, _styledTools.ifProp)('collapsed', (0, _styledComponents.css)(_templateObject3, fadeIn)), (0, _styledTools.ifProp)('responsive', (0, _styledComponents.css)(_templateObject4, (0, _styledTools.get)('breakpoint'))));

var Text = _styledComponents2.default.span(_templateObject5, (0, _styledTools.get)('breakpoint'), (0, _styledTools.ifProp)('responsive', 'none !important'));

var Wrapper = _styledComponents2.default.div(_templateObject6);

var StyledIcon = (0, _styledComponents2.default)(_components.Icon)(_templateObject7);

var IconButton = function IconButton(_ref) {
  var icon = _ref.icon,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, ['icon', 'children']);

  var breakpoint = props.breakpoint,
      right = props.right,
      responsive = props.responsive,
      height = props.height;

  var iconElement = _react2.default.createElement(StyledIcon, { height: height / 2.5, icon: icon });
  return _react2.default.createElement(
    StyledButton,
    _extends({ hasText: !!children }, props),
    _react2.default.createElement(
      Wrapper,
      null,
      right || iconElement,
      children && _react2.default.createElement(
        Text,
        { className: 'text', responsive: responsive, breakpoint: breakpoint },
        children
      ),
      right && iconElement
    )
  );
};

IconButton.propTypes = {
  icon: _propTypes2.default.string.isRequired,
  responsive: _propTypes2.default.bool,
  breakpoint: _propTypes2.default.number,
  collapsed: _propTypes2.default.bool,
  right: _propTypes2.default.bool,
  height: _propTypes2.default.number,
  children: _propTypes2.default.node
};

IconButton.defaultProps = {
  breakpoint: 420
};

var _default = IconButton;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(fadeIn, 'fadeIn', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/IconButton/index.js');

  __REACT_HOT_LOADER__.register(StyledButton, 'StyledButton', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/IconButton/index.js');

  __REACT_HOT_LOADER__.register(Text, 'Text', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/IconButton/index.js');

  __REACT_HOT_LOADER__.register(Wrapper, 'Wrapper', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/IconButton/index.js');

  __REACT_HOT_LOADER__.register(StyledIcon, 'StyledIcon', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/IconButton/index.js');

  __REACT_HOT_LOADER__.register(IconButton, 'IconButton', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/IconButton/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/IconButton/index.js');
}();

;

/***/ }),

/***/ "./src/components/molecules/IconLink/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  font-size: ', ';\n  margin: ', ';\n  @media screen and (max-width: 420px) {\n    margin: ', ';\n  }\n'], ['\n  font-size: ', ';\n  margin: ', ';\n  @media screen and (max-width: 420px) {\n    margin: ', ';\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  @media screen and (max-width: 420px) {\n    display: ', ';\n  }\n'], ['\n  @media screen and (max-width: 420px) {\n    display: ', ';\n  }\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var fontSize = function fontSize(_ref) {
  var height = _ref.height;
  return height ? height / 3 / 16 + 'rem' : '0.75em';
};

var margin = function margin(_ref2) {
  var hasText = _ref2.hasText,
      right = _ref2.right;

  if (hasText) {
    return right ? '0 0 0 0.25em' : '0 0.25em 0 0';
  }
  return 0;
};

var StyledIcon = (0, _styledComponents2.default)(_components.Icon)(_templateObject, fontSize, margin, function (_ref3) {
  var responsive = _ref3.responsive;
  return responsive && 0;
});

var Text = _styledComponents2.default.span(_templateObject2, function (_ref4) {
  var responsive = _ref4.responsive;
  return responsive && 'none';
});

var IconLink = function IconLink(_ref5) {
  var height = _ref5.height,
      icon = _ref5.icon,
      right = _ref5.right,
      responsive = _ref5.responsive,
      children = _ref5.children,
      props = _objectWithoutProperties(_ref5, ['height', 'icon', 'right', 'responsive', 'children']);

  var iconElement = _react2.default.createElement(StyledIcon, {
    height: height,
    icon: icon,
    hasText: !!children,
    right: right,
    responsive: responsive,
    palette: props.palette,
    reverse: props.reverse
  });
  return _react2.default.createElement(
    _components.Link,
    props,
    right || iconElement,
    _react2.default.createElement(
      Text,
      { responsive: responsive },
      children
    ),
    right && iconElement
  );
};

IconLink.propTypes = {
  icon: _propTypes2.default.string.isRequired,
  height: _propTypes2.default.number,
  palette: _propTypes2.default.string,
  reverse: _propTypes2.default.bool,
  responsive: _propTypes2.default.bool,
  right: _propTypes2.default.bool,
  children: _propTypes2.default.node
};

var _default = IconLink;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(fontSize, 'fontSize', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/IconLink/index.js');

  __REACT_HOT_LOADER__.register(margin, 'margin', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/IconLink/index.js');

  __REACT_HOT_LOADER__.register(StyledIcon, 'StyledIcon', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/IconLink/index.js');

  __REACT_HOT_LOADER__.register(Text, 'Text', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/IconLink/index.js');

  __REACT_HOT_LOADER__.register(IconLink, 'IconLink', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/IconLink/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/IconLink/index.js');
}();

;

/***/ }),

/***/ "./src/components/molecules/LayerFilterGroup/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n  cursor: pointer;\n  margin-bottom:0;\n  &:hover {\n    color: ', ';\n  }\n'], ['\n  cursor: pointer;\n  margin-bottom:0;\n  &:hover {\n    color: ', ';\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  margin-bottom: 0.5em;\n   \n  color: ', ';\n  &.hidden {\n    color: ', ';\n  }\n\n'], ['\n  margin-bottom: 0.5em;\n   \n  color: ', ';\n  &.hidden {\n    color: ', ';\n  }\n\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledTheme = __webpack_require__("./node_modules/styled-theme/index.js");

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _reactRedux = __webpack_require__("./node_modules/react-redux/es/index.js");

var _visibility = __webpack_require__("./node_modules/react-icons/lib/md/visibility.js");

var _visibility2 = _interopRequireDefault(_visibility);

var _visibilityOff = __webpack_require__("./node_modules/react-icons/lib/md/visibility-off.js");

var _visibilityOff2 = _interopRequireDefault(_visibilityOff);

var _actions = __webpack_require__("./src/store/actions.js");

var _components = __webpack_require__("./src/components/index.js");

var _selectors = __webpack_require__("./src/store/selectors.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); } // external deps


// assets


// inner depencies


var Heading = (0, _styledComponents2.default)(_components.Heading)(_templateObject, (0, _styledTheme.palette)('grayscale', 0));

var LayerContainer = _styledComponents2.default.div(_templateObject2, (0, _styledTheme.palette)('grayscale', 1), (0, _styledTheme.palette)('grayscale', 3));

var LayerFilterGroup = function (_Component) {
  _inherits(LayerFilterGroup, _Component);

  function LayerFilterGroup() {
    _classCallCheck(this, LayerFilterGroup);

    return _possibleConstructorReturn(this, (LayerFilterGroup.__proto__ || Object.getPrototypeOf(LayerFilterGroup)).apply(this, arguments));
  }

  _createClass(LayerFilterGroup, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        layer: this.props.layer
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          toggleVisibility = _props.toggleVisibility,
          layer = _props.layer,
          heading = _props.heading,
          headingStyle = _props.headingStyle,
          children = _props.children;

      var Icon = layer.visible ? _visibility2.default : _visibilityOff2.default;
      var klass = layer.visible ? '' : 'hidden';
      return _react2.default.createElement(
        LayerContainer,
        { className: klass },
        _react2.default.createElement(
          Heading,
          { level: 4,
            style: _extends({
              marginTop: 0
            }, headingStyle),
            onClick: toggleVisibility(layer) },
          _react2.default.createElement(
            'span',
            null,
            _react2.default.createElement(Icon, null),
            ' ',
            heading
          )
        ),
        children
      );
    }
  }]);

  return LayerFilterGroup;
}(_react.Component);

LayerFilterGroup.propTypes = {
  headingStyle: _propTypes2.default.object,
  hidden: _propTypes2.default.bool,
  layer: _propTypes2.default.object.isRequired,
  heading: _propTypes2.default.string
};
LayerFilterGroup.childContextTypes = {
  layer: _propTypes2.default.object
};
;
var mapStateToProps = function mapStateToProps(state, props) {
  var layer = _selectors.fromLayers.layerByName(state, props.layer);
  return {
    hidden: !layer.visible,
    heading: props.heading,
    layer: layer
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    toggleVisibility: function toggleVisibility(layer) {
      return function () {
        return dispatch((0, _actions.toggleLayerVisibility)(layer));
      };
    }
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(LayerFilterGroup);

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Heading, 'Heading', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LayerFilterGroup/index.js');

  __REACT_HOT_LOADER__.register(LayerContainer, 'LayerContainer', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LayerFilterGroup/index.js');

  __REACT_HOT_LOADER__.register(LayerFilterGroup, 'LayerFilterGroup', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LayerFilterGroup/index.js');

  __REACT_HOT_LOADER__.register(mapStateToProps, 'mapStateToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LayerFilterGroup/index.js');

  __REACT_HOT_LOADER__.register(mapDispatchToProps, 'mapDispatchToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LayerFilterGroup/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LayerFilterGroup/index.js');
}();

;

/***/ }),

/***/ "./src/components/molecules/LegendContent/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _templateObject = _taggedTemplateLiteral([''], ['']),
    _templateObject2 = _taggedTemplateLiteral(['\n  padding-top: ', 'px;\n  overflow: auto;\n'], ['\n  padding-top: ', 'px;\n  overflow: auto;\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _components = __webpack_require__("./src/components/index.js");

var _utils = __webpack_require__("./src/utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Table = _styledComponents2.default.table(_templateObject);

var Holder = _styledComponents2.default.div(_templateObject2, function (_ref) {
  var print = _ref.print;
  return print ? 0 : 30;
});

var LegendContent = function LegendContent(_ref2) {
  var filters = _ref2.filters,
      layers = _ref2.layers,
      circleSizes = _ref2.circleSizes,
      print = _ref2.print;
  var showAridity = layers.aridity.visible,
      showTemperatures = layers.temperatures.visible,
      showCircles = layers.circles.visible;

  var allTypes = _extends({}, filters.circles.types, filters.temperatures, filters.aridity);
  var noFilters = (0, _utils.visibleTypes)(allTypes).length === 0;
  var noData = !showTemperatures && !showCircles && !showAridity || noFilters;
  return _react2.default.createElement(
    Holder,
    { print: print },
    _react2.default.createElement(
      Table,
      null,
      _react2.default.createElement(_components.TemperaturesLegend, { print: print, filters: filters, layers: layers }),
      showCircles && _react2.default.createElement(_components.CirclesLegend, { print: print, filters: filters, circleSizes: circleSizes }),
      noData && _react2.default.createElement(
        'tbody',
        null,
        _react2.default.createElement(
          'tr',
          null,
          _react2.default.createElement(
            'th',
            null,
            'Pas de donn\xE9es \xE0 visualiser'
          )
        )
      )
    ),
    !print && _react2.default.createElement(_components.LegendMoreInfos, null)
  );
};
LegendContent.propTypes = {
  filters: _propTypes2.default.object,
  layers: _propTypes2.default.object,
  circleSizes: _propTypes2.default.object,
  print: _propTypes2.default.bool
};
LegendContent.defaultProps = {
  print: false
};

var _default = LegendContent;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Table, 'Table', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LegendContent/index.js');

  __REACT_HOT_LOADER__.register(Holder, 'Holder', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LegendContent/index.js');

  __REACT_HOT_LOADER__.register(LegendContent, 'LegendContent', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LegendContent/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LegendContent/index.js');
}();

;

/***/ }),

/***/ "./src/components/molecules/LegendMoreInfos/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  margin-top: 1em;\n'], ['\n  margin-top: 1em;\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__("./node_modules/react-redux/es/index.js");

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _reactMarkdown = __webpack_require__("./node_modules/react-markdown/src/react-markdown.js");

var _reactMarkdown2 = _interopRequireDefault(_reactMarkdown);

var _components = __webpack_require__("./src/components/index.js");

var _actions = __webpack_require__("./src/store/actions.js");

var _selectors = __webpack_require__("./src/store/selectors.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Holder = _styledComponents2.default.div(_templateObject);
var MoreInfoTitle = function MoreInfoTitle() {
  return _react2.default.createElement(
    'span',
    null,
    '\xC0 propos de la l\xE9gende'
  );
};

var LegendMoreInfos = function LegendMoreInfos(_ref) {
  var opened = _ref.opened,
      show = _ref.show,
      hide = _ref.hide;
  return _react2.default.createElement(
    Holder,
    null,
    _react2.default.createElement(
      _components.Link,
      { onClick: show },
      'Plus d\'infos sur la l\xE9gende'
    ),
    _react2.default.createElement(
      _components.Modal,
      { isOpen: opened, title: _react2.default.createElement(MoreInfoTitle, null), onClose: hide, closeable: true },
      _react2.default.createElement(_reactMarkdown2.default, { source: _components.MarkdownContent.LegendInfos })
    )
  );
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    opened: _selectors.fromLegend.moreInfosVisible(state)
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    show: function show() {
      return dispatch((0, _actions.showMoreInfos)());
    },
    hide: function hide() {
      return dispatch((0, _actions.hideMoreInfos)());
    }
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(LegendMoreInfos);

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Holder, 'Holder', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LegendMoreInfos/index.js');

  __REACT_HOT_LOADER__.register(MoreInfoTitle, 'MoreInfoTitle', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LegendMoreInfos/index.js');

  __REACT_HOT_LOADER__.register(LegendMoreInfos, 'LegendMoreInfos', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LegendMoreInfos/index.js');

  __REACT_HOT_LOADER__.register(mapStateToProps, 'mapStateToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LegendMoreInfos/index.js');

  __REACT_HOT_LOADER__.register(mapDispatchToProps, 'mapDispatchToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LegendMoreInfos/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LegendMoreInfos/index.js');
}();

;

/***/ }),

/***/ "./src/components/molecules/LegendMoreInfosPrint/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  margin-top: 1em;\n  padding: 15px;\n  max-width: ', 'px\n'], ['\n  margin-top: 1em;\n  padding: 15px;\n  max-width: ', 'px\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  font-weight: bold;\n'], ['\n  font-weight: bold;\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__("./node_modules/react-redux/es/index.js");

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _reactMarkdown = __webpack_require__("./node_modules/react-markdown/src/react-markdown.js");

var _reactMarkdown2 = _interopRequireDefault(_reactMarkdown);

var _components = __webpack_require__("./src/components/index.js");

var _formats = __webpack_require__("./src/utils/formats.js");

var _formats2 = _interopRequireDefault(_formats);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Holder = _styledComponents2.default.div(_templateObject, _formats2.default.A4px[1]);

var Bold = _styledComponents2.default.span(_templateObject2);
var MoreInfoTitle = function MoreInfoTitle() {
  return _react2.default.createElement(
    Bold,
    null,
    '\xC0 propos de la l\xE9gende'
  );
};

var LegendMoreInfos = function LegendMoreInfos(_ref) {
  var opened = _ref.opened,
      show = _ref.show,
      hide = _ref.hide;
  return _react2.default.createElement(
    Holder,
    null,
    _react2.default.createElement(
      _components.Heading,
      { level: 2 },
      _react2.default.createElement(MoreInfoTitle, null)
    ),
    _react2.default.createElement(_reactMarkdown2.default, { source: _components.MarkdownContent.LegendInfos })
  );
};

var _default = LegendMoreInfos;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Holder, 'Holder', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LegendMoreInfosPrint/index.js');

  __REACT_HOT_LOADER__.register(Bold, 'Bold', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LegendMoreInfosPrint/index.js');

  __REACT_HOT_LOADER__.register(MoreInfoTitle, 'MoreInfoTitle', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LegendMoreInfosPrint/index.js');

  __REACT_HOT_LOADER__.register(LegendMoreInfos, 'LegendMoreInfos', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LegendMoreInfosPrint/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LegendMoreInfosPrint/index.js');
}();

;

/***/ }),

/***/ "./src/components/molecules/LegendToggleButton/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__("./node_modules/react-redux/es/index.js");

var _actions = __webpack_require__("./src/store/actions.js");

var _selectors = __webpack_require__("./src/store/selectors.js");

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LegendToggleButton = function LegendToggleButton(props) {
  return _react2.default.createElement(
    _components.ToggleButton,
    _extends({ align: 'right' }, props),
    'Masquer la l\xE9gende'
  );
};

var mapStateToProps = function mapStateToProps() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _selectors.fromLegend.initialState;
  return {
    toggled: _selectors.fromLegend.isOpened(state)
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    toggle: function toggle() {
      return dispatch((0, _actions.toggleLegend)());
    }
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(LegendToggleButton);

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(LegendToggleButton, 'LegendToggleButton', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LegendToggleButton/index.js');

  __REACT_HOT_LOADER__.register(mapStateToProps, 'mapStateToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LegendToggleButton/index.js');

  __REACT_HOT_LOADER__.register(mapDispatchToProps, 'mapDispatchToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LegendToggleButton/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LegendToggleButton/index.js');
}();

;

/***/ }),

/***/ "./src/components/molecules/LegendTooltips/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n  max-width: 400px;\n  font-weight: normal;\n'], ['\n  max-width: 400px;\n  font-weight: normal;\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  position: relative;\n  z-index: 2000;\n  font-family: ', ';\n'], ['\n  position: relative;\n  z-index: 2000;\n  font-family: ', ';\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactMarkdown = __webpack_require__("./node_modules/react-markdown/src/react-markdown.js");

var _reactMarkdown2 = _interopRequireDefault(_reactMarkdown);

var _reactTooltip = __webpack_require__("./node_modules/react-tooltip/dist/index.js");

var _reactTooltip2 = _interopRequireDefault(_reactTooltip);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledTheme = __webpack_require__("./node_modules/styled-theme/index.js");

var _circles = __webpack_require__("./src/utils/circles.js");

var circles = _interopRequireWildcard(_circles);

var _aridity = __webpack_require__("./src/utils/aridity.js");

var aridity = _interopRequireWildcard(_aridity);

var _utils = __webpack_require__("./src/utils/index.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var LegendTooltipContent = _styledComponents2.default.div(_templateObject);
var Holder = _styledComponents2.default.div(_templateObject2, (0, _styledTheme.font)('primary'));

var LegendTooltips = function (_Component) {
  _inherits(LegendTooltips, _Component);

  function LegendTooltips() {
    _classCallCheck(this, LegendTooltips);

    return _possibleConstructorReturn(this, (LegendTooltips.__proto__ || Object.getPrototypeOf(LegendTooltips)).apply(this, arguments));
  }

  _createClass(LegendTooltips, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(_ref) {
      var toLayers = _ref.layers,
          toFilters = _ref.filters;
      var _props = this.props,
          _props$layers = _props.layers,
          circlesVisible = _props$layers.circles.visible,
          aridityVisible = _props$layers.aridity.visible,
          _props$filters = _props.filters,
          types = _props$filters.circles.types,
          aridity = _props$filters.aridity;

      var shouldUpdateTooltips = circlesVisible != toLayers.circles.visible || aridityVisible != toLayers.aridity.visible || (0, _utils.visibleTypes)(types).length != (0, _utils.visibleTypes)(toFilters.circles.types).length || (0, _utils.visibleTypes)(aridity).length != (0, _utils.visibleTypes)(toFilters.aridity).length;

      if (shouldUpdateTooltips) {
        (0, _utils.updateTooltips)();
      }

      return false;
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        Holder,
        null,
        _react2.default.createElement(
          _reactTooltip2.default,
          { id: 'tooltip-nb-months' },
          _react2.default.createElement(
            LegendTooltipContent,
            null,
            _react2.default.createElement(
              'span',
              null,
              'Recevant moins de 30mm de pr\xE9cipitations'
            )
          )
        ),
        _react2.default.createElement(
          _reactTooltip2.default,
          { id: 'tooltip-regime', place: 'right' },
          _react2.default.createElement(
            LegendTooltipContent,
            null,
            _react2.default.createElement(
              'span',
              null,
              'Et r\xE9gime des pr\xE9cipitations'
            )
          )
        ),
        aridity.allAridity().map(function (_ref2, key) {
          var value = _ref2.value,
              description = _ref2.description;
          return _react2.default.createElement(
            _reactTooltip2.default,
            {
              key: key,
              place: 'right',
              id: 'tooltip-aridity-' + value },
            _react2.default.createElement(
              LegendTooltipContent,
              null,
              _react2.default.createElement(_reactMarkdown2.default, { source: description })
            )
          );
        }),
        circles.allDroughtRegimes().map(function (_ref3, key) {
          var value = _ref3.value,
              regime_full = _ref3.regime_full;
          return _react2.default.createElement(
            _reactTooltip2.default,
            {
              key: key,
              place: 'right',
              'class': 'custom-tooltip',
              id: 'tooltip-circle-' + value },
            _react2.default.createElement(
              LegendTooltipContent,
              null,
              _react2.default.createElement(_reactMarkdown2.default, { source: regime_full })
            )
          );
        })
      );
    }
  }]);

  return LegendTooltips;
}(_react.Component);

var _default = LegendTooltips;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(LegendTooltipContent, 'LegendTooltipContent', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LegendTooltips/index.js');

  __REACT_HOT_LOADER__.register(Holder, 'Holder', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LegendTooltips/index.js');

  __REACT_HOT_LOADER__.register(LegendTooltips, 'LegendTooltips', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LegendTooltips/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LegendTooltips/index.js');
}();

;

/***/ }),

/***/ "./src/components/molecules/LoadingIndicator/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  transition: opacity .33 ease-in-out;\n  position: absolute;\n  display: flex;\n  align-items: center;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: rgba(255,255,255,0.8);\n  z-index: 800;\n  opacity: ', ';\n  pointer-events: ', ';\n'], ['\n  transition: opacity .33 ease-in-out;\n  position: absolute;\n  display: flex;\n  align-items: center;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: rgba(255,255,255,0.8);\n  z-index: 800;\n  opacity: ', ';\n  pointer-events: ', ';\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledTheme = __webpack_require__("./node_modules/styled-theme/index.js");

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Holder = _styledComponents2.default.div(_templateObject, function (_ref) {
  var isLoading = _ref.isLoading;
  return isLoading ? 1 : 0;
}, function (_ref2) {
  var isLoading = _ref2.isLoading;
  return isLoading ? 'auto' : 'none';
});

var LoadingIndicator = function LoadingIndicator(_ref3) {
  var _ref3$isLoading = _ref3.isLoading,
      isLoading = _ref3$isLoading === undefined ? false : _ref3$isLoading;
  return _react2.default.createElement(
    Holder,
    { isLoading: isLoading },
    _react2.default.createElement(_components.LoadingIcon, null)
  );
};

var _default = LoadingIndicator;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Holder, 'Holder', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LoadingIndicator/index.js');

  __REACT_HOT_LOADER__.register(LoadingIndicator, 'LoadingIndicator', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LoadingIndicator/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LoadingIndicator/index.js');
}();

;

/***/ }),

/***/ "./src/components/molecules/Modal/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _templateObject = _taggedTemplateLiteral(['\n  body.ReactModal__Body--open {\n    overflow: hidden;\n  }\n'], ['\n  body.ReactModal__Body--open {\n    overflow: hidden;\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  position: fixed;\n  background-color: rgba(0, 0, 0, 0.5);\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n  z-index: 9999;\n  transition: opacity 250ms ease-in-out;\n  opacity: 0;\n  &[class*="after-open"] {\n    opacity: 1;\n  }\n  &[class*="before-close"] {\n    opacity: 0;\n  }\n'], ['\n  position: fixed;\n  background-color: rgba(0, 0, 0, 0.5);\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n  z-index: 9999;\n  transition: opacity 250ms ease-in-out;\n  opacity: 0;\n  &[class*="after-open"] {\n    opacity: 1;\n  }\n  &[class*="before-close"] {\n    opacity: 0;\n  }\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  position: absolute;\n  display: flex;\n  flex-direction: column;\n  font-family: ', ';\n  font-size: 1rem;\n  background-color: ', ';\n  border-radius: 0.125em;\n  color: ', ';\n  top: calc(50% - 1rem);\n  left: calc(50% - 1rem);\n  right: auto;\n  bottom: auto;\n  margin: 1rem calc(-50% + 1rem) 1rem 1rem;\n  transform: translate(-50%, 100%);\n  transition: transform 250ms ease-in-out;\n  outline: none;\n  box-sizing: border-box;\n  min-width: 320px;\n  max-width: calc(800px - 1rem);\n  max-height: calc(100% - 1rem);\n  padding-top: ', ';\n  @media screen and (max-width: 640px) {\n    width: calc(100% - 1rem);\n    min-width: 0;\n  }\n  &[class*="after-open"] {\n    transform: translate(-50%, -50%);\n  }\n  &[class*="before-close"] {\n    transform: translate(-50%, 100%);\n  }\n'], ['\n  position: absolute;\n  display: flex;\n  flex-direction: column;\n  font-family: ', ';\n  font-size: 1rem;\n  background-color: ', ';\n  border-radius: 0.125em;\n  color: ', ';\n  top: calc(50% - 1rem);\n  left: calc(50% - 1rem);\n  right: auto;\n  bottom: auto;\n  margin: 1rem calc(-50% + 1rem) 1rem 1rem;\n  transform: translate(-50%, 100%);\n  transition: transform 250ms ease-in-out;\n  outline: none;\n  box-sizing: border-box;\n  min-width: 320px;\n  max-width: calc(800px - 1rem);\n  max-height: calc(100% - 1rem);\n  padding-top: ', ';\n  @media screen and (max-width: 640px) {\n    width: calc(100% - 1rem);\n    min-width: 0;\n  }\n  &[class*="after-open"] {\n    transform: translate(-50%, -50%);\n  }\n  &[class*="before-close"] {\n    transform: translate(-50%, 100%);\n  }\n']),
    _templateObject4 = _taggedTemplateLiteral(['\n  display: flex;\n  align-items: center;\n  padding: 1rem;\n  > *:first-child {\n    flex: 1;\n  }\n'], ['\n  display: flex;\n  align-items: center;\n  padding: 1rem;\n  > *:first-child {\n    flex: 1;\n  }\n']),
    _templateObject5 = _taggedTemplateLiteral(['\n  margin: 0 1rem 0 0;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n'], ['\n  margin: 0 1rem 0 0;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n']),
    _templateObject6 = _taggedTemplateLiteral(['\n  overflow: auto;\n  padding: 0 1rem;\n  margin-bottom: 1rem;\n'], ['\n  overflow: auto;\n  padding: 0 1rem;\n  margin-bottom: 1rem;\n']),
    _templateObject7 = _taggedTemplateLiteral(['', ''], ['', '']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _reactModal = __webpack_require__("./node_modules/react-modal/lib/index.js");

var _reactModal2 = _interopRequireDefault(_reactModal);

var _styledTheme = __webpack_require__("./node_modules/styled-theme/index.js");

var _jsxToString = __webpack_require__("./node_modules/jsx-to-string/lib/index.js");

var _jsxToString2 = _interopRequireDefault(_jsxToString);

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

(0, _styledComponents.injectGlobal)(_templateObject);

var overlayStyles = (0, _styledComponents.css)(_templateObject2);

var ModalBox = (0, _styledComponents2.default)(_reactModal2.default)(_templateObject3, (0, _styledTheme.font)('primary'), (0, _styledTheme.palette)('grayscale', 0, true), (0, _styledTheme.palette)('grayscale', 0), function (_ref) {
  var hasHeader = _ref.hasHeader;
  return hasHeader ? 0 : '1rem';
});

var Header = _styledComponents2.default.header(_templateObject4);

var StyledHeading = (0, _styledComponents2.default)(_components.Heading)(_templateObject5);

var Content = _styledComponents2.default.div(_templateObject6);

var StyledReactModal = (0, _styledComponents2.default)(function (_ref2) {
  var className = _ref2.className,
      props = _objectWithoutProperties(_ref2, ['className']);

  return _react2.default.createElement(ModalBox, _extends({ overlayClassName: className, closeTimeoutMS: 250 }, props));
})(_templateObject7, overlayStyles);

var Modal = function Modal(_ref3) {
  var children = _ref3.children,
      title = _ref3.title,
      closeable = _ref3.closeable,
      onClose = _ref3.onClose,
      props = _objectWithoutProperties(_ref3, ['children', 'title', 'closeable', 'onClose']);

  var hasHeader = title || closeable;
  var contentLabel = title ? (0, _jsxToString2.default)(title) : 'Modal';
  return _react2.default.createElement(
    StyledReactModal,
    _extends({
      contentLabel: contentLabel,
      onRequestClose: onClose,
      hasHeader: hasHeader
    }, props),
    hasHeader && _react2.default.createElement(
      Header,
      null,
      _react2.default.createElement(
        StyledHeading,
        { level: 2, reverse: props.reverse },
        title
      ),
      closeable && _react2.default.createElement(_components.IconButton, { icon: 'close', onClick: onClose, plalette: 'white' })
    ),
    _react2.default.createElement(
      Content,
      null,
      children
    )
  );
};

Modal.propTypes = {
  children: _propTypes2.default.node,
  title: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node]),
  closeable: _propTypes2.default.bool,
  reverse: _propTypes2.default.bool,
  onClose: _propTypes2.default.func.isRequired
};

var _default = Modal;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(overlayStyles, 'overlayStyles', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/Modal/index.js');

  __REACT_HOT_LOADER__.register(ModalBox, 'ModalBox', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/Modal/index.js');

  __REACT_HOT_LOADER__.register(Header, 'Header', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/Modal/index.js');

  __REACT_HOT_LOADER__.register(StyledHeading, 'StyledHeading', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/Modal/index.js');

  __REACT_HOT_LOADER__.register(Content, 'Content', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/Modal/index.js');

  __REACT_HOT_LOADER__.register(StyledReactModal, 'StyledReactModal', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/Modal/index.js');

  __REACT_HOT_LOADER__.register(Modal, 'Modal', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/Modal/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/Modal/index.js');
}();

;

/***/ }),

/***/ "./src/components/molecules/PartnersLogo/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral([''], ['']),
    _templateObject2 = _taggedTemplateLiteral(['\n  display: flex;\n  flex-direction: ', ';\n  justify-content: ', ';\n  align-items: center;\n  padding-top: 15px 0;\n  align-self: center;\n  flex-grow: 1;\n  height: ', ';\n'], ['\n  display: flex;\n  flex-direction: ', ';\n  justify-content: ', ';\n  align-items: center;\n  padding-top: 15px 0;\n  align-self: center;\n  flex-grow: 1;\n  height: ', ';\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  text-align: center;\n  &:last-of-type {\n    margin-bottom: 0;\n  }\n'], ['\n  text-align: center;\n  &:last-of-type {\n    margin-bottom: 0;\n  }\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _logomae = __webpack_require__("./src/img/logomae.png");

var _logomae2 = _interopRequireDefault(_logomae);

var _logoephe = __webpack_require__("./src/img/logoephe.png");

var _logoephe2 = _interopRequireDefault(_logoephe);

var _logocnrs = __webpack_require__("./src/img/logocnrs.png");

var _logocnrs2 = _interopRequireDefault(_logocnrs);

var _logocedej = __webpack_require__("./src/img/logocedej.png");

var _logocedej2 = _interopRequireDefault(_logocedej);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Link = (0, _styledComponents2.default)(function (_ref) {
  var to = _ref.to,
      children = _ref.children,
      title = _ref.title;
  return _react2.default.createElement(
    'a',
    { href: to, title: title, target: '_blank' },
    children
  );
})(_templateObject);

var Holder = _styledComponents2.default.div(_templateObject2, function (_ref2) {
  var horizontal = _ref2.horizontal;
  return horizontal ? 'row' : 'column';
}, function (_ref3) {
  var horizontal = _ref3.horizontal;
  return horizontal ? 'space-around' : 'space-between';
}, function (_ref4) {
  var height = _ref4.height;
  return height ? height : 'auto';
});

var ImgHolder = _styledComponents2.default.div(_templateObject3);

var PartnersLogo = function PartnersLogo(props) {
  return _react2.default.createElement(
    Holder,
    props,
    _react2.default.createElement(
      ImgHolder,
      null,
      _react2.default.createElement(
        Link,
        { to: 'https://www.ephe.fr/', title: 'Visiter le site de l\'École Pratique des Hautes Études' },
        _react2.default.createElement('img', { src: _logoephe2.default, height: props.horizontal ? 80 : 110 })
      )
    ),
    _react2.default.createElement(
      ImgHolder,
      null,
      _react2.default.createElement(
        Link,
        { to: 'http://www.cnrs.fr', title: 'Visiter le site du CNRS' },
        _react2.default.createElement('img', { src: _logocnrs2.default, height: props.horizontal ? 70 : 100 })
      )
    ),
    _react2.default.createElement(
      ImgHolder,
      null,
      _react2.default.createElement(
        Link,
        { to: 'http://cedej-eg.org', title: 'Visiter le site du CEDEJ' },
        _react2.default.createElement('img', { src: _logocedej2.default, height: props.horizontal ? 80 : 110 })
      )
    ),
    _react2.default.createElement(
      ImgHolder,
      null,
      _react2.default.createElement(
        Link,
        { to: 'http://www.diplomatie.gouv.fr/fr/', title: 'Visiter le site du Ministère' },
        _react2.default.createElement('img', { src: _logomae2.default, height: props.horizontal ? 70 : 110 })
      )
    )
  );
};

var _default = PartnersLogo;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Link, 'Link', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/PartnersLogo/index.js');

  __REACT_HOT_LOADER__.register(Holder, 'Holder', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/PartnersLogo/index.js');

  __REACT_HOT_LOADER__.register(ImgHolder, 'ImgHolder', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/PartnersLogo/index.js');

  __REACT_HOT_LOADER__.register(PartnersLogo, 'PartnersLogo', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/PartnersLogo/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/PartnersLogo/index.js');
}();

;

/***/ }),

/***/ "./src/components/molecules/PrintCircleMonthRangeLegend/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  width: 100%;\n  table-layout: fixed;\n  text-align: center;\n'], ['\n  width: 100%;\n  table-layout: fixed;\n  text-align: center;\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  vertical-align: text-top;\n'], ['\n  vertical-align: text-top;\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  vertical-align: text-top;\n  position: relative;\n  height: ', 'px;\n'], ['\n  vertical-align: text-top;\n  position: relative;\n  height: ', 'px;\n']),
    _templateObject4 = _taggedTemplateLiteral(['\n  font-size: 0.6rem;\n'], ['\n  font-size: 0.6rem;\n']),
    _templateObject5 = _taggedTemplateLiteral(['\n  vertical-align: bottom;\n'], ['\n  vertical-align: bottom;\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _components = __webpack_require__("./src/components/index.js");

var _circles = __webpack_require__("./src/utils/circles.js");

var circlesUtils = _interopRequireWildcard(_circles);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Holder = _styledComponents2.default.table(_templateObject);

var Str = _styledComponents2.default.tr(_templateObject2);
var Std = _styledComponents2.default.td.attrs({ colSpan: 1 })(_templateObject3, function (_ref) {
  var height = _ref.height;
  return height;
});

var Description = _styledComponents2.default.span(_templateObject4);

var LegendElement = function LegendElement(_ref2) {
  var size = _ref2.size,
      elHeight = _ref2.height;

  var width = size.radius * 2 + 2;
  var height = width;
  var style = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    margin: 'auto'
  };

  var symbol = _react2.default.createElement(_components.CanvasCircle, { style: style, width: width, height: height, radius: size.radius });
  if (size.key === '01') {
    symbol = _react2.default.createElement(_components.CanvasTriangle, { style: style, width: width, height: height, radius: size.radius });
  }
  return _react2.default.createElement(
    Std,
    { height: elHeight },
    symbol
  );
};

var Dtr = _styledComponents2.default.tr(_templateObject5);
var Dtd = _styledComponents2.default.td(_templateObject5);
var PrintCircleMonthRangeLegend = function PrintCircleMonthRangeLegend(_ref3) {
  var sizes = _ref3.sizes;

  var sizesArr = Object.keys(sizes).map(function (key) {
    return {
      radius: sizes[key],
      key: key
    };
  });
  sizesArr.sort(function (a, b) {
    return parseInt(a.key) > parseInt(b.key);
  });
  if (!(sizesArr.length > 0)) {
    return null;
  }
  var maxHeight = sizesArr[sizesArr.length - 1].radius * 2 + 2;

  return _react2.default.createElement(
    Holder,
    null,
    _react2.default.createElement(
      'tbody',
      null,
      _react2.default.createElement(
        Dtr,
        null,
        sizesArr.map(function (_ref4, key) {
          var skey = _ref4.key;
          return _react2.default.createElement(
            Dtd,
            { key: key },
            _react2.default.createElement(
              Description,
              null,
              circlesUtils.monthsDescription(skey)
            )
          );
        })
      ),
      _react2.default.createElement(
        Str,
        null,
        sizesArr.map(function (size, key) {
          return _react2.default.createElement(LegendElement, { height: maxHeight, key: key, size: size });
        })
      )
    )
  );
};

var _default = PrintCircleMonthRangeLegend;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Holder, 'Holder', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/PrintCircleMonthRangeLegend/index.js');

  __REACT_HOT_LOADER__.register(Str, 'Str', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/PrintCircleMonthRangeLegend/index.js');

  __REACT_HOT_LOADER__.register(Std, 'Std', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/PrintCircleMonthRangeLegend/index.js');

  __REACT_HOT_LOADER__.register(Description, 'Description', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/PrintCircleMonthRangeLegend/index.js');

  __REACT_HOT_LOADER__.register(LegendElement, 'LegendElement', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/PrintCircleMonthRangeLegend/index.js');

  __REACT_HOT_LOADER__.register(Dtr, 'Dtr', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/PrintCircleMonthRangeLegend/index.js');

  __REACT_HOT_LOADER__.register(Dtd, 'Dtd', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/PrintCircleMonthRangeLegend/index.js');

  __REACT_HOT_LOADER__.register(PrintCircleMonthRangeLegend, 'PrintCircleMonthRangeLegend', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/PrintCircleMonthRangeLegend/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/PrintCircleMonthRangeLegend/index.js');
}();

;

/***/ }),

/***/ "./src/components/molecules/PrintOverlay/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n'], ['\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Holder = _styledComponents2.default.div(_templateObject);

var PrintOverlay = function PrintOverlay(_ref) {
  var mapReference = _ref.mapReference;

  debugger;
  var bindOverlay = function bindOverlay(ref) {
    ref.appendChild();
  };
  return _react2.default.createElement(Holder, { innerRef: function innerRef(ref) {
      return bindOverlay(ref);
    } });
};

var _default = PrintOverlay;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Holder, 'Holder', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/PrintOverlay/index.js');

  __REACT_HOT_LOADER__.register(PrintOverlay, 'PrintOverlay', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/PrintOverlay/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/PrintOverlay/index.js');
}();

;

/***/ }),

/***/ "./src/components/molecules/RangeSliderFilter/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = __webpack_require__("./node_modules/react-redux/es/index.js");

var _components = __webpack_require__("./src/components/index.js");

var _selectors = __webpack_require__("./src/store/selectors.js");

var _actions = __webpack_require__("./src/store/actions.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var noop = function noop(v) {
  return '' + v;
};

var RangeSliderFilter = function RangeSliderFilter(_ref) {
  var range = _ref.range,
      render = _ref.render,
      onChange = _ref.onChange,
      updateFilter = _ref.updateFilter,
      heading = _ref.heading,
      headingStyle = _ref.headingStyle,
      disabled = _ref.disabled,
      _ref$tipFormatter = _ref.tipFormatter,
      tipFormatter = _ref$tipFormatter === undefined ? noop : _ref$tipFormatter,
      other = _objectWithoutProperties(_ref, ['range', 'render', 'onChange', 'updateFilter', 'heading', 'headingStyle', 'disabled', 'tipFormatter']);

  var applyHeadingStyle = _extends({
    marginTop: '0.2em'
  }, headingStyle);
  return _react2.default.createElement(
    'div',
    null,
    heading && _react2.default.createElement(
      _components.Heading,
      { level: 6, style: applyHeadingStyle },
      heading
    ),
    _react2.default.createElement(_components.RangeSlider, _extends({
      tipFormatter: tipFormatter,
      disabled: disabled,
      defaultValue: range,
      onChange: render,
      onAfterChange: onChange
    }, other))
  );
};

var mapStateToProps = function mapStateToProps(state, ownProps) {
  return {
    disabled: !_selectors.fromLayers.isLayerVisible(state, ownProps.layer),
    range: ownProps.range || ownProps.filter.range,
    tipFormatter: ownProps.tipFormatter,
    heading: ownProps.heading,
    onChange: ownProps.onChange
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    render: function render() {
      return dispatch((0, _actions.startRender)());
    }
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(RangeSliderFilter);

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(noop, 'noop', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/RangeSliderFilter/index.js');

  __REACT_HOT_LOADER__.register(RangeSliderFilter, 'RangeSliderFilter', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/RangeSliderFilter/index.js');

  __REACT_HOT_LOADER__.register(mapStateToProps, 'mapStateToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/RangeSliderFilter/index.js');

  __REACT_HOT_LOADER__.register(mapDispatchToProps, 'mapDispatchToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/RangeSliderFilter/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/RangeSliderFilter/index.js');
}();

;

/***/ }),

/***/ "./src/components/molecules/SidebarToggleButton/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__("./node_modules/react-redux/es/index.js");

var _actions = __webpack_require__("./src/store/actions.js");

var _selectors = __webpack_require__("./src/store/selectors.js");

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SidebarToggleButton = function SidebarToggleButton(props) {
  return _react2.default.createElement(
    _components.ToggleButton,
    _extends({ align: 'left' }, props),
    'Masquer les filtres'
  );
};

var mapStateToProps = function mapStateToProps() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _selectors.fromSidebar.initialState;
  return {
    toggled: _selectors.fromSidebar.isOpened(state)
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    toggle: function toggle() {
      return dispatch((0, _actions.toggleSidebar)());
    }
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(SidebarToggleButton);

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(SidebarToggleButton, 'SidebarToggleButton', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/SidebarToggleButton/index.js');

  __REACT_HOT_LOADER__.register(mapStateToProps, 'mapStateToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/SidebarToggleButton/index.js');

  __REACT_HOT_LOADER__.register(mapDispatchToProps, 'mapDispatchToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/SidebarToggleButton/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/SidebarToggleButton/index.js');
}();

;

/***/ }),

/***/ "./src/components/molecules/SocialSharing/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  display: flex;\n  height: ', 'px; \n  justify-content: space-around;\n  align-items: center;\n  padding: 0 50px;\n'], ['\n  display: flex;\n  height: ', 'px; \n  justify-content: space-around;\n  align-items: center;\n  padding: 0 50px;\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styles = __webpack_require__("./src/utils/styles.js");

var _constants = __webpack_require__("./src/utils/constants.js");

var _reactFacebook = __webpack_require__("./node_modules/react-facebook/lib/index.js");

var _reactFacebook2 = _interopRequireDefault(_reactFacebook);

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var getCurrentHref = function getCurrentHref() {
  return window.location.href;
};

var Holder = _styledComponents2.default.div(_templateObject, _styles.navbar.height);

var twitterHref = function twitterHref() {
  var url = getCurrentHref();
  return _constants.TWEET_INTENT_URL + '?text=' + encodeURIComponent(_constants.TWEET_TEXT) + '&url=' + encodeURIComponent(url) + '&hashtags=' + _constants.TWEET_HASHTAGS;
};
var openModal = function openModal(href, w, h) {
  var ww = window.innerWidth;
  var wh = window.innerHeight;
  var wstyle = '\n  height=' + h + ',width=' + w + ',top=' + (wh / 2 - h / 2) + ',left=' + (ww / 2 - w / 2) + ',\n    toolbar=0,location=0\n  ';
  window.open(href, name, wstyle);
};

var shareTwitter = function shareTwitter() {
  var href = twitterHref();
  openModal(href, 600, 320);
};

var SocialSharing = function SocialSharing() {
  return _react2.default.createElement(
    Holder,
    null,
    _react2.default.createElement(
      _reactFacebook2.default,
      {
        appId: _constants.FACEBOOK_APP_ID,
        version: _constants.FACEBOOK_SDK_VERSION },
      _react2.default.createElement(
        _reactFacebook.Share,
        null,
        _react2.default.createElement(_components.FacebookIcon, { width: 25, height: 25 })
      )
    ),
    _react2.default.createElement(_components.TwitterIcon, { onClick: shareTwitter, width: 25, height: 25 })
  );
};

var _default = SocialSharing;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(getCurrentHref, 'getCurrentHref', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/SocialSharing/index.js');

  __REACT_HOT_LOADER__.register(Holder, 'Holder', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/SocialSharing/index.js');

  __REACT_HOT_LOADER__.register(twitterHref, 'twitterHref', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/SocialSharing/index.js');

  __REACT_HOT_LOADER__.register(openModal, 'openModal', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/SocialSharing/index.js');

  __REACT_HOT_LOADER__.register(shareTwitter, 'shareTwitter', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/SocialSharing/index.js');

  __REACT_HOT_LOADER__.register(SocialSharing, 'SocialSharing', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/SocialSharing/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/SocialSharing/index.js');
}();

;

/***/ }),

/***/ "./src/components/molecules/TemperaturesLegend/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  padding-left: 7px;\n'], ['\n  padding-left: 7px;\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  font-size: 0.65rem;\n  line-height: 0.7rem;\n  .legend--print & {\n    width: 60px;\n    font-weight: bold;\n  }\n'], ['\n  font-size: 0.65rem;\n  line-height: 0.7rem;\n  .legend--print & {\n    width: 60px;\n    font-weight: bold;\n  }\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  font-size: 0.6rem;\n  line-height: 0.6rem;\n'], ['\n  font-size: 0.6rem;\n  line-height: 0.6rem;\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _reactAddonsCreateFragment = __webpack_require__("./node_modules/react-addons-create-fragment/index.js");

var _reactAddonsCreateFragment2 = _interopRequireDefault(_reactAddonsCreateFragment);

var _components = __webpack_require__("./src/components/index.js");

var _utils = __webpack_require__("./src/utils/index.js");

var _patterns = __webpack_require__("./src/utils/patterns.js");

var patternUtils = _interopRequireWildcard(_patterns);

var _aridity = __webpack_require__("./src/utils/aridity.js");

var aridityUtils = _interopRequireWildcard(_aridity);

var _temperatures = __webpack_require__("./src/utils/temperatures.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var SummerName = (0, _styledComponents2.default)(_components.Reduced)(_templateObject);

var VeryHotSummer = function VeryHotSummer() {
  return _react2.default.createElement(
    SummerName,
    null,
    '\xE9t\xE9 tr\xE8s chaud (plus de 30\xB0)'
  );
};

var HotSummer = function HotSummer() {
  return _react2.default.createElement(
    SummerName,
    null,
    '\xE9t\xE9 chaud (20 \xE0 30\xB0)'
  );
};
var TemperedSummer = function TemperedSummer() {
  return _react2.default.createElement(
    SummerName,
    null,
    '\xE9t\xE9 temp\xE9r\xE9 (10 \xE0 20\xB0)'
  );
};
var WinterName = function WinterName(_ref) {
  var children = _ref.children;
  return _react2.default.createElement(
    'tr',
    null,
    _react2.default.createElement(
      _components.Th,
      { align: 'left' },
      _react2.default.createElement(
        _components.LegendCategoryName,
        null,
        _react2.default.createElement(
          _components.Reduced,
          null,
          children
        )
      )
    )
  );
};
WinterName.propTypes = {
  children: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.arrayOf(_propTypes2.default.node)])
};

var TemperatureRow = function TemperatureRow(_ref2) {
  var name = _ref2.name,
      temperature = _ref2.temperature,
      patterns = _ref2.patterns,
      aridity = _ref2.aridity,
      showAridity = _ref2.layers.aridity.visible;

  var temp = (0, _temperatures.findByValue)(temperature);
  var visibleAridities = showAridity ? (0, _utils.visibleTypes)(aridity) : [];
  return _react2.default.createElement(
    'tr',
    null,
    _react2.default.createElement(
      _components.Td,
      { align: 'left' },
      name
    ),
    visibleAridities.map(function (ar, key) {
      return _react2.default.createElement(_components.TemperatureLegendPattern, {
        key: key,
        patterns: patterns,
        aridity: ar,
        temperature: temp
      });
    }),
    visibleAridities.length === 0 && _react2.default.createElement(_components.TemperatureLegendPattern, { temperature: temp })
  );
};

var ATh = (0, _styledComponents2.default)(_components.Td)(_templateObject2);

var AridityName = function AridityName(_ref3) {
  var aridity = _ref3.aridity;
  return _react2.default.createElement(
    ATh,
    {
      width: 40,
      'data-tip': true,
      'data-for': 'tooltip-aridity-' + aridity.name },
    aridityUtils.getName(aridity)
  );
};

var ATd = (0, _styledComponents2.default)(_components.Td)(_templateObject3);

var AridityPrecipitations = function AridityPrecipitations(_ref4) {
  var aridity = _ref4.aridity;
  return _react2.default.createElement(
    ATd,
    null,
    'P/Etp',
    _react2.default.createElement('br', null),
    aridityUtils.getPrecipitations(aridity)
  );
};

var AridityNames = function AridityNames(_ref5) {
  var aridity = _ref5.aridity,
      print = _ref5.print;

  var visibleAridities = (0, _utils.visibleTypes)(aridity);
  if (!visibleAridities.length) {
    return null;
  }
  return [_react2.default.createElement(
    'tr',
    null,
    _react2.default.createElement(
      _components.TrName,
      null,
      _react2.default.createElement(
        _components.TrNameContent,
        null,
        'Aridit\xE9'
      )
    ),
    visibleAridities.map(function (aridity, key) {
      return _react2.default.createElement(AridityName, { aridity: aridity, key: key });
    })
  ), print ? _react2.default.createElement(
    'tr',
    null,
    _react2.default.createElement('td', null),
    visibleAridities.map(function (aridity, key) {
      return _react2.default.createElement(AridityPrecipitations, { key: key, aridity: aridity });
    })
  ) : null];
};

var TemperaturesRows = function TemperaturesRows(_ref6) {
  var _ref6$temperatures = _ref6.temperatures,
      summer = _ref6$temperatures.summer,
      winter = _ref6$temperatures.winter,
      aridity = _ref6.aridity,
      patterns = _ref6.patterns,
      layers = _ref6.layers;
  return [_react2.default.createElement(
    'tr',
    { key: 'h-h' },
    _react2.default.createElement(
      _components.TrName,
      null,
      _react2.default.createElement(
        _components.TrNameContent,
        null,
        'Temp\xE9ratures'
      )
    )
  ), winter.A.visible && [_react2.default.createElement(
    WinterName,
    { key: 'h-0' },
    'Hiver chaud (20 \xE0 30\xB0C)'
  ), summer.A.visible ? _react2.default.createElement(TemperatureRow, {
    layers: layers,
    name: _react2.default.createElement(VeryHotSummer, null),
    key: 0,
    temperature: 1,
    patterns: patterns,
    aridity: aridity
  }) : null, summer.B.visible ? _react2.default.createElement(TemperatureRow, {
    layers: layers,
    key: 1,
    name: _react2.default.createElement(HotSummer, null),
    aridity: aridity,
    temperature: 2,
    patterns: patterns
  }) : null], winter.B.visible && [_react2.default.createElement(
    WinterName,
    { key: 'h-1' },
    'Hiver temp\xE9r\xE9 (10 \xE0 20\xB0)'
  ), summer.A.visible ? _react2.default.createElement(TemperatureRow, {
    layers: layers,
    key: 2,
    name: _react2.default.createElement(VeryHotSummer, null),
    temperature: 3,
    patterns: patterns,
    aridity: aridity
  }) : null, summer.B.visible ? _react2.default.createElement(TemperatureRow, {
    layers: layers,
    key: 3,
    name: _react2.default.createElement(HotSummer, null),
    temperature: 4,
    patterns: patterns,
    aridity: aridity
  }) : null, summer.C.visible ? _react2.default.createElement(TemperatureRow, {
    layers: layers,
    key: 4,
    name: _react2.default.createElement(TemperedSummer, null),
    temperature: 5,
    patterns: patterns,
    aridity: aridity
  }) : null], winter.C.visible && [_react2.default.createElement(
    WinterName,
    { key: 'h-2' },
    'Hiver frais (0 \xE0 10\xB0)'
  ), summer.A.visible ? _react2.default.createElement(TemperatureRow, {
    layers: layers,
    key: 5,
    name: _react2.default.createElement(VeryHotSummer, null),
    temperature: 6,
    patterns: patterns,
    aridity: aridity
  }) : null, summer.B.visible ? _react2.default.createElement(TemperatureRow, {
    layers: layers,
    key: 6,
    name: _react2.default.createElement(HotSummer, null),
    temperature: 7,
    patterns: patterns,
    aridity: aridity
  }) : null, summer.C.visible ? _react2.default.createElement(TemperatureRow, {
    layers: layers,
    key: 7,
    name: _react2.default.createElement(TemperedSummer, null),
    temperature: 8,
    patterns: patterns,
    aridity: aridity
  }) : null], winter.D.visible && [_react2.default.createElement(
    WinterName,
    { key: 'h-3' },
    'Hiver froid (moins de 0\xB0)'
  ), summer.A.visible ? _react2.default.createElement(TemperatureRow, {
    layers: layers,
    key: 8,
    name: _react2.default.createElement(VeryHotSummer, null),
    temperature: 9,
    patterns: patterns,
    aridity: aridity
  }) : null, summer.B.visible ? _react2.default.createElement(TemperatureRow, {
    layers: layers,
    key: 9,
    name: _react2.default.createElement(HotSummer, null),
    temperature: 10,
    patterns: patterns,
    aridity: aridity
  }) : null, summer.C.visible ? _react2.default.createElement(TemperatureRow, {
    layers: layers,
    key: 10,
    name: _react2.default.createElement(TemperedSummer, null),
    temperature: 11,
    patterns: patterns,
    aridity: aridity
  }) : null]];
};

var Temperatures = function Temperatures(_ref7) {
  var print = _ref7.print,
      _ref7$filters = _ref7.filters,
      _ref7$filters$tempera = _ref7$filters.temperatures,
      summer = _ref7$filters$tempera.summer,
      winter = _ref7$filters$tempera.winter,
      aridity = _ref7$filters.aridity,
      _ref7$layers = _ref7.layers,
      showTemperatures = _ref7$layers.temperatures.visible,
      showAridity = _ref7$layers.aridity.visible;

  var layers = {
    temperatures: { visible: showTemperatures },
    aridity: { visible: showAridity }
  };

  var hasVisibleAridity = showAridity && (0, _utils.visibleTypes)(aridity).length > 0;
  var hasVisibleTemperatures = showTemperatures && (0, _utils.visibleTypes)(winter).length > 0 && (0, _utils.visibleTypes)(summer).length > 0;

  var patterns = patternUtils.initPatterns();

  var temperatureRows = hasVisibleTemperatures ? TemperaturesRows({
    temperatures: { summer: summer, winter: winter },
    aridity: aridity,
    patterns: patterns,
    layers: layers
  }) : null;

  var tempsRowsFragment = (0, _reactAddonsCreateFragment2.default)({ temperatures: temperatureRows });

  var aridityNamesRows = hasVisibleAridity ? AridityNames({
    aridity: aridity,
    print: print
  }) : null;

  var aridityNamesFragment = (0, _reactAddonsCreateFragment2.default)({ aridity: aridityNamesRows });

  return _react2.default.createElement(
    'tbody',
    null,
    [aridityNamesFragment, tempsRowsFragment, !hasVisibleTemperatures && hasVisibleAridity ? _react2.default.createElement(TemperatureRow, {
      layers: layers,
      key: 'aridity-row',
      aridity: aridity,
      patterns: patterns
    }) : null]
  );
};

var _default = Temperatures;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(SummerName, 'SummerName', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(VeryHotSummer, 'VeryHotSummer', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(HotSummer, 'HotSummer', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(TemperedSummer, 'TemperedSummer', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(WinterName, 'WinterName', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(TemperatureRow, 'TemperatureRow', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(ATh, 'ATh', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(AridityName, 'AridityName', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(ATd, 'ATd', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(AridityPrecipitations, 'AridityPrecipitations', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(AridityNames, 'AridityNames', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(TemperaturesRows, 'TemperaturesRows', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(Temperatures, 'Temperatures', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');
}();

;

/***/ }),

/***/ "./src/components/molecules/ToggleAridityVisibility/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = __webpack_require__("./node_modules/react-redux/es/index.js");

var _actions = __webpack_require__("./src/store/actions.js");

var _selectors = __webpack_require__("./src/store/selectors.js");

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ToggleAridityFilter = function ToggleAridityFilter(_ref, _ref2) {
  var onToggle = _ref.onToggle,
      toggled = _ref.toggled,
      aridity = _ref.aridity,
      label = _ref.label;
  var layer = _ref2.layer;
  return _react2.default.createElement(_components.ToggleFilter, {
    layer: layer,
    onToggle: onToggle(aridity),
    toggled: toggled,
    label: label
  });
};

ToggleAridityFilter.propTypes = {
  onToggle: _propTypes2.default.func,
  toggle: _propTypes2.default.func,
  toggled: _propTypes2.default.bool,
  aridity: _propTypes2.default.object,
  label: _propTypes2.default.string
};

ToggleAridityFilter.contextTypes = {
  layer: _propTypes2.default.object
};

var mapStateToProps = function mapStateToProps(state, props) {
  var aridity = _selectors.fromFilters.aridity(state, props.aridity);
  return {
    toggled: aridity.visible,
    label: props.label,
    aridity: aridity
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    onToggle: function onToggle(aridity) {
      return function () {
        return dispatch((0, _actions.toggleAridityVisibility)(aridity));
      };
    }
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ToggleAridityFilter);

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(ToggleAridityFilter, 'ToggleAridityFilter', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/ToggleAridityVisibility/index.js');

  __REACT_HOT_LOADER__.register(mapStateToProps, 'mapStateToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/ToggleAridityVisibility/index.js');

  __REACT_HOT_LOADER__.register(mapDispatchToProps, 'mapDispatchToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/ToggleAridityVisibility/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/ToggleAridityVisibility/index.js');
}();

;

/***/ }),

/***/ "./src/components/molecules/ToggleFilter/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__("./node_modules/react-redux/es/index.js");

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _components = __webpack_require__("./src/components/index.js");

var _selectors = __webpack_require__("./src/store/selectors.js");

var _actions = __webpack_require__("./src/store/actions.js");

var _utils = __webpack_require__("./src/utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ToggleFilter = function ToggleFilter(_ref) {
  var toggled = _ref.toggled,
      onToggle = _ref.onToggle,
      label = _ref.label,
      disabled = _ref.disabled,
      render = _ref.render;
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(_components.Checkbox, {
      disabled: disabled,
      label: label,
      onBeforeChange: render,
      onChange: disabled ? _utils.noop : onToggle,
      checked: toggled
    })
  );
};

ToggleFilter.propTypes = {
  toggled: _propTypes2.default.bool,
  disabled: _propTypes2.default.bool,
  render: _propTypes2.default.func,
  onToggle: _propTypes2.default.func,
  label: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node])
};

var mapStateToProps = function mapStateToProps(state, ownProps) {
  return {
    disabled: !_selectors.fromLayers.layerByName(state, ownProps.layer.name).visible
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    render: function render() {
      return dispatch((0, _actions.startRender)());
    }
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ToggleFilter);

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(ToggleFilter, 'ToggleFilter', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/ToggleFilter/index.js');

  __REACT_HOT_LOADER__.register(mapStateToProps, 'mapStateToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/ToggleFilter/index.js');

  __REACT_HOT_LOADER__.register(mapDispatchToProps, 'mapDispatchToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/ToggleFilter/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/ToggleFilter/index.js');
}();

;

/***/ }),

/***/ "./src/components/organisms/AridityFilters/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  display: flex;\n  justify-content: space-around;\n'], ['\n  display: flex;\n  justify-content: space-around;\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  flex-grow: 1;\n  flex-base: 1;\n'], ['\n  flex-grow: 1;\n  flex-base: 1;\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Cols = _styledComponents2.default.div(_templateObject);

var Col = _styledComponents2.default.div(_templateObject2);

var AridityFilters = function AridityFilters() {
  return _react2.default.createElement(
    Cols,
    null,
    _react2.default.createElement(
      Col,
      null,
      _react2.default.createElement(_components.ToggleAridityVisibility, { label: 'Hyper Aride', aridity: 'hyper' }),
      _react2.default.createElement(_components.ToggleAridityVisibility, { label: 'Aride', aridity: 'arid' })
    ),
    _react2.default.createElement(
      Col,
      null,
      _react2.default.createElement(_components.ToggleAridityVisibility, { label: 'Semi Aride', aridity: 'semi' }),
      _react2.default.createElement(_components.ToggleAridityVisibility, { label: 'Sub Humide', aridity: 'subHumide' })
    )
  );
};

var _default = AridityFilters;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Cols, 'Cols', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AridityFilters/index.js');

  __REACT_HOT_LOADER__.register(Col, 'Col', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AridityFilters/index.js');

  __REACT_HOT_LOADER__.register(AridityFilters, 'AridityFilters', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AridityFilters/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AridityFilters/index.js');
}();

;

/***/ }),

/***/ "./src/components/organisms/AridityTemperaturesLayer/delegate.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _components = __webpack_require__("./src/components/index.js");

var _patterns = __webpack_require__("./src/utils/patterns.js");

var patternsUtil = _interopRequireWildcard(_patterns);

var _boundaries = __webpack_require__("./src/utils/boundaries.js");

var boundaries = _interopRequireWildcard(_boundaries);

var _styles = __webpack_require__("./src/components/organisms/AridityTemperaturesLayer/styles.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Delegate = function (_CanvasDelegate) {
  _inherits(Delegate, _CanvasDelegate);

  function Delegate(data) {
    _classCallCheck(this, Delegate);

    var _this = _possibleConstructorReturn(this, (Delegate.__proto__ || Object.getPrototypeOf(Delegate)).call(this, data));

    _this.shouldUseMask = false;
    _this.visibility = {
      aridity: true,
      temperatures: true
    };
    return _this;
  }

  _createClass(Delegate, [{
    key: 'updateAridityVisibility',
    value: function updateAridityVisibility(visibility) {
      this.visibility.aridity = visibility;
    }
  }, {
    key: 'updateTemperaturesVisibility',
    value: function updateTemperaturesVisibility(visibility) {
      this.visibility.temperatures = visibility;
    }
  }, {
    key: 'enableMask',
    value: function enableMask() {
      this.shouldUseMask = true;
    }
  }, {
    key: 'disableMask',
    value: function disableMask() {
      this.shouldUseMask = false;
    }
  }, {
    key: 'createMask',
    value: function createMask(modelCanvas, temperatures, aridity) {
      var canvas = void 0;
      if (this.shouldUseMask) {
        canvas = this.createCanvas(modelCanvas);
        var aridityCanvas = this.createCanvas(modelCanvas);
        var temperaturesCanvas = this.createCanvas(modelCanvas);
        this.drawAreas({
          context: aridityCanvas.getContext('2d'),
          features: aridity,
          fillStyle: 'black',
          strokeWidth: 2
        });

        this.drawAreas({
          context: temperaturesCanvas.getContext('2d'),
          features: temperatures,
          fillStyle: 'black',
          strokeWidth: 1
        });

        var ctx = canvas.getContext('2d');
        ctx.drawImage(aridityCanvas, 0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'xor';
        ctx.drawImage(temperaturesCanvas, 0, 0, canvas.width, canvas.height);
        ctx.clip();
      }
      return canvas;
    }
  }, {
    key: 'draw',
    value: function draw(_ref) {
      var canvas = _ref.canvas,
          coords = _ref.coords;

      var _getTileFeatures = this.getTileFeatures(coords),
          aridity = _getTileFeatures.aridity,
          temperatures = _getTileFeatures.temperatures;

      var _visibility = this.visibility,
          isAridityVisible = _visibility.aridity,
          isTemperaturesVisible = _visibility.temperatures;


      var mask = this.createMask(canvas, temperatures, aridity);
      var context = canvas.getContext('2d');

      this.patterns = this.patterns || patternsUtil.initPatterns(context);
      var patterns = this.patterns;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.globalCompositeOperation = 'source-over';

      try {
        if (isTemperaturesVisible) {
          this.drawAreas({
            context: context,
            features: temperatures,
            fillStyle: function fillStyle(feature) {
              return (0, _styles.areaColor)(feature.tags.Temperatur);
            },
            strokeStyle: function strokeStyle(feature) {
              return (0, _styles.areaColor)(feature.tags.Temperatur);
            },
            strokeWidth: 1
          });
        }

        if (isAridityVisible) {
          this.drawAreas({
            context: context,
            features: aridity,
            fillStyle: function fillStyle(feature) {
              return patterns.findByKey(feature.tags.d_TYPE).canvasPattern;
            },
            stopCondition: function stopCondition(feature) {
              var pattern = patterns.findByKey(feature.tags.d_TYPE);
              if (!pattern) {
                return true;
              }
              if (!pattern.stripes) {
                return true;
              }
              return false;
            },
            strokeWidth: 0
          });

          boundaries.addBoundaries({
            context: context,
            patterns: patterns,
            drawPath: this.drawPath,
            boundaries: aridity,
            layer: this.layer
          });
        }

        if (mask) {
          context.globalCompositeOperation = 'destination-out';
          context.drawImage(mask, 0, 0, mask.width, mask.height);
        }

        context.clip();
      } catch (e) {
        console.error('error while drawing', e);
        throw e;
      }

      return canvas;
    }
  }]);

  return Delegate;
}(_components.CanvasDelegate);

var _default = Delegate;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Delegate, 'Delegate', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AridityTemperaturesLayer/delegate.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AridityTemperaturesLayer/delegate.js');
}();

;

/***/ }),

/***/ "./src/components/organisms/AridityTemperaturesLayer/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _components = __webpack_require__("./src/components/index.js");

var _delegate = __webpack_require__("./src/components/organisms/AridityTemperaturesLayer/delegate.js");

var _delegate2 = _interopRequireDefault(_delegate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AridityTemperaturesLayer = function (_CanvasTiles) {
  _inherits(AridityTemperaturesLayer, _CanvasTiles);

  function AridityTemperaturesLayer() {
    _classCallCheck(this, AridityTemperaturesLayer);

    return _possibleConstructorReturn(this, (AridityTemperaturesLayer.__proto__ || Object.getPrototypeOf(AridityTemperaturesLayer)).apply(this, arguments));
  }

  _createClass(AridityTemperaturesLayer, [{
    key: 'updateAridityVisiblity',
    value: function updateAridityVisiblity(visibility) {
      if (!visibility) {
        this.delegate.disableMask();
      } else {
        this.delegate.enableMask();
      }
      this.delegate.updateAridityVisibility(visibility);
      this.redraw();
    }
  }, {
    key: 'updateTemperaturesVisiblity',
    value: function updateTemperaturesVisiblity(visibility) {
      if (!visibility) {
        this.delegate.disableMask();
      } else {
        this.delegate.enableMask();
      }
      this.delegate.updateTemperaturesVisibility(visibility);
      this.redraw();
    }
  }, {
    key: 'updateLeafletElement',
    value: function updateLeafletElement(_ref, _ref2) {
      var fromAridityVisibility = _ref.showAridity,
          fromTemperaturesVisibility = _ref.showTemperatures,
          _ref$data = _ref.data,
          fromTemps = _ref$data.temperatures,
          fromAridity = _ref$data.aridity;
      var toAridityVisibility = _ref2.showAridity,
          toTemperaturesVisibility = _ref2.showTemperatures,
          _ref2$data = _ref2.data,
          toTemps = _ref2$data.temperatures,
          toAridity = _ref2$data.aridity,
          _ref2$counts = _ref2.counts,
          tempsCounts = _ref2$counts.temperatures,
          aridityCounts = _ref2$counts.aridity;

      var shouldEnableMask = (tempsCounts.original !== tempsCounts.current && tempsCounts.current > 0 || aridityCounts.original !== aridityCounts.current && aridityCounts.current > 0) && toAridityVisibility && toTemperaturesVisibility && toTemps.features.length > 0 && toAridity.features.length > 0;

      var diffAridity = fromAridity.features.length !== toAridity.features.length;
      var diffTemps = fromTemps.features.length !== toTemps.features.length;
      if (diffTemps || diffAridity) {
        if (shouldEnableMask) {
          this.delegate.enableMask();
        } else {
          this.delegate.disableMask();
        }
        this.updateData({
          aridity: toAridity,
          temperatures: toTemps
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
  }]);

  return AridityTemperaturesLayer;
}(_components.CanvasTiles);

AridityTemperaturesLayer.propTypes = _extends({}, _components.CanvasTiles.propTypes, {
  showAridity: _propTypes2.default.bool,
  showTemperatures: _propTypes2.default.bool,
  counts: _propTypes2.default.shape({
    temperatures: _propTypes2.default.object,
    aridity: _propTypes2.default.object
  })
});
AridityTemperaturesLayer.defaultProps = _extends({}, _components.CanvasTiles.defaultProps, {
  delegate: _delegate2.default
});
var _default = AridityTemperaturesLayer;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(AridityTemperaturesLayer, 'AridityTemperaturesLayer', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AridityTemperaturesLayer/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AridityTemperaturesLayer/index.js');
}();

;

/***/ }),

/***/ "./src/components/organisms/AridityTemperaturesLayer/styles.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapStyle = exports.areaColor = exports.circleColor = undefined;

var _temperatures = __webpack_require__("./src/utils/temperatures.js");

var temperatures = _interopRequireWildcard(_temperatures);

var _circles = __webpack_require__("./src/utils/circles.js");

var circles = _interopRequireWildcard(_circles);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var areaColor = function areaColor(value) {
  return temperatures.findByValue(value).color;
};

var circleColor = function circleColor(feature) {
  return circles.circleColor(feature);
};

var mapStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0
};

exports.circleColor = circleColor;
exports.areaColor = areaColor;
exports.mapStyle = mapStyle;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(areaColor, 'areaColor', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AridityTemperaturesLayer/styles.js');

  __REACT_HOT_LOADER__.register(circleColor, 'circleColor', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AridityTemperaturesLayer/styles.js');

  __REACT_HOT_LOADER__.register(mapStyle, 'mapStyle', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AridityTemperaturesLayer/styles.js');
}();

;

/***/ }),

/***/ "./src/components/organisms/Atlas/Atlas.css":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/happypack/loader.js?id=css-81af377f!./src/components/organisms/Atlas/Atlas.css");
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__("./node_modules/style-loader/addStyles.js")(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("./node_modules/happypack/loader.js?id=css-81af377f!./src/components/organisms/Atlas/Atlas.css", function() {
			var newContent = __webpack_require__("./node_modules/happypack/loader.js?id=css-81af377f!./src/components/organisms/Atlas/Atlas.css");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/components/organisms/Atlas/constants.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var BASE_LAYER_URL = exports.BASE_LAYER_URL = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}.png';

var NATURAL_FEATURES_URL = exports.NATURAL_FEATURES_URL = 'http://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}.png';

var NATURAL_FEATURES_ATTRIBUTION = exports.NATURAL_FEATURES_ATTRIBUTION = '&copy; Powerded by <a href="http://www.esri.com/">ESRI</a> world reference overlay';

var MAPBOX_WATER_LABEL_URL = exports.MAPBOX_WATER_LABEL_URL = 'https://api.mapbox.com/styles/v1/skoli/cj5qqakjk22gj2srv856orjjk/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2tvbGkiLCJhIjoiY2o1bTZpeHBvMGl4djMyb2RmZ3h5OGI0diJ9.OECj4b33D6Pnq7Zlp04wtA';
var MAPBOX_WATER_URL = exports.MAPBOX_WATER_URL = 'https://api.mapbox.com/styles/v1/skoli/cj5qqg6dn23hg2srzoedq0tcy/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2tvbGkiLCJhIjoiY2o1bTZpeHBvMGl4djMyb2RmZ3h5OGI0diJ9.OECj4b33D6Pnq7Zlp04wtA';

var VECTOR_TILE_URL = exports.VECTOR_TILE_URL = 'https://basemaps.arcgis.com/v1/arcgis/rest/services/World_Basemap/VectorTileServer/tile/{z}/{y}/{x}.pbf';

var WORLD_OCEAN_REFERENCE = exports.WORLD_OCEAN_REFERENCE = 'https://services.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}.png';
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(BASE_LAYER_URL, 'BASE_LAYER_URL', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/Atlas/constants.js');

  __REACT_HOT_LOADER__.register(NATURAL_FEATURES_URL, 'NATURAL_FEATURES_URL', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/Atlas/constants.js');

  __REACT_HOT_LOADER__.register(NATURAL_FEATURES_ATTRIBUTION, 'NATURAL_FEATURES_ATTRIBUTION', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/Atlas/constants.js');

  __REACT_HOT_LOADER__.register(MAPBOX_WATER_LABEL_URL, 'MAPBOX_WATER_LABEL_URL', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/Atlas/constants.js');

  __REACT_HOT_LOADER__.register(MAPBOX_WATER_URL, 'MAPBOX_WATER_URL', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/Atlas/constants.js');

  __REACT_HOT_LOADER__.register(VECTOR_TILE_URL, 'VECTOR_TILE_URL', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/Atlas/constants.js');

  __REACT_HOT_LOADER__.register(WORLD_OCEAN_REFERENCE, 'WORLD_OCEAN_REFERENCE', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/Atlas/constants.js');
}();

;

/***/ }),

/***/ "./src/components/organisms/Atlas/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactLeaflet = __webpack_require__("./node_modules/react-leaflet/es/index.js");

var _leaflet = __webpack_require__("./node_modules/leaflet/dist/leaflet-src.js");

var _components = __webpack_require__("./src/components/index.js");

var _data = __webpack_require__("./src/utils/data.js");

__webpack_require__("./node_modules/leaflet/dist/leaflet.css");

__webpack_require__("./src/components/organisms/Atlas/Atlas.css");

var _constants = __webpack_require__("./src/components/organisms/Atlas/constants.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Atlas = function (_Component) {
  _inherits(Atlas, _Component);

  function Atlas(props) {
    _classCallCheck(this, Atlas);

    var _this = _possibleConstructorReturn(this, (Atlas.__proto__ || Object.getPrototypeOf(Atlas)).call(this, props));

    _this.state = {
      mapRef: null,
      showTooltip: false,
      tooltipPosition: null,
      tooltipData: null
    };
    return _this;
  }

  _createClass(Atlas, [{
    key: 'onClick',
    value: function onClick(e) {
      // useful to avoid looking up for deserts.
      var _props$data = this.props.data,
          aridity = _props$data.aridity,
          temperatures = _props$data.temperatures,
          circles = _props$data.circles;


      var searchInFeatures = {
        aridity: aridity,
        temperatures: temperatures,
        circles: circles
      };

      var features = (0, _data.filterFeatures)(searchInFeatures, e.latlng);
      if (Object.keys(features).length) {
        this.showTooltip(e.latlng, features);
      } else {
        this.hideTooltip();
      }
    }
  }, {
    key: 'hideTooltip',
    value: function hideTooltip() {
      this.setState({ showTooltip: false });
    }
  }, {
    key: 'showTooltip',
    value: function showTooltip(tooltipPosition, tooltipData) {
      this.setState({ showTooltip: true, tooltipPosition: tooltipPosition, tooltipData: tooltipData });
    }
  }, {
    key: 'bindContainer',
    value: function bindContainer(mapRef) {
      var _this2 = this;

      if (!mapRef) {
        return;
      }
      this.mapRef = mapRef;
      this.map = mapRef.leafletElement;
      this.map.on('zoomend', function () {
        setTimeout(function () {
          return _this2.props.onZoom();
        }, 1000);
      });
      this.props.bindMapReference(this.map);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _state = this.state,
          showTooltip = _state.showTooltip,
          tooltipPosition = _state.tooltipPosition,
          tooltipData = _state.tooltipData;
      var _props = this.props,
          data = _props.data,
          counts = _props.counts,
          showCircles = _props.showCircles,
          showAridity = _props.showAridity,
          showTemperatures = _props.showTemperatures,
          onRender = _props.onRender,
          onMapReady = _props.onMapReady,
          circleTypes = _props.circleTypes,
          onCirclesAdded = _props.onCirclesAdded,
          onCirclesCreated = _props.onCirclesCreated,
          isSidebarOpened = _props.isSidebarOpened;

      var deserts = data.deserts,
          lakesAndRivers = data.lakesAndRivers,
          circles = data.circles,
          waterLabels = data.waterLabels,
          aridityAndTemperatures = _objectWithoutProperties(data, ['deserts', 'lakesAndRivers', 'circles', 'waterLabels']);

      var bbox = [-179.2165527343741, -56.157571400448376, 181.00012207031295, 84.62359619140625];
      var klass = 'sidebar-' + (isSidebarOpened ? 'opened' : 'closed');
      this.position = [10, 35];
      this.zoom = 3;
      var bounds = new _leaflet.LatLngBounds(new _leaflet.LatLng(bbox[0] - 20, bbox[1] - 150), new _leaflet.LatLng(bbox[2] + 20, bbox[3] + 150));
      return _react2.default.createElement(
        _reactLeaflet.Map,
        {
          whenReady: onMapReady,
          ref: function ref(_ref) {
            return _this3.bindContainer(_ref);
          },
          className: klass,
          onclick: function onclick(e) {
            return _this3.onClick(e);
          },
          maxBounds: bounds,
          minZoom: 2,
          maxZoom: 7,
          renderer: (0, _leaflet.canvas)(),
          animate: true,
          zoomControl: false,
          center: this.position,
          zoom: this.zoom
        },
        _react2.default.createElement(_components.ContextualInfoPopup, {
          onClose: function onClose() {
            return _this3.hideTooltip();
          },
          show: showTooltip,
          data: tooltipData,
          map: this.map,
          position: tooltipPosition
        }),
        _react2.default.createElement(_reactLeaflet.ZoomControl, { position: 'topright' }),
        _react2.default.createElement(_components.CedejWatermark, { position: 'bottomright', width: 50 }),
        _react2.default.createElement(_reactLeaflet.ScaleControl, { position: 'bottomright' }),
        _react2.default.createElement(_reactLeaflet.TileLayer, { url: _constants.BASE_LAYER_URL }),
        _react2.default.createElement(_components.AridityTemperaturesLayer, {
          onRendered: onRender,
          showAridity: showAridity,
          showTemperatures: showTemperatures,
          zIndex: 400,
          data: aridityAndTemperatures,
          counts: counts
        }),
        _react2.default.createElement(_components.LakesRiversLayer, {
          data: lakesAndRivers,
          zIndex: 500
        }),
        _react2.default.createElement(_components.CirclesLayer, {
          types: circleTypes,
          onRender: onRender,
          onCirclesAdded: onCirclesAdded,
          onCirclesCreated: onCirclesCreated,
          show: showCircles,
          circles: circles.features
        }),
        _react2.default.createElement(_components.WaterLabelsLayer, { data: waterLabels }),
        _react2.default.createElement(_components.DesertLabelsLayer, { minZoom: 4, data: deserts })
      );
    }
  }]);

  return Atlas;
}(_react.Component);

Atlas.propTypes = {
  data: _propTypes2.default.object,
  counts: _propTypes2.default.object,
  showAridity: _propTypes2.default.bool,
  showTemperatures: _propTypes2.default.bool,
  showCircles: _propTypes2.default.bool,
  circleTypes: _propTypes2.default.object,
  print: _propTypes2.default.bool,
  onRender: _propTypes2.default.func,
  isSidebarOpened: _propTypes2.default.bool,
  onCirclesCreated: _propTypes2.default.func.isRequired,
  onCirclesAdded: _propTypes2.default.func.isRequired,
  onZoom: _propTypes2.default.func,
  onMapReady: _propTypes2.default.func,
  bindMapReference: _propTypes2.default.func.isRequired,
  width: _propTypes2.default.number,
  height: _propTypes2.default.number
};
Atlas.defaultProps = {
  print: false,
  isSidebarOpened: true
};
var _default = Atlas;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Atlas, 'Atlas', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/Atlas/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/Atlas/index.js');
}();

;

/***/ }),

/***/ "./src/components/organisms/AtlasFilters/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  transition: opacity .5s ease;\n  opacity: ', ';\n  pointer-events:', ';\n'], ['\n  transition: opacity .5s ease;\n  opacity: ', ';\n  pointer-events:', ';\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = __webpack_require__("./node_modules/react-redux/es/index.js");

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _components = __webpack_require__("./src/components/index.js");

var _selectors = __webpack_require__("./src/store/selectors.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Container = _styledComponents2.default.div(_templateObject, function (_ref) {
  var visible = _ref.visible;
  return visible ? 1 : 0;
}, function (_ref2) {
  var visible = _ref2.visible;
  return visible ? 'auto' : 'none';
});

var headingStyle = {
  marginBottom: '0.1rem',
  fontWeight: 'bold'
};

var AtlasFilters = function AtlasFilters(_ref3) {
  var visible = _ref3.visible;
  return _react2.default.createElement(
    Container,
    { visible: visible },
    _react2.default.createElement(
      _components.Heading,
      { level: 3, style: headingStyle },
      'Personnaliser la carte'
    ),
    _react2.default.createElement(
      _components.LayerFilterGroup,
      {
        layer: 'aridity',
        heading: 'Aridité'
      },
      _react2.default.createElement(_components.AridityFilters, null)
    ),
    _react2.default.createElement(
      _components.LayerFilterGroup,
      {
        layer: 'temperatures',
        heading: 'Températures'
      },
      _react2.default.createElement(_components.TemperaturesFilters, null)
    ),
    _react2.default.createElement(
      _components.LayerFilterGroup,
      {
        layer: 'circles',
        heading: 'Sécheresse',
        headingStyle: { marginTop: 0 }
      },
      _react2.default.createElement(_components.DryFilters, null)
    )
  );
};

AtlasFilters.propTypes = {
  visible: _propTypes2.default.bool
};

var _default = (0, _reactRedux.connect)(function (state) {
  return {
    visible: _selectors.fromSidebar.isOpened(state)
  };
})(AtlasFilters);

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Container, 'Container', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AtlasFilters/index.js');

  __REACT_HOT_LOADER__.register(headingStyle, 'headingStyle', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AtlasFilters/index.js');

  __REACT_HOT_LOADER__.register(AtlasFilters, 'AtlasFilters', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AtlasFilters/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AtlasFilters/index.js');
}();

;

/***/ }),

/***/ "./src/components/organisms/AtlasLegend/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  font-family: ', ';\n  background: ', ';\n  position: absolute;\n  z-index: 1000;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  transform: translate(', ', 0);\n  padding: 5px;\n  padding-top: 0;\n  max-width: ', 'px;\n  overflow: ', ';\n  transition: transform .5s ease-in-out;\n\n  &.legend--print {\n    font-family: Arial, sans-serif;\n    max-width: 700px;\n    position: static;\n    top: auto;\n    overflow: visible;\n    [data-tip]:after {\n      display: none;\n    }\n  }\n'], ['\n  font-family: ', ';\n  background: ', ';\n  position: absolute;\n  z-index: 1000;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  transform: translate(', ', 0);\n  padding: 5px;\n  padding-top: 0;\n  max-width: ', 'px;\n  overflow: ', ';\n  transition: transform .5s ease-in-out;\n\n  &.legend--print {\n    font-family: Arial, sans-serif;\n    max-width: 700px;\n    position: static;\n    top: auto;\n    overflow: visible;\n    [data-tip]:after {\n      display: none;\n    }\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  transition: opacity .5s ease;\n  opacity: ', ';\n  pointer-events: ', ';\n'], ['\n  transition: opacity .5s ease;\n  opacity: ', ';\n  pointer-events: ', ';\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledTheme = __webpack_require__("./node_modules/styled-theme/index.js");

var _components = __webpack_require__("./src/components/index.js");

var _styles = __webpack_require__("./src/utils/styles.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Legend = _styledComponents2.default.div(_templateObject, (0, _styledTheme.font)('primary'), (0, _styledTheme.palette)('white', 0), function (_ref) {
  var isOpened = _ref.isOpened;
  return isOpened ? 0 : '-87%';
}, _styles.legend.width, function (_ref2) {
  var isOpened = _ref2.isOpened;
  return isOpened ? 'auto' : 'hidden';
});

var VisibleIfOpened = _styledComponents2.default.div(_templateObject2, function (_ref3) {
  var isOpened = _ref3.isOpened;
  return isOpened ? 1 : 0;
}, function (_ref4) {
  var isOpened = _ref4.isOpened;
  return isOpened ? 'auto' : 'none';
});

var visibilityButtonStyle = {
  position: 'absolute',
  right: 0,
  left: 0
};

var AtlasLegend = function AtlasLegend(_ref5) {
  var isOpened = _ref5.isOpened,
      filters = _ref5.filters,
      layers = _ref5.layers,
      print = _ref5.print,
      circleSizes = _ref5.circleSizes;

  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      Legend,
      {
        className: 'legend ' + (print ? 'legend--print' : ''),
        isOpened: isOpened
      },
      !print && _react2.default.createElement(_components.LegendToggleButton, { style: visibilityButtonStyle }),
      _react2.default.createElement(
        VisibleIfOpened,
        { isOpened: isOpened },
        _react2.default.createElement(_components.LegendContent, {
          circleSizes: circleSizes,
          print: print,
          layers: layers,
          filters: filters
        })
      )
    ),
    _react2.default.createElement(_components.LegendTooltips, { layers: layers, filters: filters })
  );
};

AtlasLegend.propTypes = {
  layers: _propTypes2.default.object.isRequired,
  filters: _propTypes2.default.object.isRequired,
  circleSizes: _propTypes2.default.object.isRequired,
  print: _propTypes2.default.bool,
  isOpened: _propTypes2.default.bool

};

AtlasLegend.defaultProps = {
  print: false,
  isOpened: true
};

var _default = AtlasLegend;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Legend, 'Legend', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AtlasLegend/index.js');

  __REACT_HOT_LOADER__.register(VisibleIfOpened, 'VisibleIfOpened', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AtlasLegend/index.js');

  __REACT_HOT_LOADER__.register(visibilityButtonStyle, 'visibilityButtonStyle', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AtlasLegend/index.js');

  __REACT_HOT_LOADER__.register(AtlasLegend, 'AtlasLegend', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AtlasLegend/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AtlasLegend/index.js');
}();

;

/***/ }),

/***/ "./src/components/organisms/CircleSizesFilters/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  display: flex;\n  justify-content: space-around;\n  \n'], ['\n  display: flex;\n  justify-content: space-around;\n  \n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  flex-grow: 1;\n  flex-base: 1;\n'], ['\n  flex-grow: 1;\n  flex-base: 1;\n']),
    _templateObject3 = _taggedTemplateLiteral([''], ['']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = __webpack_require__("./node_modules/react-redux/es/index.js");

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _selectors = __webpack_require__("./src/store/selectors.js");

var _actions = __webpack_require__("./src/store/actions.js");

var _components = __webpack_require__("./src/components/index.js");

var _circles = __webpack_require__("./src/utils/circles.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Cols = _styledComponents2.default.div(_templateObject);

var Col = _styledComponents2.default.div(_templateObject2);

var Holder = _styledComponents2.default.div(_templateObject3);
var CircleSizesFilters = function CircleSizesFilters(_ref) {
  var onToggle = _ref.onToggle,
      sizes = _ref.sizes,
      layer = _ref.layer;

  var sarr = Object.keys(sizes).map(function (key) {
    return sizes[key];
  });

  var cols = [[sarr[0], sarr[2], sarr[4], sarr[6]], [sarr[1], sarr[3], sarr[5]]];

  return _react2.default.createElement(
    Holder,
    null,
    _react2.default.createElement(
      _components.Heading,
      {
        style: { marginBottom: 0 },
        level: 6
      },
      'Nombre de mois secs'
    ),
    _react2.default.createElement(
      Cols,
      null,
      cols.map(function (colSizes, colKey) {
        return _react2.default.createElement(
          Col,
          { key: 'col-circlefilter-' + colKey },
          colSizes.map(function (size) {
            return _react2.default.createElement(_components.ToggleFilter, {
              key: 'circle-filter-' + size.name,
              layer: layer,
              toggled: size.visible,
              onToggle: onToggle(size),
              label: (0, _circles.monthsDescription)(size.name)
            });
          })
        );
      })
    )
  );
};

CircleSizesFilters.propTypes = {
  onToggle: _propTypes2.default.func,
  sizes: _propTypes2.default.object,
  layer: _propTypes2.default.object
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    onToggle: function onToggle(type) {
      return function () {
        return dispatch((0, _actions.toggleCircleSizeVisibility)(type));
      };
    }
  };
};

var mapStateToProps = function mapStateToProps(state, ownProps) {
  return {
    sizes: _selectors.fromFilters.circlesSizes(state),
    layer: ownProps.layer
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(CircleSizesFilters);

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Cols, 'Cols', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/CircleSizesFilters/index.js');

  __REACT_HOT_LOADER__.register(Col, 'Col', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/CircleSizesFilters/index.js');

  __REACT_HOT_LOADER__.register(Holder, 'Holder', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/CircleSizesFilters/index.js');

  __REACT_HOT_LOADER__.register(CircleSizesFilters, 'CircleSizesFilters', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/CircleSizesFilters/index.js');

  __REACT_HOT_LOADER__.register(mapDispatchToProps, 'mapDispatchToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/CircleSizesFilters/index.js');

  __REACT_HOT_LOADER__.register(mapStateToProps, 'mapStateToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/CircleSizesFilters/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/CircleSizesFilters/index.js');
}();

;

/***/ }),

/***/ "./src/components/organisms/CircleTypesFilters/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = __webpack_require__("./node_modules/react-redux/es/index.js");

var _selectors = __webpack_require__("./src/store/selectors.js");

var _actions = __webpack_require__("./src/store/actions.js");

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CircleTypesFilters = function CircleTypesFilters(_ref) {
  var onToggle = _ref.onToggle,
      types = _ref.types,
      layer = _ref.layer;
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      _components.Heading,
      {
        style: { marginBottom: 0 },
        level: 6
      },
      'S\xE9cheresse d\u2019\xE9t\xE9 dominante'
    ),
    _react2.default.createElement(_components.ToggleFilter, {
      layer: layer,
      toggled: types.A.visible,
      onToggle: onToggle(types.A),
      label: 'Régimes à pluie d\'hiver'
    }),
    _react2.default.createElement(_components.ToggleFilter, {
      layer: layer,
      toggled: types.B.visible,
      onToggle: onToggle(types.B),
      label: 'Régimes à deux saisons de pluies'
    }),
    _react2.default.createElement(
      _components.Heading,
      {
        style: { marginBottom: 0 },
        level: 6
      },
      'S\xE9cheresse d\u2019hiver dominante'
    ),
    _react2.default.createElement(_components.ToggleFilter, {
      layer: layer,
      toggled: types.C.visible,
      onToggle: onToggle(types.C),
      label: 'Régimes à pluies d\'été'
    }),
    _react2.default.createElement(_components.ToggleFilter, {
      layer: layer,
      toggled: types.D.visible,
      onToggle: onToggle(types.D),
      label: 'Régimes à deux saisons de pluies'
    }),
    _react2.default.createElement(
      _components.Heading,
      {
        style: { marginBottom: 0 },
        level: 6
      },
      'R\xE9gimes de transition'
    ),
    _react2.default.createElement(_components.ToggleFilter, {
      layer: layer,
      toggled: types.E.visible,
      onToggle: onToggle(types.E),
      label: 'Régimes à deux saisons de pluies'
    }),
    _react2.default.createElement(_components.ToggleFilter, {
      layer: layer,
      toggled: types.F.visible,
      onToggle: onToggle(types.F),
      label: 'Régimes à irréguliers'
    })
  );
};

CircleTypesFilters.propTypes = {
  onToggle: _propTypes2.default.func,
  types: _propTypes2.default.object,
  layer: _propTypes2.default.object
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    onToggle: function onToggle(type) {
      return function () {
        return dispatch((0, _actions.toggleCircleTypeVisibility)(type));
      };
    }
  };
};

var mapStateToProps = function mapStateToProps(state, ownProps) {
  return {
    types: _selectors.fromFilters.circlesTypes(state),
    layer: ownProps.layer
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(CircleTypesFilters);

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(CircleTypesFilters, 'CircleTypesFilters', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/CircleTypesFilters/index.js');

  __REACT_HOT_LOADER__.register(mapDispatchToProps, 'mapDispatchToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/CircleTypesFilters/index.js');

  __REACT_HOT_LOADER__.register(mapStateToProps, 'mapStateToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/CircleTypesFilters/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/CircleTypesFilters/index.js');
}();

;

/***/ }),

/***/ "./src/components/organisms/CirclesLayer/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Scale = __webpack_require__("./node_modules/d3-scale/index.js");

var _reactLeaflet = __webpack_require__("./node_modules/react-leaflet/es/index.js");

var _circles = __webpack_require__("./src/utils/circles.js");

var _utils = __webpack_require__("./src/utils/index.js");

var _triangle = __webpack_require__("./src/components/organisms/CirclesLayer/triangle.js");

var _triangle2 = _interopRequireDefault(_triangle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var circleStyle = function circleStyle(circle) {
  var fill = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var show = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var style = {
    stroke: show,
    fillOpacity: 0,
    fillColor: 'transparent',
    color: 'black',
    weight: 1.33
  };
  if (fill) {
    var color = (0, _circles.circleColor)(circle);
    style = {
      stroke: false,
      fillOpacity: show ? 1 : 0,
      fillColor: color,
      color: color
    };
  }
  return style;
};

var CirclesLayer = function (_Component) {
  _inherits(CirclesLayer, _Component);

  function CirclesLayer(props) {
    _classCallCheck(this, CirclesLayer);

    var _this = _possibleConstructorReturn(this, (CirclesLayer.__proto__ || Object.getPrototypeOf(CirclesLayer)).call(this, props));

    _this.sizes = {};
    return _this;
  }

  _createClass(CirclesLayer, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(toProps) {
      var fromVisibleTypes = (0, _utils.visibleTypes)(this.props.types);
      var toVisibleTypes = (0, _utils.visibleTypes)(toProps.types);

      if (fromVisibleTypes.length !== toVisibleTypes.length) {
        return true;
      }
      if (this.props.show !== toProps.show) {
        return true;
      }
      if (this.props.circles.length !== toProps.circles.length) {
        return true;
      }
      return false;
    }
  }, {
    key: 'addToSizes',
    value: function addToSizes(circle, $ref) {
      var onCirclesCreated = this.props.onCirclesCreated;

      var size = circle.properties.size_;

      if (!this.sizes[size]) {
        this.sizes[size] = $ref;

        if (this.hasAllSizes()) {
          onCirclesCreated(this.sizes);
        }
      }
    }
  }, {
    key: 'bindElement',
    value: function bindElement(ref, elem, type, radius) {
      var _this2 = this;

      this.addToSizes(elem, ref, radius);
      this.renderedElements += 1;
      if (this.renderedElements === this.props.circles.length) {
        this.props.onRender();
        setTimeout(function () {
          setTimeout(function () {
            _this2.props.onCirclesAdded(_this2.sizes);
          }, 1000);
        }, 100);
      }
    }
  }, {
    key: 'hasAllSizes',
    value: function hasAllSizes() {
      var _this3 = this;

      return this.sizeKeys.every(function (key) {
        return _this3.sizes[key] !== null;
      });
    }
  }, {
    key: 'updateSizeKeys',
    value: function updateSizeKeys(circles) {
      this.sizeKeys = circles.map(function (_ref) {
        var properties = _ref.properties;
        return properties.size_;
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props = this.props,
          _props$show = _props.show,
          show = _props$show === undefined ? true : _props$show,
          circles = _props.circles,
          types = _props.types;


      this.renderedElements = 0;
      this.updateSizeKeys(circles);
      var _types = (0, _utils.visibleTypes)(types);
      if (circles.length === 0) {
        this.props.onRender();
        return null;
      }

      return _react2.default.createElement(
        _reactLeaflet.LayerGroup,
        null,
        circles.map(function (circle, key) {
          var elem = void 0; // the element to return
          var coords = circle.geometry.coordinates;
          var center = [coords[1], coords[0]];
          var size = circle.properties.size_;
          var scale = (0, _d3Scale.scaleLinear)().domain([10, 70]).range([15000, 70000]);
          var radius = scale(parseInt(size, 10) * 10);
          var style = circleStyle(circle, _types.length > 0, show);
          if (size === '01') {
            var points = (0, _triangle2.default)(center, radius);
            elem = _react2.default.createElement(_reactLeaflet.Polygon, _extends({
              ref: function ref(_ref2) {
                return _this4.bindElement(_ref2, circle, 'triangle', radius);
              }
            }, style, {
              positions: points,
              key: 'circle-' + key
            }));
          } else {
            elem = _react2.default.createElement(_reactLeaflet.Circle, _extends({
              ref: function ref(_ref3) {
                return _this4.bindElement(_ref3, circle, 'circle');
              },
              key: 'circle-' + key,
              interactive: false,
              radius: radius,
              center: center
            }, style));
          }
          return elem;
        })
      );
    }
  }]);

  return CirclesLayer;
}(_react.Component);

CirclesLayer.propTypes = {
  types: _propTypes2.default.object,
  show: _propTypes2.default.bool,
  circles: _propTypes2.default.array,
  onCirclesCreated: _propTypes2.default.func,
  onCirclesAdded: _propTypes2.default.func,
  onRender: _propTypes2.default.func
};
var _default = CirclesLayer;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(circleStyle, 'circleStyle', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/CirclesLayer/index.js');

  __REACT_HOT_LOADER__.register(CirclesLayer, 'CirclesLayer', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/CirclesLayer/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/CirclesLayer/index.js');
}();

;

/***/ }),

/***/ "./src/components/organisms/CirclesLayer/triangle.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _leaflet = __webpack_require__("./node_modules/leaflet/dist/leaflet-src.js");

var getScaled = function getScaled(ex) {
  return ex * 0.5 / 40075017 * 360;
};

var TrianglePoints = function TrianglePoints(center, radius) {
  var width = getScaled(radius) * 6;
  var height = getScaled(radius) * 5;
  center = (0, _leaflet.latLng)(center);
  var left = (0, _leaflet.latLng)([center.lat + height / 2, center.lng - width / 2]);
  var right = (0, _leaflet.latLng)([center.lat + height / 2, center.lng + width / 2]);
  var bottom = (0, _leaflet.latLng)([center.lat - height / 2, center.lng]);

  return [left, right, bottom];
};

var _default = TrianglePoints;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(getScaled, 'getScaled', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/CirclesLayer/triangle.js');

  __REACT_HOT_LOADER__.register(TrianglePoints, 'TrianglePoints', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/CirclesLayer/triangle.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/CirclesLayer/triangle.js');
}();

;

/***/ }),

/***/ "./src/components/organisms/DesertLabelsLayer/DesertLabelsLayer.css":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/happypack/loader.js?id=css-81af377f!./src/components/organisms/DesertLabelsLayer/DesertLabelsLayer.css");
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__("./node_modules/style-loader/addStyles.js")(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("./node_modules/happypack/loader.js?id=css-81af377f!./src/components/organisms/DesertLabelsLayer/DesertLabelsLayer.css", function() {
			var newContent = __webpack_require__("./node_modules/happypack/loader.js?id=css-81af377f!./src/components/organisms/DesertLabelsLayer/DesertLabelsLayer.css");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/components/organisms/DesertLabelsLayer/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _components = __webpack_require__("./src/components/index.js");

__webpack_require__("./src/components/organisms/DesertLabelsLayer/DesertLabelsLayer.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DesertLabelsLayer = function (_GeoJSONLabelsLayer) {
  _inherits(DesertLabelsLayer, _GeoJSONLabelsLayer);

  function DesertLabelsLayer() {
    _classCallCheck(this, DesertLabelsLayer);

    return _possibleConstructorReturn(this, (DesertLabelsLayer.__proto__ || Object.getPrototypeOf(DesertLabelsLayer)).apply(this, arguments));
  }

  return DesertLabelsLayer;
}(_components.GeoJSONLabelsLayer);

DesertLabelsLayer.defaultProps = _extends({}, _components.GeoJSONLabelsLayer.defaultProps, {
  layerName: 'desert',
  bindFeatureToLabel: function bindFeatureToLabel(feature, label) {
    return _react2.default.createElement(
      _components.DesertName,
      { desert: feature },
      label
    );
  }
});
var _default = DesertLabelsLayer;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(DesertLabelsLayer, 'DesertLabelsLayer', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/DesertLabelsLayer/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/DesertLabelsLayer/index.js');
}();

;

/***/ }),

/***/ "./src/components/organisms/DryFilters/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DryFilters = function DryFilters(props, _ref) {
  var layer = _ref.layer;
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(_components.CircleSizesFilters, { layer: layer }),
    _react2.default.createElement(_components.CircleTypesFilters, { layer: layer })
  );
};

DryFilters.contextTypes = {
  layer: _propTypes2.default.object
};

var _default = DryFilters;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(DryFilters, 'DryFilters', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/DryFilters/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/DryFilters/index.js');
}();

;

/***/ }),

/***/ "./src/components/organisms/ExportModal/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = __webpack_require__("./node_modules/react-redux/es/index.js");

var _formats = __webpack_require__("./src/utils/formats.js");

var _formats2 = _interopRequireDefault(_formats);

var _actions = __webpack_require__("./src/store/actions.js");

var _selectors = __webpack_require__("./src/store/selectors.js");

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var exportModalStyle = {
  minWidth: '600px'
};
var ExportModal = function ExportModal(_ref) {
  var isOpen = _ref.isOpen,
      exportData = _ref.exportData,
      exportInPNG = _ref.exportInPNG,
      exportInPDF = _ref.exportInPDF,
      isPreviewing = _ref.isPreviewing,
      isRendering = _ref.isRendering,
      mapPreview = _ref.mapPreview,
      mapReference = _ref.mapReference,
      _onAfterOpen = _ref.onAfterOpen,
      onClose = _ref.onClose;
  return _react2.default.createElement(
    _components.Modal,
    {
      style: exportModalStyle,
      isOpen: isOpen,
      closeable: true,
      onAfterOpen: function onAfterOpen() {
        return _onAfterOpen(mapReference);
      },
      onClose: onClose
    },
    _react2.default.createElement(_components.ExportPreview, {
      isPreviewing: isPreviewing,
      mapPreview: mapPreview
    }),
    _react2.default.createElement(_components.LoadingIndicator, { isLoading: isRendering }),
    _react2.default.createElement(
      _components.Button,
      { onClick: exportInPNG(exportData) },
      _react2.default.createElement(_components.PNGIcon, { height: 25, width: 25 }),
      '\xA0Exporter en PNG'
    ),
    '\xA0',
    _react2.default.createElement(
      _components.Button,
      { onClick: exportInPDF(exportData) },
      _react2.default.createElement(_components.PDFIcon, { height: 25, width: 25 }),
      '\xA0Exporter en PDF'
    )
  );
};

ExportModal.propTypes = {
  isOpen: _propTypes2.default.bool,
  exportData: _propTypes2.default.object,
  exportInPNG: _propTypes2.default.func,
  exportInPDF: _propTypes2.default.func,
  onAfterOpen: _propTypes2.default.func,
  onClose: _propTypes2.default.func,
  mapReference: _propTypes2.default.object,
  isPreviewing: _propTypes2.default.bool,
  isRendering: _propTypes2.default.bool,
  mapPreview: _propTypes2.default.object

};

var mapStateToProps = function mapStateToProps(state) {
  return {
    exportData: {
      circleSizes: _selectors.fromCircles.sizes(state),
      layers: _selectors.fromLayers.layers(state),
      mapPreview: _selectors.fromExport.mapPreview(state),
      mapReference: _selectors.fromExport.mapReference(state),
      filters: _selectors.fromFilters.filters(state)
    },
    mapReference: _selectors.fromExport.mapReference(state),
    mapPreview: _selectors.fromExport.mapPreview(state),
    isOpen: _selectors.fromExport.isModalOpened(state),
    isPreviewing: _selectors.fromExport.isPreviewing(state),
    isRendering: _selectors.fromExport.isRenderingDownloadable(state)
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    exportInPNG: function exportInPNG(data) {
      return function () {
        return dispatch((0, _actions.renderDownloadableMap)(_extends({ format: _formats2.default.PNG }, data)));
      };
    },
    exportInPDF: function exportInPDF(data) {
      return function () {
        return dispatch((0, _actions.renderDownloadableMap)(_extends({ format: _formats2.default.PDF }, data)));
      };
    },
    onClose: function onClose() {
      return dispatch((0, _actions.closeExportModal)());
    },
    onAfterOpen: function onAfterOpen(mapRef) {
      return dispatch((0, _actions.previewExport)(mapRef));
    }
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ExportModal);

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(exportModalStyle, 'exportModalStyle', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/ExportModal/index.js');

  __REACT_HOT_LOADER__.register(ExportModal, 'ExportModal', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/ExportModal/index.js');

  __REACT_HOT_LOADER__.register(mapStateToProps, 'mapStateToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/ExportModal/index.js');

  __REACT_HOT_LOADER__.register(mapDispatchToProps, 'mapDispatchToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/ExportModal/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/ExportModal/index.js');
}();

;

/***/ }),

/***/ "./src/components/organisms/LakesRiversLayer/delegate.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _components = __webpack_require__("./src/components/index.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FILL_STYLE = 'rgba(189, 230, 224, 1)';

var LakesRiversDelegate = function (_CanvasDelegate) {
  _inherits(LakesRiversDelegate, _CanvasDelegate);

  function LakesRiversDelegate() {
    _classCallCheck(this, LakesRiversDelegate);

    return _possibleConstructorReturn(this, (LakesRiversDelegate.__proto__ || Object.getPrototypeOf(LakesRiversDelegate)).apply(this, arguments));
  }

  _createClass(LakesRiversDelegate, [{
    key: 'draw',
    value: function draw(_ref) {
      var canvas = _ref.canvas,
          coords = _ref.coords,
          zoom = _ref.zoom;

      var _getTileFeatures = this.getTileFeatures(coords),
          rivers = _getTileFeatures.rivers,
          lakes = _getTileFeatures.lakes;

      var context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      this.drawAreas({
        features: rivers,
        fillStyle: 'rgba(0,0,0,0)',
        strokeStyle: FILL_STYLE,
        strokeWidth: function strokeWidth(feature) {
          return feature.tags.strokeweig * zoom * 0.33;
        },
        context: context
      });
      this.drawAreas({
        features: lakes,
        fillStyle: FILL_STYLE,
        strokeWidth: 0,
        context: context
      });
    }
  }]);

  return LakesRiversDelegate;
}(_components.CanvasDelegate);

var _default = LakesRiversDelegate;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(FILL_STYLE, 'FILL_STYLE', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/LakesRiversLayer/delegate.js');

  __REACT_HOT_LOADER__.register(LakesRiversDelegate, 'LakesRiversDelegate', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/LakesRiversLayer/delegate.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/LakesRiversLayer/delegate.js');
}();

;

/***/ }),

/***/ "./src/components/organisms/LakesRiversLayer/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _components = __webpack_require__("./src/components/index.js");

var _delegate = __webpack_require__("./src/components/organisms/LakesRiversLayer/delegate.js");

var _delegate2 = _interopRequireDefault(_delegate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LakesRiversLayer = function (_CanvasTiles) {
  _inherits(LakesRiversLayer, _CanvasTiles);

  function LakesRiversLayer() {
    _classCallCheck(this, LakesRiversLayer);

    return _possibleConstructorReturn(this, (LakesRiversLayer.__proto__ || Object.getPrototypeOf(LakesRiversLayer)).apply(this, arguments));
  }

  return LakesRiversLayer;
}(_components.CanvasTiles);

LakesRiversLayer.propTypes = _components.CanvasTiles.propTypes;
LakesRiversLayer.defaultProps = {
  delegate: _delegate2.default
};
var _default = LakesRiversLayer;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(LakesRiversLayer, 'LakesRiversLayer', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/LakesRiversLayer/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/LakesRiversLayer/index.js');
}();

;

/***/ }),

/***/ "./src/components/organisms/Navbar/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  background:', ';\n  height: ', 'px;\n  z-index: ', ';\n  position: fixed;\n  line-height: ', 'px;\n  top: 0px;\n  left:0px;\n  right: 0px;\n  clear: both;\n'], ['\n  background:', ';\n  height: ', 'px;\n  z-index: ', ';\n  position: fixed;\n  line-height: ', 'px;\n  top: 0px;\n  left:0px;\n  right: 0px;\n  clear: both;\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  float: right;\n  width: ', 'px;\n'], ['\n  float: right;\n  width: ', 'px;\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  display: flex;\n  float: left;\n'], ['\n  display: flex;\n  float: left;\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledTheme = __webpack_require__("./node_modules/styled-theme/index.js");

var _styles = __webpack_require__("./src/utils/styles.js");

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Nav = _styledComponents2.default.div(_templateObject, (0, _styledTheme.palette)('grayscale', 0), _styles.navbar.height, function (props) {
  return props.zIndex;
}, _styles.navbar.height);

var NavRight = _styledComponents2.default.div(_templateObject2, _styles.sidebar.width);

var NavLeft = _styledComponents2.default.div(_templateObject3);

var Navbar = function Navbar(props) {
  return _react2.default.createElement(
    Nav,
    props,
    _react2.default.createElement(
      NavLeft,
      null,
      _react2.default.createElement(_components.NavbarTabs, null)
    ),
    _react2.default.createElement(
      NavRight,
      null,
      _react2.default.createElement(_components.SocialSharing, null)
    )
  );
};

Navbar.propTypes = {
  height: _propTypes2.default.number,
  zIndex: _propTypes2.default.number
};

Navbar.defaultProps = {
  height: _styles.navbar.height,
  zIndex: 10
};

var _default = Navbar;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Nav, 'Nav', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/Navbar/index.js');

  __REACT_HOT_LOADER__.register(NavRight, 'NavRight', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/Navbar/index.js');

  __REACT_HOT_LOADER__.register(NavLeft, 'NavLeft', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/Navbar/index.js');

  __REACT_HOT_LOADER__.register(Navbar, 'Navbar', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/Navbar/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/Navbar/index.js');
}();

;

/***/ }),

/***/ "./src/components/organisms/NavbarTabs/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  list-style: none;\n  margin: 0; \n  padding: 0;\n  display: flex;\n'], ['\n  list-style: none;\n  margin: 0; \n  padding: 0;\n  display: flex;\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _helpOutline = __webpack_require__("./node_modules/react-icons/lib/md/help-outline.js");

var _helpOutline2 = _interopRequireDefault(_helpOutline);

var _public = __webpack_require__("./node_modules/react-icons/lib/md/public.js");

var _public2 = _interopRequireDefault(_public);

var _comment = __webpack_require__("./node_modules/react-icons/lib/md/comment.js");

var _comment2 = _interopRequireDefault(_comment);

var _home = __webpack_require__("./node_modules/react-icons/lib/md/home.js");

var _home2 = _interopRequireDefault(_home);

var _assignment = __webpack_require__("./node_modules/react-icons/lib/md/assignment.js");

var _assignment2 = _interopRequireDefault(_assignment);

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

// icons to use.


var Nav = _styledComponents2.default.ul(_templateObject);

var NavbarTabs = function NavbarTabs() {
  return _react2.default.createElement(
    Nav,
    null,
    _react2.default.createElement(_components.NavItem, {
      isHome: true,
      to: '/',
      icon: _react2.default.createElement(_home2.default, null),
      title: 'Accueil'
    }),
    _react2.default.createElement(_components.NavItem, {
      to: '/map',
      icon: _react2.default.createElement(_public2.default, null),
      title: 'Carte numérique mondiale des zones arides'
    }),
    _react2.default.createElement(_components.NavItem, {
      icon: _react2.default.createElement(_assignment2.default, null),
      title: 'Le projet',
      to: '/page/project'
    }),
    _react2.default.createElement(_components.NavItem, {
      icon: _react2.default.createElement(_helpOutline2.default, null),
      to: '/page/about',
      title: 'À propos'
    }),
    _react2.default.createElement(_components.NavItem, {
      icon: _react2.default.createElement(_comment2.default, null),
      to: '/page/contribute',
      title: 'Participer'
    })
  );
};

var _default = NavbarTabs;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Nav, 'Nav', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/NavbarTabs/index.js');

  __REACT_HOT_LOADER__.register(NavbarTabs, 'NavbarTabs', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/NavbarTabs/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/NavbarTabs/index.js');
}();

;

/***/ }),

/***/ "./src/components/organisms/Sidebar/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _templateObject = _taggedTemplateLiteral(['\n  position: fixed;\n  overflow: hidden;\n  top: ', 'px;\n  z-index: ', ';\n  bottom: 0px;\n  right: 0px;\n  transform: translate(0, 0);\n  background: ', ';\n  transition: transform .5s ease-in-out;\n  width: ', 'px;\n\n  &.closed {\n    transform: translate(', 'px, 0);\n  }\n\n  h4 + div h6:first-child {\n    margin-top: 0;\n  } \n'], ['\n  position: fixed;\n  overflow: hidden;\n  top: ', 'px;\n  z-index: ', ';\n  bottom: 0px;\n  right: 0px;\n  transform: translate(0, 0);\n  background: ', ';\n  transition: transform .5s ease-in-out;\n  width: ', 'px;\n\n  &.closed {\n    transform: translate(', 'px, 0);\n  }\n\n  h4 + div h6:first-child {\n    margin-top: 0;\n  } \n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledTheme = __webpack_require__("./node_modules/styled-theme/index.js");

var _reactRedux = __webpack_require__("./node_modules/react-redux/es/index.js");

var _selectors = __webpack_require__("./src/store/selectors.js");

var _styles = __webpack_require__("./src/utils/styles.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Side = _styledComponents2.default.div(_templateObject, _styles.navbar.height, function (props) {
  return props.zIndex || 0;
}, (0, _styledTheme.palette)('grayscale', 4), _styles.sidebar.width, _styles.sidebar.width - 40);

var Sidebar = function Sidebar(_ref) {
  var children = _ref.children,
      opened = _ref.opened,
      props = _objectWithoutProperties(_ref, ['children', 'opened']);

  var klass = opened ? '' : 'closed';
  return _react2.default.createElement(
    Side,
    _extends({ className: klass }, props),
    children
  );
};
Sidebar.propTypes = {
  opened: _propTypes2.default.bool,
  children: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.arrayOf(_propTypes2.default.node)])
};

Sidebar.defaultProps = {
  zIndex: 5
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    opened: _selectors.fromSidebar.isOpened(state)
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps)(Sidebar);

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Side, 'Side', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/Sidebar/index.js');

  __REACT_HOT_LOADER__.register(Sidebar, 'Sidebar', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/Sidebar/index.js');

  __REACT_HOT_LOADER__.register(mapStateToProps, 'mapStateToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/Sidebar/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/Sidebar/index.js');
}();

;

/***/ }),

/***/ "./src/components/organisms/TemperaturesFilters/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  font-family: ', ';\n  font-size: 0.8rem;\n  opacity: ', ';\n  line-height: ', ';\n  transition: opacity .2s ease, line-height .33s ease;\n  color: ', ';\n'], ['\n  font-family: ', ';\n  font-size: 0.8rem;\n  opacity: ', ';\n  line-height: ', ';\n  transition: opacity .2s ease, line-height .33s ease;\n  color: ', ';\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = __webpack_require__("./node_modules/react-redux/es/index.js");

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledTheme = __webpack_require__("./node_modules/styled-theme/index.js");

var _selectors = __webpack_require__("./src/store/selectors.js");

var _actions = __webpack_require__("./src/store/actions.js");

var _components = __webpack_require__("./src/components/index.js");

var _utils = __webpack_require__("./src/utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ERRORS = {
  noSummerSelected: 'NO_SUMMER',
  noWinterSelected: 'NO_WINTER'
};

var noWinterSelected = function noWinterSelected(err) {
  return err === ERRORS.noWinterSelected;
};
var noSummerSelected = function noSummerSelected(err) {
  return err === ERRORS.noSummerSelected;
};

var temperatureError = function temperatureError(winterTypes, summerTypes) {
  var visibleWinters = (0, _utils.visibleTypes)(winterTypes);
  var visibleSummers = (0, _utils.visibleTypes)(summerTypes);
  if (visibleWinters.length > 0 && visibleSummers.length === 0) {
    return ERRORS.noSummerSelected;
  }

  if (visibleSummers.length > 0 && visibleWinters.length === 0) {
    return ERRORS.noWinterSelected;
  }
};

var ErrorMessage = _styledComponents2.default.div(_templateObject, (0, _styledTheme.font)('primary'), function (_ref) {
  var visible = _ref.visible;
  return visible ? 1 : 0;
}, function (_ref2) {
  var visible = _ref2.visible;
  return visible ? '1em' : 0;
}, (0, _styledTheme.palette)('primary', 0));

var TemperaturesFilters = function TemperaturesFilters(_ref3, _ref4) {
  var error = _ref3.error,
      wTypes = _ref3.winterTypes,
      sTypes = _ref3.summerTypes,
      toggleWinterType = _ref3.toggleWinterType,
      toggleSummerType = _ref3.toggleSummerType;
  var layer = _ref4.layer;
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      _components.Heading,
      {
        style: { marginBottom: 0 },
        level: 6
      },
      'Type(s) d\'hiver'
    ),
    _react2.default.createElement(
      ErrorMessage,
      { visible: noWinterSelected(error) },
      _react2.default.createElement(
        'span',
        null,
        'Vous devez s\xE9lectionner au moins un type d\'hiver'
      )
    ),
    _react2.default.createElement(_components.ToggleFilter, {
      layer: layer,
      toggled: wTypes.A.visible,
      onToggle: toggleWinterType(wTypes.A),
      label: 'Hiver chaud (20 à 30°C)'
    }),
    _react2.default.createElement(_components.ToggleFilter, {
      layer: layer,
      toggled: wTypes.B.visible,
      onToggle: toggleWinterType(wTypes.B),
      label: 'Hiver tempéré (10 à 20°C)'
    }),
    _react2.default.createElement(_components.ToggleFilter, {
      layer: layer,
      toggled: wTypes.C.visible,
      onToggle: toggleWinterType(wTypes.C),
      label: 'Hiver frais (0 à 10°C)'
    }),
    _react2.default.createElement(_components.ToggleFilter, {
      layer: layer,
      toggled: wTypes.D.visible,
      onToggle: toggleWinterType(wTypes.D),
      label: 'Hiver froid (moins de 0°C)'
    }),
    _react2.default.createElement(
      _components.Heading,
      {
        style: { marginBottom: 0 },
        level: 6
      },
      'Type(s) d\'\xE9t\xE9'
    ),
    _react2.default.createElement(
      ErrorMessage,
      { visible: noSummerSelected(error) },
      _react2.default.createElement(
        'span',
        null,
        'Vous devez s\xE9lectionner au moins un type d\'\xE9t\xE9'
      )
    ),
    _react2.default.createElement(_components.ToggleFilter, {
      layer: layer,
      toggled: sTypes.A.visible,
      onToggle: toggleSummerType(sTypes.A),
      label: 'Été très chaud (plus de 30°C)'
    }),
    _react2.default.createElement(_components.ToggleFilter, {
      layer: layer,
      toggled: sTypes.B.visible,
      onToggle: toggleSummerType(sTypes.B),
      label: 'Été chaud (20 à 30°C)'
    }),
    _react2.default.createElement(_components.ToggleFilter, {
      layer: layer,
      toggled: sTypes.C.visible,
      onToggle: toggleSummerType(sTypes.C),
      label: 'Été tempéré (10 à 20°C)'
    })
  );
};

TemperaturesFilters.propTypes = {
  error: _propTypes2.default.string,
  winterTypes: _propTypes2.default.object,
  summerTypes: _propTypes2.default.object,
  toggleWinterType: _propTypes2.default.func,
  toggleSummerType: _propTypes2.default.func
};

TemperaturesFilters.contextTypes = {
  layer: _propTypes2.default.object
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    error: temperatureError(_selectors.fromFilters.winterTemperatures(state), _selectors.fromFilters.summerTemperatures(state)),
    winterTypes: _selectors.fromFilters.winterTemperatures(state),
    summerTypes: _selectors.fromFilters.summerTemperatures(state)
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    toggleWinterType: function toggleWinterType(type) {
      return function () {
        return dispatch((0, _actions.toggleTemperatureVisibility)('winter', type));
      };
    },
    toggleSummerType: function toggleSummerType(type) {
      return function () {
        return dispatch((0, _actions.toggleTemperatureVisibility)('summer', type));
      };
    }
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(TemperaturesFilters);

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(ERRORS, 'ERRORS', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/TemperaturesFilters/index.js');

  __REACT_HOT_LOADER__.register(noWinterSelected, 'noWinterSelected', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/TemperaturesFilters/index.js');

  __REACT_HOT_LOADER__.register(noSummerSelected, 'noSummerSelected', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/TemperaturesFilters/index.js');

  __REACT_HOT_LOADER__.register(temperatureError, 'temperatureError', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/TemperaturesFilters/index.js');

  __REACT_HOT_LOADER__.register(ErrorMessage, 'ErrorMessage', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/TemperaturesFilters/index.js');

  __REACT_HOT_LOADER__.register(TemperaturesFilters, 'TemperaturesFilters', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/TemperaturesFilters/index.js');

  __REACT_HOT_LOADER__.register(mapStateToProps, 'mapStateToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/TemperaturesFilters/index.js');

  __REACT_HOT_LOADER__.register(mapDispatchToProps, 'mapDispatchToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/TemperaturesFilters/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/TemperaturesFilters/index.js');
}();

;

/***/ }),

/***/ "./src/components/organisms/TutorialModal/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = __webpack_require__("./node_modules/react-redux/es/index.js");

var _components = __webpack_require__("./src/components/index.js");

var _selectors = __webpack_require__("./src/store/selectors.js");

var _actions = __webpack_require__("./src/store/actions.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TutorialTitle = function TutorialTitle() {
  return _react2.default.createElement(
    'span',
    null,
    'Comment utiliser la carte'
  );
};

var TutorialModal = function TutorialModal(_ref) {
  var isOpen = _ref.isOpen,
      inMap = _ref.inMap,
      onClose = _ref.onClose;
  return _react2.default.createElement(
    _components.Modal,
    {
      title: _react2.default.createElement(TutorialTitle, null),
      isOpen: isOpen && inMap,
      onClose: onClose,
      closeable: true
    },
    _react2.default.createElement(_components.Markdown, { source: _components.MarkdownContent.Tutorial })
  );
};

TutorialModal.propTypes = {
  isOpen: _propTypes2.default.bool,
  inMap: _propTypes2.default.bool,
  onClose: _propTypes2.default.func
};

var mapStateToProps = function mapStateToProps(state, ownProps) {
  return {
    inMap: ownProps.inMap,
    isOpen: _selectors.fromTutorial.isVisible(state)
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    onClose: function onClose() {
      return dispatch((0, _actions.hideTutorial)());
    }
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(TutorialModal);

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(TutorialTitle, 'TutorialTitle', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/TutorialModal/index.js');

  __REACT_HOT_LOADER__.register(TutorialModal, 'TutorialModal', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/TutorialModal/index.js');

  __REACT_HOT_LOADER__.register(mapStateToProps, 'mapStateToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/TutorialModal/index.js');

  __REACT_HOT_LOADER__.register(mapDispatchToProps, 'mapDispatchToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/TutorialModal/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/TutorialModal/index.js');
}();

;

/***/ }),

/***/ "./src/components/organisms/WaterLabelsLayer/WaterLabelsLayer.css":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/happypack/loader.js?id=css-81af377f!./src/components/organisms/WaterLabelsLayer/WaterLabelsLayer.css");
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__("./node_modules/style-loader/addStyles.js")(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("./node_modules/happypack/loader.js?id=css-81af377f!./src/components/organisms/WaterLabelsLayer/WaterLabelsLayer.css", function() {
			var newContent = __webpack_require__("./node_modules/happypack/loader.js?id=css-81af377f!./src/components/organisms/WaterLabelsLayer/WaterLabelsLayer.css");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/components/organisms/WaterLabelsLayer/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _components = __webpack_require__("./src/components/index.js");

__webpack_require__("./src/components/organisms/WaterLabelsLayer/WaterLabelsLayer.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WaterLabelsLayer = function (_GeoJSONLabelsLayer) {
  _inherits(WaterLabelsLayer, _GeoJSONLabelsLayer);

  function WaterLabelsLayer() {
    _classCallCheck(this, WaterLabelsLayer);

    return _possibleConstructorReturn(this, (WaterLabelsLayer.__proto__ || Object.getPrototypeOf(WaterLabelsLayer)).apply(this, arguments));
  }

  return WaterLabelsLayer;
}(_components.GeoJSONLabelsLayer);

WaterLabelsLayer.defaultProps = _extends({}, _components.GeoJSONLabelsLayer.defaultProps, {
  layerName: 'water-labels',
  useMultipleCentroids: true,
  bindFeatureToLabel: function bindFeatureToLabel(feature, label) {
    return _react2.default.createElement(
      _components.WaterLabel,
      { feature: feature },
      label
    );
  }
});
var _default = WaterLabelsLayer;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(WaterLabelsLayer, 'WaterLabelsLayer', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/WaterLabelsLayer/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/WaterLabelsLayer/index.js');
}();

;

/***/ }),

/***/ "./src/components/pages/ContentPage/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__("./node_modules/react-router-dom/es/index.js");

var _containers = __webpack_require__("./src/containers/index.js");

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var content = {
  about: _components.MarkdownContent.About,
  project: _components.MarkdownContent.Project,
  contribute: _components.MarkdownContent.Contribute
};

var ContentPage = function ContentPage() {
  return _react2.default.createElement(
    _containers.ContentContainer,
    null,
    _react2.default.createElement(_reactRouterDom.Route, {
      path: '/page/:pageName',
      render: function render(_ref) {
        var match = _ref.match;

        var md = content[match.params.pageName];
        var res = void 0;
        if (!md) {
          res = _react2.default.createElement(_reactRouterDom.Redirect, { to: '/map' });
        } else {
          res = _react2.default.createElement(_components.Markdown, { source: content[match.params.pageName] });
        }
        return res;
      }
    })
  );
};

var _default = ContentPage;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(content, 'content', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/pages/ContentPage/index.js');

  __REACT_HOT_LOADER__.register(ContentPage, 'ContentPage', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/pages/ContentPage/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/pages/ContentPage/index.js');
}();

;

/***/ }),

/***/ "./src/components/pages/HomePage/background.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "0f153d081094ff1934c8168971ff4d30.png";

/***/ }),

/***/ "./src/components/pages/HomePage/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  text-align: center;\n  & p {\n    text-align: center !important;\n  }\n'], ['\n  text-align: center;\n  & p {\n    text-align: center !important;\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  height: auto;\n  min-height: 2.5em;\n  color: white !important;\n  &:hover {\n    text-decoration: none !important;\n  }\n'], ['\n  height: auto;\n  min-height: 2.5em;\n  color: white !important;\n  &:hover {\n    text-decoration: none !important;\n  }\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-image: url(\'', '\');\n  background-repeat: no-repeat;\n  background-size: cover;\n  z-index: 5;\n  &:before {\n    content: \' \';\n    display: block;\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    z-index: 6;\n    background: rgba(255,255,255,0.8);\n  }\n'], ['\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-image: url(\'', '\');\n  background-repeat: no-repeat;\n  background-size: cover;\n  z-index: 5;\n  &:before {\n    content: \' \';\n    display: block;\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    z-index: 6;\n    background: rgba(255,255,255,0.8);\n  }\n']),
    _templateObject4 = _taggedTemplateLiteral(['\n  padding: 0.5rem 0;\n  display: block;\n'], ['\n  padding: 0.5rem 0;\n  display: block;\n']),
    _templateObject5 = _taggedTemplateLiteral(['\n  font-family: ', ';\n  position: absolute;\n  max-width: 60%;\n  margin: auto;\n  left: 0;\n  right: 0;\n  top: 4em;\n  bottom: 2em;\n  z-index: 10;\n  @media (max-width: 1200px){\n    max-width: 80%;\n  }\n\n'], ['\n  font-family: ', ';\n  position: absolute;\n  max-width: 60%;\n  margin: auto;\n  left: 0;\n  right: 0;\n  top: 4em;\n  bottom: 2em;\n  z-index: 10;\n  @media (max-width: 1200px){\n    max-width: 80%;\n  }\n\n']),
    _templateObject6 = _taggedTemplateLiteral(['\n  position: absolute;\n  z-index: 11;\n  top: 0;\n  left: 0;\n  right:0;\n\n'], ['\n  position: absolute;\n  z-index: 11;\n  top: 0;\n  left: 0;\n  right:0;\n\n']),
    _templateObject7 = _taggedTemplateLiteral(['\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right:0;\n'], ['\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right:0;\n']),
    _templateObject8 = _taggedTemplateLiteral(['\n  height: 100px;\n  bottom: 0;\n  position: absolute;\n  left:0;\n  right: 0;\n  max-with: 500px;\n  margin: auto;\n'], ['\n  height: 100px;\n  bottom: 0;\n  position: absolute;\n  left:0;\n  right: 0;\n  max-with: 500px;\n  margin: auto;\n']),
    _templateObject9 = _taggedTemplateLiteral(['\n  position: absolute;\n  left: 0;\n'], ['\n  position: absolute;\n  left: 0;\n']),
    _templateObject10 = _taggedTemplateLiteral(['\n  position: absolute;\n  left: 0;\n  right: 0;\n'], ['\n  position: absolute;\n  left: 0;\n  right: 0;\n']),
    _templateObject11 = _taggedTemplateLiteral(['\n  display:flex;\n  flex-direction: row;\n  align-items: center;\n'], ['\n  display:flex;\n  flex-direction: row;\n  align-items: center;\n']),
    _templateObject12 = _taggedTemplateLiteral(['\n  display: block;\n  padding-right: 1em;\n  width: 225px;\n  font-size: 4em;\n  line-height: 1em;\n  margin: 0 !important;\n  border-right: 2px solid ', ';\n  text-transform: uppercase;\n  & .grey {\n    color: ', ';\n  }\n'], ['\n  display: block;\n  padding-right: 1em;\n  width: 225px;\n  font-size: 4em;\n  line-height: 1em;\n  margin: 0 !important;\n  border-right: 2px solid ', ';\n  text-transform: uppercase;\n  & .grey {\n    color: ', ';\n  }\n']),
    _templateObject13 = _taggedTemplateLiteral(['\n  width: 300px;\n  font-size: 1.33em;\n  padding-left: 1em;\n'], ['\n  width: 300px;\n  font-size: 1.33em;\n  padding-left: 1em;\n']),
    _templateObject14 = _taggedTemplateLiteral(['\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n'], ['\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n']),
    _templateObject15 = _taggedTemplateLiteral(['\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n'], ['\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = __webpack_require__("./node_modules/react-redux/es/index.js");

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledTheme = __webpack_require__("./node_modules/styled-theme/index.js");

var _components = __webpack_require__("./src/components/index.js");

var _selectors = __webpack_require__("./src/store/selectors.js");

var _background = __webpack_require__("./src/components/pages/HomePage/background.png");

var _background2 = _interopRequireDefault(_background);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var HomeTitleDescription = 'Un portail élaboré par le [CEDEJ](http://cedej-eg.org/), une unité mixte française de recherche à l’étranger du [CNRS](http://www.cnrs.fr/) et du [Ministère de l\'Europe et des Affaires étrangères](http://www.diplomatie.gouv.fr/fr/)';

var HomeActionText = '**CRÉER votre carte personnalisée des zones arides  \n[CONTRIBUER à l’actualisation de la base de données](/page/contribute) sur l’aridité**';

var Centered = _styledComponents2.default.div(_templateObject);
var Button = (0, _styledComponents2.default)(_components.Button)(_templateObject2);

var AtlasBackground = _styledComponents2.default.div(_templateObject3, _background2.default);

var LoadingHolder = _styledComponents2.default.span(_templateObject4);

var Holder = _styledComponents2.default.div(_templateObject5, (0, _styledTheme.font)('primary'));

var Top = _styledComponents2.default.div(_templateObject6);
var Bottom = _styledComponents2.default.div(_templateObject7);
var BottomBar = _styledComponents2.default.div(_templateObject8);
var Left = _styledComponents2.default.div(_templateObject9);

var Center = _styledComponents2.default.div(_templateObject10);

var TitleHolder = _styledComponents2.default.div(_templateObject11);
var MainTitle = (0, _styledComponents2.default)(_components.Heading)(_templateObject12, (0, _styledTheme.palette)('grayscale', 2), (0, _styledTheme.palette)('grayscale', 2));

var MainDescription = (0, _styledComponents2.default)(_components.Markdown)(_templateObject13);

var Content = (0, _styledComponents2.default)(_components.Content)(_templateObject14);

var Middle = _styledComponents2.default.div(_templateObject15);

var HomeTitle = function HomeTitle() {
  return _react2.default.createElement(
    TitleHolder,
    null,
    _react2.default.createElement(
      MainTitle,
      { level: 1 },
      'Aridity ',
      _react2.default.createElement(
        'span',
        { className: 'grey' },
        'World'
      ),
      ' Map'
    ),
    _react2.default.createElement(MainDescription, { source: HomeTitleDescription })
  );
};

var HomePage = function HomePage(_ref) {
  var isLoading = _ref.isLoading;

  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(AtlasBackground, null),
    _react2.default.createElement(
      Holder,
      null,
      _react2.default.createElement(
        Content,
        null,
        _react2.default.createElement(
          Top,
          null,
          _react2.default.createElement(
            Left,
            null,
            _react2.default.createElement(HomeTitle, null)
          )
        ),
        _react2.default.createElement(
          Middle,
          null,
          _react2.default.createElement(
            Centered,
            null,
            _react2.default.createElement(_components.Markdown, { source: HomeActionText }),
            _react2.default.createElement(
              Button,
              { to: '/map' },
              isLoading && _react2.default.createElement(
                LoadingHolder,
                null,
                _react2.default.createElement(_components.LoadingIcon, { reverse: true }),
                'Chargement de la carte'
              ),
              !isLoading && _react2.default.createElement(
                'span',
                null,
                'D\xE9marrer'
              )
            )
          )
        ),
        _react2.default.createElement(
          Bottom,
          { style: { height: '3.1em' } },
          _react2.default.createElement(
            Left,
            null,
            _react2.default.createElement(
              _components.Bold,
              null,
              '\xA9 CEDEJ - 2017'
            )
          )
        ),
        _react2.default.createElement(
          BottomBar,
          null,
          _react2.default.createElement(
            Center,
            { style: { maxWidth: '500px', margin: 'auto' } },
            _react2.default.createElement(_components.PartnersLogo, { height: '120px', horizontal: true })
          )
        )
      )
    )
  );
};

HomePage.propTypes = {
  isLoading: _propTypes2.default.bool
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    isLoading: _selectors.fromAtlas.isRendering(state)
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps)(HomePage);

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(HomeTitleDescription, 'HomeTitleDescription', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/pages/HomePage/index.js');

  __REACT_HOT_LOADER__.register(HomeActionText, 'HomeActionText', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/pages/HomePage/index.js');

  __REACT_HOT_LOADER__.register(Centered, 'Centered', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/pages/HomePage/index.js');

  __REACT_HOT_LOADER__.register(Button, 'Button', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/pages/HomePage/index.js');

  __REACT_HOT_LOADER__.register(AtlasBackground, 'AtlasBackground', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/pages/HomePage/index.js');

  __REACT_HOT_LOADER__.register(LoadingHolder, 'LoadingHolder', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/pages/HomePage/index.js');

  __REACT_HOT_LOADER__.register(Holder, 'Holder', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/pages/HomePage/index.js');

  __REACT_HOT_LOADER__.register(Top, 'Top', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/pages/HomePage/index.js');

  __REACT_HOT_LOADER__.register(Bottom, 'Bottom', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/pages/HomePage/index.js');

  __REACT_HOT_LOADER__.register(BottomBar, 'BottomBar', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/pages/HomePage/index.js');

  __REACT_HOT_LOADER__.register(Left, 'Left', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/pages/HomePage/index.js');

  __REACT_HOT_LOADER__.register(Center, 'Center', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/pages/HomePage/index.js');

  __REACT_HOT_LOADER__.register(TitleHolder, 'TitleHolder', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/pages/HomePage/index.js');

  __REACT_HOT_LOADER__.register(MainTitle, 'MainTitle', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/pages/HomePage/index.js');

  __REACT_HOT_LOADER__.register(MainDescription, 'MainDescription', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/pages/HomePage/index.js');

  __REACT_HOT_LOADER__.register(Content, 'Content', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/pages/HomePage/index.js');

  __REACT_HOT_LOADER__.register(Middle, 'Middle', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/pages/HomePage/index.js');

  __REACT_HOT_LOADER__.register(HomeTitle, 'HomeTitle', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/pages/HomePage/index.js');

  __REACT_HOT_LOADER__.register(HomePage, 'HomePage', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/pages/HomePage/index.js');

  __REACT_HOT_LOADER__.register(mapStateToProps, 'mapStateToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/pages/HomePage/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/pages/HomePage/index.js');
}();

;

/***/ }),

/***/ "./src/components/templates/PageTemplate/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  position: fixed;\n  top: ', 'px;\n  right:0px;\n  left: 0px;\n  bottom:0px;\n  z-index: ', ';\n  overflow: visible;\n'], ['\n  position: fixed;\n  top: ', 'px;\n  right:0px;\n  left: 0px;\n  bottom:0px;\n  z-index: ', ';\n  overflow: visible;\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  position: fixed;\n  left: 0;\n  right: 0;\n  overflow: hidden;\n  bottom: 0;\n  top: 0;\n'], ['\n  position: fixed;\n  left: 0;\n  right: 0;\n  overflow: hidden;\n  bottom: 0;\n  top: 0;\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _components = __webpack_require__("./src/components/index.js");

var _styles = __webpack_require__("./src/utils/styles.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ContainerHolder = _styledComponents2.default.div(_templateObject, _styles.navbar.height, function (_ref) {
  var _ref$zIndex = _ref.zIndex,
      zIndex = _ref$zIndex === undefined ? 0 : _ref$zIndex;
  return zIndex;
});

var Container = _styledComponents2.default.div(_templateObject2);

var AppTemplate = function AppTemplate(_ref2) {
  var children = _ref2.children;
  return _react2.default.createElement(
    'div',
    { className: 'page-template' },
    _react2.default.createElement(_components.Navbar, null),
    _react2.default.createElement(
      ContainerHolder,
      null,
      _react2.default.createElement(
        Container,
        null,
        children
      )
    )
  );
};

AppTemplate.propTypes = {
  children: _propTypes2.default.node
};

var _default = AppTemplate;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(ContainerHolder, 'ContainerHolder', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/templates/PageTemplate/index.js');

  __REACT_HOT_LOADER__.register(Container, 'Container', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/templates/PageTemplate/index.js');

  __REACT_HOT_LOADER__.register(AppTemplate, 'AppTemplate', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/templates/PageTemplate/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/templates/PageTemplate/index.js');
}();

;

/***/ }),

/***/ "./src/components/themes/default.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _composer = __webpack_require__("./node_modules/styled-theme/composer.js");

var theme = {}; // https://github.com/diegohaz/arc/wiki/Styling


theme.palette = {
  primary: ['rgb(221, 19, 19)', 'rgb(216, 56, 56)', 'rgb(151, 5, 5)', 'rgb(240, 179, 179)', 'rgb(151, 5, 5)', '#71bcf7', '#c2e2fb'],
  secondary: ['#c2185b', '#e91e63', '#f06292', '#f8bbd0'],
  danger: ['#d32f2f', '#f44336', '#f8877f', '#ffcdd2'],
  alert: ['#ffa000', '#ffc107', '#ffd761', '#ffecb3'],
  success: ['#388e3c', '#4caf50', '#7cc47f', '#c8e6c9'],
  grayscale: ['#212121', '#616161', '#9e9e9e', '#bdbdbd', '#e0e0e0', '#eeeeee', '#ffffff'],
  white: ['#fff', '#fff', '#eee']
};

theme.reversePalette = (0, _composer.reversePalette)(theme.palette);

theme.fonts = {
  primary: 'Open Sans, Roboto, sans-serif',
  pre: 'Consolas, Liberation Mono, Menlo, Courier, monospace',
  quote: 'Georgia, serif'
};

var _default = theme;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(theme, 'theme', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/themes/default.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/themes/default.js');
}();

;

/***/ }),

/***/ "./src/config.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var merge = __webpack_require__("./node_modules/lodash.merge/index.js");

var config = {
  all: {
    env: "development" || 'development',
    isDev: "development" !== 'production',
    basename: "",
    isBrowser: typeof window !== 'undefined',
    apiUrl: 'https://cedej-atlas.surge.sh'
  },
  test: {},
  development: {
    apiUrl: 'http://localhost:3000'
  },
  production: {
    apiUrl: 'http://www.aridityworldmap.org'
  }
};

module.exports = merge(config.all, config[config.all.env]);
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(config, 'config', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/config.js');
}();

;

/***/ }),

/***/ "./src/containers ^((?!index).)*\\.js$":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./Atlas.js": "./src/containers/Atlas.js",
	"./AtlasLegend.js": "./src/containers/AtlasLegend.js",
	"./ConfirmModal.js": "./src/containers/ConfirmModal.js",
	"./ContentContainer.js": "./src/containers/ContentContainer.js",
	"./Generic.js": "./src/containers/Generic.js",
	"./Modal.js": "./src/containers/Modal.js",
	"./Sidebar.js": "./src/containers/Sidebar.js"
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/containers ^((?!index).)*\\.js$";

/***/ }),

/***/ "./src/containers/Atlas.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  overflow: hidden;\n'], ['\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  overflow: hidden;\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  color: red;\n'], ['\n  color: red;\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = __webpack_require__("./node_modules/react-redux/es/index.js");

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _actions = __webpack_require__("./src/store/actions.js");

var _selectors = __webpack_require__("./src/store/selectors.js");

var _components = __webpack_require__("./src/components/index.js");

var _containers = __webpack_require__("./src/containers/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Holder = _styledComponents2.default.div(_templateObject);

var Error = _styledComponents2.default.span(_templateObject2);

var AtlasContainer = function (_Component) {
  _inherits(AtlasContainer, _Component);

  function AtlasContainer() {
    _classCallCheck(this, AtlasContainer);

    return _possibleConstructorReturn(this, (AtlasContainer.__proto__ || Object.getPrototypeOf(AtlasContainer)).apply(this, arguments));
  }

  _createClass(AtlasContainer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.loadData();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          circleTypes = _props.circleTypes,
          bindMapReference = _props.bindMapReference,
          data = _props.data,
          counts = _props.counts,
          error = _props.error,
          showAridity = _props.showAridity,
          showTemperatures = _props.showTemperatures,
          showCircles = _props.showCircles,
          isRendering = _props.isRendering,
          isSidebarOpened = _props.isSidebarOpened,
          onZoom = _props.onZoom,
          onCirclesCreated = _props.onCirclesCreated,
          onCirclesAdded = _props.onCirclesAdded,
          onRender = _props.onRender,
          onMapReady = _props.onMapReady;

      return _react2.default.createElement(
        Holder,
        { className: 'atlas-container' },
        _react2.default.createElement(_components.LoadingIndicator, { isLoading: isRendering }),
        error && _react2.default.createElement(
          Error,
          null,
          error.message
        ),
        data && _react2.default.createElement(_components.Atlas, {
          bindMapReference: bindMapReference,
          data: data,
          counts: counts,
          circleTypes: circleTypes,
          isSidebarOpened: isSidebarOpened,
          onZoom: onZoom,
          onRender: onRender,
          onMapReady: onMapReady,
          onCirclesCreated: onCirclesCreated,
          onCirclesAdded: onCirclesAdded,
          showAridity: showAridity,
          showTemperatures: showTemperatures,
          showCircles: showCircles
        }),
        data && _react2.default.createElement(_containers.AtlasLegend, null),
        _react2.default.createElement(
          _components.Sidebar,
          { zIndex: 1000 },
          _react2.default.createElement(_components.SidebarToggleButton, null),
          _react2.default.createElement(
            _containers.Sidebar,
            null,
            _react2.default.createElement(_components.AtlasFilters, null),
            _react2.default.createElement(_components.AtlasExportButton, null)
          )
        )
      );
    }
  }]);

  return AtlasContainer;
}(_react.Component);

AtlasContainer.propTypes = {
  counts: _propTypes2.default.shape({
    aridity: _propTypes2.default.object,
    temperatures: _propTypes2.default.object
  }),
  data: _propTypes2.default.shape({
    deserts: _propTypes2.default.object,
    lakesAndRivers: _propTypes2.default.object,
    aridity: _propTypes2.default.object,
    circles: _propTypes2.default.object,
    temperatures: _propTypes2.default.object
  }),
  circleTypes: _propTypes2.default.object,
  error: _propTypes2.default.object,
  isRendering: _propTypes2.default.bool,
  isSidebarOpened: _propTypes2.default.bool,
  showTemperatures: _propTypes2.default.bool,
  showAridity: _propTypes2.default.bool,
  showCircles: _propTypes2.default.bool,
  onZoom: _propTypes2.default.func,
  onMapReady: _propTypes2.default.func,
  onCirclesCreated: _propTypes2.default.func,
  onCirclesAdded: _propTypes2.default.func,
  onRender: _propTypes2.default.func,
  loadData: _propTypes2.default.func.isRequired,
  bindMapReference: _propTypes2.default.func.isRequired
};


var mapStateToProps = function mapStateToProps(state) {
  return {
    isSidebarOpened: _selectors.fromSidebar.isOpened(state),
    isContextualInfoVisible: _selectors.fromAtlas.isContextualInfoVisible(state),
    isRendering: _selectors.fromAtlas.isRendering(state),
    showAridity: _selectors.fromLayers.isLayerVisible(state, _selectors.fromLayers.aridity(state)),
    showTemperatures: _selectors.fromLayers.isLayerVisible(state, _selectors.fromLayers.temperatures(state)),
    showCircles: _selectors.fromLayers.isLayerVisible(state, _selectors.fromLayers.circles(state)),
    data: _selectors.fromFilters.data(state),
    counts: _selectors.fromFilters.counts(state),
    circleTypes: _selectors.fromFilters.circlesTypes(state),
    error: state.atlas.error
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    bindMapReference: function bindMapReference(ref) {
      return dispatch((0, _actions.bindMapReference)(ref));
    },
    onZoom: function onZoom() {
      return dispatch((0, _actions.zoom)());
    },
    onCirclesCreated: function onCirclesCreated(circleSizes) {
      return dispatch((0, _actions.setCircleSizesRefs)(circleSizes));
    },
    onCirclesAdded: function onCirclesAdded(sizes) {
      return dispatch((0, _actions.onAdd)(sizes));
    },
    loadData: function loadData() {
      return dispatch((0, _actions.loadData)());
    },
    onRender: function onRender() {
      return dispatch((0, _actions.renderSuccess)());
    },
    onMapReady: function onMapReady() {
      return dispatch((0, _actions.mapReady)());
    }
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(AtlasContainer);

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Holder, 'Holder', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/containers/Atlas.js');

  __REACT_HOT_LOADER__.register(Error, 'Error', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/containers/Atlas.js');

  __REACT_HOT_LOADER__.register(AtlasContainer, 'AtlasContainer', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/containers/Atlas.js');

  __REACT_HOT_LOADER__.register(mapStateToProps, 'mapStateToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/containers/Atlas.js');

  __REACT_HOT_LOADER__.register(mapDispatchToProps, 'mapDispatchToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/containers/Atlas.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/containers/Atlas.js');
}();

;

/***/ }),

/***/ "./src/containers/AtlasLegend.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _selectors = __webpack_require__("./src/store/selectors.js");

var _reactRedux = __webpack_require__("./node_modules/react-redux/es/index.js");

var _components = __webpack_require__("./src/components/index.js");

var mapStateToProps = function mapStateToProps(state) {
  return {
    circleSizes: _selectors.fromCircles.sizes(state),
    isOpened: _selectors.fromLegend.isOpened(state),
    filters: _selectors.fromFilters.filters(state),
    layers: _selectors.fromLayers.layers(state)
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps)(_components.AtlasLegend);

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(mapStateToProps, 'mapStateToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/containers/AtlasLegend.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/containers/AtlasLegend.js');
}();

;

/***/ }),

/***/ "./src/containers/ConfirmModal.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = __webpack_require__("./node_modules/react-redux/es/index.js");

var _actions = __webpack_require__("./src/store/actions.js");

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ConfirmModalContainer = function ConfirmModalContainer(props) {
  return _react2.default.createElement(_components.ConfirmModal, props);
};

ConfirmModalContainer.propTypes = {
  name: _propTypes2.default.string.isRequired
};

var mapDispatchToProps = function mapDispatchToProps(dispatch, _ref) {
  var name = _ref.name;
  return {
    onClose: function onClose() {
      return dispatch((0, _actions.modalHide)(name));
    }
  };
};

var _default = (0, _reactRedux.connect)(undefined, mapDispatchToProps)(ConfirmModalContainer);

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(ConfirmModalContainer, 'ConfirmModalContainer', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/containers/ConfirmModal.js');

  __REACT_HOT_LOADER__.register(mapDispatchToProps, 'mapDispatchToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/containers/ConfirmModal.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/containers/ConfirmModal.js');
}();

;

/***/ }),

/***/ "./src/containers/ContentContainer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  display: flex;\n'], ['\n  display: flex;\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  width: ', 'px;\n  flex-grow: 0;\n  flex-shrink: 0;\n'], ['\n  width: ', 'px;\n  flex-grow: 0;\n  flex-shrink: 0;\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  max-width: 60%;\n  margin: auto;\n  padding-top: ', 'px;\n  padding-left: 30px;\n  padding-right: 15px;\n  @media (max-width: 1500px){\n    max-width: 70%;\n  }\n  @media (max-width: 1100px){\n    max-width: 80%;\n  }\n'], ['\n  max-width: 60%;\n  margin: auto;\n  padding-top: ', 'px;\n  padding-left: 30px;\n  padding-right: 15px;\n  @media (max-width: 1500px){\n    max-width: 70%;\n  }\n  @media (max-width: 1100px){\n    max-width: 80%;\n  }\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _components = __webpack_require__("./src/components/index.js");

var _styles = __webpack_require__("./src/utils/styles.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Holder = _styledComponents2.default.div(_templateObject);

var Placeholder = _styledComponents2.default.div(_templateObject2, _styles.sidebar.width);
var Container = _styledComponents2.default.div(_templateObject3, function (_ref) {
  var noTopPadding = _ref.noTopPadding;
  return noTopPadding ? 0 : 50;
});
var ContentContainer = function ContentContainer(_ref2) {
  var children = _ref2.children,
      props = _objectWithoutProperties(_ref2, ['children']);

  return _react2.default.createElement(
    Holder,
    props,
    _react2.default.createElement(
      Container,
      null,
      _react2.default.createElement(
        _components.Content,
        null,
        children
      )
    ),
    _react2.default.createElement(Placeholder, null)
  );
};

ContentContainer.propTypes = {
  children: _propTypes2.default.node
};

ContentContainer.defaultProps = {
  verticalAlign: false
};

var _default = ContentContainer;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Holder, 'Holder', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/containers/ContentContainer.js');

  __REACT_HOT_LOADER__.register(Placeholder, 'Placeholder', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/containers/ContentContainer.js');

  __REACT_HOT_LOADER__.register(Container, 'Container', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/containers/ContentContainer.js');

  __REACT_HOT_LOADER__.register(ContentContainer, 'ContentContainer', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/containers/ContentContainer.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/containers/ContentContainer.js');
}();

;

/***/ }),

/***/ "./src/containers/Generic.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = __webpack_require__("./node_modules/react-redux/es/index.js");

var _selectors = __webpack_require__("./src/store/selectors.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GenericContainer = function GenericContainer(_ref) {
  var loading = _ref.loading;
  return _react2.default.createElement('div', { className: loading ? 'loading' : '' });
};

GenericContainer.propTypes = {
  loading: _propTypes2.default.bool
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    loading: _selectors.fromStatus.isLoading(state)
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps)(GenericContainer);

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(GenericContainer, 'GenericContainer', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/containers/Generic.js');

  __REACT_HOT_LOADER__.register(mapStateToProps, 'mapStateToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/containers/Generic.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/containers/Generic.js');
}();

;

/***/ }),

/***/ "./src/containers/Modal.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = __webpack_require__("./node_modules/react-redux/es/index.js");

var _selectors = __webpack_require__("./src/store/selectors.js");

var _actions = __webpack_require__("./src/store/actions.js");

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ModalContainer = function ModalContainer(props) {
  return _react2.default.createElement(_components.Modal, props);
};

ModalContainer.propTypes = {
  name: _propTypes2.default.string.isRequired,
  isOpen: _propTypes2.default.bool
};

var mapStateToProps = function mapStateToProps(state, _ref) {
  var name = _ref.name,
      isOpen = _ref.isOpen;
  return {
    isOpen: isOpen || _selectors.fromModal.isOpen(state, name)
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch, _ref2) {
  var name = _ref2.name;
  return {
    onClose: function onClose() {
      return dispatch((0, _actions.modalHide)(name));
    }
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ModalContainer);

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(ModalContainer, 'ModalContainer', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/containers/Modal.js');

  __REACT_HOT_LOADER__.register(mapStateToProps, 'mapStateToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/containers/Modal.js');

  __REACT_HOT_LOADER__.register(mapDispatchToProps, 'mapDispatchToProps', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/containers/Modal.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/containers/Modal.js');
}();

;

/***/ }),

/***/ "./src/containers/Sidebar.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  padding: 0 15px;\n  margin-bottom: 50px;\n  overflow-y: auto;\n  position: absolute;\n  top: 25px;\n  left:0;\n  right:0;\n  bottom:0;\n'], ['\n  padding: 0 15px;\n  margin-bottom: 50px;\n  overflow-y: auto;\n  position: absolute;\n  top: 25px;\n  left:0;\n  right:0;\n  bottom:0;\n']);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var SidebarContainer = _styledComponents2.default.div(_templateObject);

var _default = SidebarContainer;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(SidebarContainer, 'SidebarContainer', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/containers/Sidebar.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/containers/Sidebar.js');
}();

;

/***/ }),

/***/ "./src/containers/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://github.com/diegohaz/arc/wiki/Containers
var req = __webpack_require__("./src/containers ^((?!index).)*\\.js$");

req.keys().forEach(function (key) {
  var containerName = key.replace(/^\.\/([^.]+)\.js$/, '$1');
  module.exports[containerName] = req(key).default;
});
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(req, 'req', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/containers/index.js');
}();

;

/***/ }),

/***/ "./src/images/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Watermark = undefined;

var _minilogo = __webpack_require__("./src/images/minilogo.png");

var _minilogo2 = _interopRequireDefault(_minilogo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Watermark = _minilogo2.default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }
}();

;

/***/ }),

/***/ "./src/images/minilogo.png":
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABACAYAAABY1SR7AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH4QkVDQwGNhXeMQAAG69JREFUaN7NeneYFUXW/lvdfeOkO5dJxG7oyXmGzDAEV5KIIoqKKKJiljWsKIY1fbpiwkXBtKsoZnAVEVlcBCVKGmaYnJrpngAzTLxhbr5dvz9+NfuM+4D66bf7bP3V93ZX1TlV7znnPacK+C9psihBFqUHf21/7j8p6M+8EwA88F+nyITCsQCAsXn56bIoXapo6nkVYu+m47+tLbp0IQBg0rjxaZmpae/IokRlUdoqixJ3PmVkUaqXRenJXzsn/+9QxGw0TrBFR68NBAJzquvrrrHbbLcA8AB4x26zZQFw9zr6GgcpMROAD0Bpr6Ov5j8Krdm/u/CfzytW3EDysrIj8rNzFqXJyYrL5dpnsVi+vnHFTYvZJ/cBiGYLRwB8xXbpJVmUkgD8XtHURwAc+rXykN+6+nmZWZd4fd67KUURz/P7eJ5/rrK2Zk9mato8i9USGfAHRlTW1qyVRekUgAOKpi6TRSkOwCQA1wO4gg31PwCeVDQ1/G/bkWVLr/3n89JrlgrZ6RnJ2ekZj6XJyaf7PZ6XDUbTvrlz58bVNjbM5nm+r3jylHHBYHCIz+tbSIGTedk5d1JKLwFwnSxKsxRN7QKwH8BHANoA3ARgEQCfLErrZVEa/W/dkZzMrPt8Xu/DRqNxn8FgeC0YDJavXLmy87a77qQAkCYnb+Y4zpg4NOny9tNnrqCUvl2nNEYWT55SvP+HQ/vHjBIXEEK2AVgMIANAPYAMRVOfYLaSAOA2AH8E8JGiqdfLokQUTaW/WZGCnFxYo6OF7o6OQ7quC8mpKRft2LmzHQBmTC3G9wf2IycjMzkQCHxJCKmqbWy4EgCy0zOKvF7vAWm0FBdri3VqmjbM7/eP7+/vvxLAaEVTx8uiZARQp2jq6JyMTGK2WOKOnSjplEVpKIAtzAHMVTQ19Jugdcn8i1FaUQ5Hd/djgiAcqz+lFLY2tyxLHSN/BwDfH9iP8YVjU/x+f2VkZOTdA0oAwEhxZAUAdLR3DG9oaNjocrle8Xq9zyqaeiWAeFmUFiiaGgDQLotSocVq4dwu1ycsrpxRNHUqABXA+z8VTH9SkYGO277ejgkFY5ODweDV08dPugsAKKVFlNIZv5s+I258QWFKf7/70cTEpKSSk2XfsgCYnJGS+lprc+tUg8FQHgqHc0HI3wAMNxqNz7Ip5gL4hMWVGwDcdLSkJGwymdZkpaffO0iUVQAiANh+jh1w51JC0VTIomSRRel7p8u5xma3X7Hh/Y0UACpqqi/lef7V9vb2B/IKClqr6+quFyWxDwDmzZptczqdDYFAYEUgELjcZDK9THW94GRlxRe1jQ3jLFbrxrzsbF7R1FoGnQfZcxIAlFVW7DIIhjFMjskAugF8AOBWZj/kFyvClOAAfCcIwtU8z3uOHDtaDgC5mVnXZaSkGo0m48ZQKHTDX99523vhzAtk25AYfsa0qYbGxsZDgiBsSkpKGmm2WNa89taG9zmOSxsY2+Vyfeb3+3fkZGTOt9vtTwMoYnN9JYvSbQAwbPjwP8qiNI7FlD4AnwO4EsBTAD48385w5yF2JQAeMhgM/bzAHx/40+v1bhoxYsSY8qqqUl3XzcVTimIcfX2pe3fvva7rbPc4nue9NQ311x88crjDaDD0//7OexZzHBdkxn8jKC0QeKEkGAyuc7vd91BKf2AyvM88FXZ8s7MPwCk25R8ARAJIYbszXxal9QO87ZyKDILUSwD+DGBvVFRUiCP/XxAAMBgM93V2ds4GAJPJ9GZPd3eBLTZ2V0VN9bvhcPivBoNhCQCMH1uY5fV6L/D096dS0CAAhMPhq+uUxjGVtTUPm83mi5KGDl1NCBnHUBAG0CuLUhTzZAcBfMcUlAH0A+gCsBLATFmUnj+vIkyJMQCSFE19D8Cuzs7OR4OhYPbAN5TSaLfbvQ4A7Hb767quF+zaszuUn52zMBQK9VfUVNcDgMftudXv979vMpmOE5CuqZMmmwwGw+4xo8SJsigdKqusqG/WtAwAOQCoLEomAKmKproAPAJAUzT1AuZ2pzClTgJYBiAbwGJZlIoGo4gblNQYAewFsFwWJR6AAmCl3+efP2/W7CQAiIuLeyY2NjaXwewUz/PpAODxeNaMHjNmYW5W9tw5F84aFQwGLyOEHCmtKP87pdTjdDpv0XX9G0LIOgB2WZS6AfwA4D22G98A+FQWpXQANwwdOnTloMV+GMCTDO4XADABmAjg3UEpALgBSAG422QyzVI0NRgVHTUuIyfjbkqp22AwnGhUlH1LFy827P/hUOhY6YmK6UVTQSmloVBoeGZa2v2CIJT9Y/e3p/1e73ONDQ0apdQWFxe3KCst/U2DwXDE7/c/YbVaTwEYpmhqOlvdzQC2yqJ0BsAwttqvEEJWO53O9WyBb2W7U6doqgNAJYDxiqaeBfA/sih98KPILouSieO43YSQZF7gqwP+wEyj0fie3+/vt1gs7wYCgcOE484OS0oaV1tb25aQlAgCQnw+38ZQKLTUbDZPoaCdhJDHLWbL1yaT6Vun05kRCAQ28zy/URCEPrfbfYYQkqBo6rq5F84aVl9f7ySEuAAcBlDMMsRWRVPjFi24JK7kxAkqCMJRRVPlCYVjLxIE4VBHR8cCACMAfA0gGcBlAFYpmto+YCPfAljJcdwWqlO32Wy+k+O4bwghJz0ejz0xKSmF6npkS2tra2RU1BGf11fi8XjadF2/luM4VyAQ+DAYCB7mCLfzeFnpZ4SQqIDf//GQIUOuDofDS8qrq9YSQpbxPP9WVlr6i11dXSMJIccBtCmaOpnZwn0sZuDzr7Z1CYLwJIDJABAIBPx9fX3P67r+KbOZZQD+xuC2cABaowHUNTSdKq1tbFhZ29hwSUJiwqZYu71a1/Vqi8WS3tXZuaWh6VSUxWJ50mAwxOq6PoLn+WabzZadlJSUSwjheUGottnt2/KysvPa29sVk8XyaldX126e558YM0q0A8gVRdFmtli29PT0WJgNPs7sEQCeMhgN30wcN94ui9INhJA/mUzmwLjCAqGssmK3xWr9pqmlOQBgKIDdAIIAChnJhMAM56W5F84a4vF4ent7ey9tbWl9xWw2t4VCoQU+n2+y1Wrdk5WWPtTr9XoUTU0dwGV6cspb/f39SfWnFJm5tTd1XZ8bExNzs9PpfNFoNL5RVVf7oSxKVQCcu77bcwbAGVmU9gG4DsBsAPmyKM0HoHKEm93d3f2yoqnpORmZI71ebwvpxw0APjMZTcfnzZ6dWF9Xf5wxgREAXgCwXRalCzkAk/w+X1NnV9cCEEILCwu3E0LaKKVvCYJAAcQbjcZvfD7ffgBXM++Gwty8NWaL5avq+rpL8nNypmWmpu3jOM5stliedzgc7woGw7s9PT2rZVHaCsAM4PQg6jGc/d4P4DjzSrPnzZv3EM9xfFZa+uiIiIgeg8GwyWg00szUtE99Pq8hJiamh0HqDwxeOwBsArBIADB6SHzc9EAg0FdSVkrbWlsTOI5bXllbU8syuRiHw2EDsAHAW4IgBADgRPnJ1QBw+cLLIlpamo1+nz9IKb0sFAqGIiIjEvrd/ROsVutZAFsBZAJ4UxalTQDmA7hT0dQggNoxo8RiQgi36qGHtDc3bBgTGRl5k9/vH5WYkNjscDhivF7vM8FgMA3AiU+2bHkOwC5ZlLIAPK1oqpktTpYAIIbqtCAUDBazSf+i6/psWZSiWMFAZqWayQDEOqWxOiMl9S/hcPiaoUOHjvjb1i96s9LSm1NSU1c4+vocY0aO6dv3w75nAMwAcKWiqTvZZE8BOAKgTNHUTxg0vbGxsdN+OHb02J9ffLHOYrVe3N/fX2U2m5e0nW47Hg6HRxJCjk0pLh4vjhjh9X/8cdyAcTPnMNDCHABDXl7eWqvV+vigF48yj/BHAL8D8DITolIWpeqIqKhnOY7T9x480HvXnXeRUCj0cnVVVW1ra2t3SUXJzV6P92EAUxRN3cmCLQGwWNHUeBAya9A8Oyml0QCg67oc8PuvGVswticYDBYfLyvtt1qtMwVBuP79D953ffzxx5cBeJbR+lJGJgeahbfbbFdomvZZdX2dJovS3QAOKZr6ht1muxTAUpalPcDg8TmAK4KBgCMcDk9PjE+I2rHz77uSEhL6eJ6vI4RU8oT/CgTrKaUHRo0YmRMXH+8AwYSAP/Cw3Wb7QNFUX9HESeNa2lpPxw+JM7rd7i2pySkfU4AKAv/3jrOdYjgcThNHjGwvrShvGzFsWPasWRc6WppbJABfK5q63W6z3ZM0bNhf4+z2FbHRMafD4fBiDoDCcVw60+zpYDC4NTs9Y419iH2ZoqkGFrBEAGcVTX0cwB26rheaLKa3CSEtsihd5/P5vvb7/XvrlMZ7PF7PEgBXEEIeBJDR29PzoUEw9DBG+wIA6JTOGF9YIOTk53/K83wVCKTyqsp7DYKhrd/t2p0QH7/B6XR+Pi6/INLr8+WdalRSmZFXy6LUQQhZ29vdvUEQhNRAILAMwBEOwMcAdsii9CWACq2t1e/z+R50u9wDZZoIAGcA3CWL0oWKpr5OKdWramrvCAQCRgDvAKg+R90272RV5dsA6LHSE1UAngBwizRiZIzL6eykOuZu3rI5IAhCz+Fjx74FgGOlJxSz2fxhR0dHjNFo/MThcFTp4fCzHMdpLG4AwMlGtekvFy1adI3H7d4GYDWAv3JsxUsBzKeUrpwz83f80OHDpgDoZR3rAbgB1AAQZVGazhS3UkqXKZpqUDQ1i+UNUDT1IUVTCYADAJCcmryE/X8CwBae55dX1ta8d7ysdHtuZtb0GFvMLSxfGV6Yl2flBf7BiMjIjKq62lUcx5VyHLcnKSnJCeBiVvv6GABeXPOs7vP7hwCoVTS1SlA0VQcwTxaluIjIyDvOdnWKgUDgCV3Xk1lGdgLAPABjmff6k6KpRcyVbpBFqQ5AM4CvWbY3E0ALgFxZlIq3bvtqP6PpqwHcAUADsA4ADEZDHA3TfV9s+UxYtWrVKb/ff5rn+SYCsg4A6pTGhWPzC4Y3NzdPUjR1jyxKQQApsijZADgYGnIAgMvJyFyUlZ6xQBo92jt8+PD1ZZUVnxcVFU0wm803sx0pA/AQgOcBfAlgLnPNVwFYwYhnrqKpa5n7/hZAHUuO9rFJL2HQCgLYJovSagAIh8Kjfjh+lDocDlBKjbquS6FQKJ/n+b0AkJORuSEUDF4cCocHykGbAKSyBdkM4DEA42RRmkIyU9OeI4TYqupqb5VFaRvLEzJYHEhiggoMaimKpnbLojQHwN+ZL9/AvkkD8DRz0/UARjHjngNgDYtJbgaRElts7O89/f0jaxrqP2JCr6GgUVSnuT6frwTA5/EJCe093d11SUlJMW1tbZez8V8G8AzLTZoY5KtJZmpalsViGdvd3X2I5/m3BuUMGIjsrJz5LGOnKqvXhhVNzWPfSQCOhsPhOU0tzScJIbosSncASGCO4k8AEgF0KpoaK4vS6yaTyR0KhQ7ExMTYPB5vbVVdzZGiiZPjuru73gsGg3EARnZ3dY3Ky8+39zn6jG6XuwLANQBeBxBgC+JmFMfIEULGulyulymlHSz4rWXCLQZQoWiqomjqCwBeYkXnR1gukCKL0gpZlB4F0ACgdviI4eY0Ofkwg8EwBjEzgGpG1bsY2+3UdT2G5/nJkVGRuwiB/Pprr6G7u2uN0Wh8T9HUiQD+NiQublhra6vR7XKfArCewbWVVVWeUDT1tKKpwwBs5OxD7DujoqIu1dpaXYwJJzJB4gHYWNkfiqY+yCA2kgm3CcBfmCdZC4KZBw8f/iE+MXE16389U347gFRZlG5iKxgFICciImJ7MBi8v6enJ2fCxIlfr1v78gu6ri8pr67azPrvYrWvDwBcrmjqHxVNdQL4niViY2VRSpdFKQdACinMzVvV3tn1osVoGAngoKKpI6dNKRL2HToYkkWpA0ARAMoYajKAGYqm+tiuRbPBwfKaREppOiHkRjaZBuBqZndgufkcRlc+S09OKQkGg4UDtQ2z2XytNSLi+CWXXtr47jvvvABgmaKp8VMmTLTolI45fOxolSxKMrPDexhkYwBMIvk5uctsMTGftrS07I6Ojl5IOK7YIAjxJpNpS1tb2+MsrfwHK8fEMchMAJCmaOrzxVOK7D6fb1RXZ2c3x3HxrDgQ4HmeC4fD3wOwMkH7WOlznaKp9wBAQV6uJRQIXa7r+kSe598pr64qTZZGU4vVurSiuuojWZQ6FU2Nz8nIfM3n893e0HRqIDX/AkAtc+krFU1dL5RVlG9i3uqx0oryruz0jEfcLtewkaK4mRFHAxNkM6MZ1zJXPBMAXE7nLYFA4LqmluYsFj8G2lUAIlJGj8lpaDqlAnABQH52ztCJ48YnupzOP3CUvFpRU/0BgA/ysrLnAyiNiIhYQggZOJbbLIvSjIqa6juy0tKtORmZV/I8/4XL5Spj7nwDgxo4WZQmAHhN0dQ9AGC1WpcaDIaU3d/t6WPGehrAOAA3A3gRwPOU0rnLly8/tH3rl5woSa9X1dVmDeYm8Xa7wIrTaGg65WW7+cDr69Zzbrf72+6urka/37/K6/c/yKL6ZW63e/vY/Hz5ZFXlJ4LBECzMzZtEKX0DwDQACIZC1OPxfGqNsCawAmIbgOcA5A/UtS6wWCxVkyZMHPbBOxvR3d19U1VdbT+TyQ/gWkVTS1hkh8FofNFoNF60adMm73333fduRXn5+GRp9B5ZlD6XRenPsihp0shR0QxiYHAyAnjs9rvv0k0m0/Mmk2lTbGxsQYTFsmFm8TR89NFHW00m0+MCLxgAgOq6zel0/qBoaiWAUdkZmahrbLghIiJiUU93j4WVhjYz+7UPKJIUGxtrcTocax9/8skbAKySRWkgqo8H8AdZlD4DcIhSeq/ZZHLpur4gKirqYqPRWEYI2cU83EUA7gawrSArp5cV+2YwP/8AgE8BIDIysj0+IeGZBQsvrQvr+oqenh5DbmEBra6ve8rhdF6/5Mqr4kpOlu01mUxbxxcUSgAavR6PgRCC/v5+SzAYbGDpxnaWMvsBgLfbbGOcTqev/pTyot1m28boyBt2m62PPW9neH/1VLP2lNlo6uJ5Prq/v39HKBSKJoS8wYLlbQCuUDT1lZKKcgBoZ5RlLYvAhXffevv3anPzVJ3So6UlJRvDengx4cgLCXHxC9NSUtwet/vKPoejsiAvT+/r6/tWEIShXq/XQAjp6nX0Oe0220bmjm9nm3AQgKvX0dfAAdhKCPmMFa+jFE19nRCyhOEwAcDzHMflK5p6vyxKGTzPV4TD4Vs5jttBCJnEXOsxXdfzFE3dASCPMYFaAB2MpjQDeG/Pvr0v+f3+7UeOHfWZTKZNJqNpbHlVVTAYDM49c+ZMcygcvioxISFYX1/frut6PSFkCKW0bFA26GCBMYEV5/oGHAynaOppVpG4D8CGtOSULwRBuFfX9TEA/hQOh/2RkZEz2EC3MwKYxHL5mwBouq4vbGppfpR9cxlLgvLYxPcDWJyTkZlCQWuibbZIAAgGgyOio6O7AEAQhADHcV6j0XhPd3e3hxXljADQ1NJcASBZFqUNAL5giyKw7HULKy/9s/a7A0CyoqmPms3m9ZTShKaW5iYAKsdx0RarZd9AKYsZ7iMAZrEc5IGmluYxbGATgNFslb5kkX0/gK3hcPjquCFx3/f19KwvnlIU7/F41nd0dLySm5n1RCgU6uB5vqm6vm6druvNZrN5s9Fo3BoMBgdY7wWM8b7Kft/CmPcpRVM7FU0Fx44ToGiqAgC22NiKUCgkZaam3U8p9RBC8g4dOVLKBpjFVrtF0dTvADygaOpGZtSnWcC0sBijsGB6EgAEg+F0X18f4QWh7WxHR7w1wvoEpdTqdrsft1gsn3Mc10opxdyLLjJW1dVeRSl9JiIyws3oUSlj5PewtHsiI5ALfnQ+MvgEaO/+fWejY6JnGgyGHYQQBcAaWZQyWS2pDcDLiqauy8/JmRUVFf0JIURgHGo7G8/KlOhmQwaYS40pq6yo4jlutclkGmYxWzaNmzjpmsTExHmlFeVVAOrnz5035MsvvvjHrAtnGQSDYUnAH+gpzM2bkZ2ecRs7azzAFicdgKRoquNH5yODW1J8PErLy78/WVVZzVhtEEA5K+k/pWjqfbetuNnqcrr+4ff7bqOUgsHJxYzbzlh0NRtyDAD4/f5R06YUpZVVVnRTSqc6HI5AydEj15w9e/aryeMnDOc4rkxtalpcVVdbFPB6Rwb8/nu9Xm93MBjcV1lb8wZjH5uZPU9TNFUbdCTy8xcGZFHKBHAFpXRzREREZDgcfjA6Jno1dGqOjbF17Pxut5dSWsO81GxGMMEi8jLGlK8ryMktcLvdJ3iefz0cDi82GI2yxWxOcTgcxxuaTpFpU4ri2tvbOzmO2x8Oh4t5nt+VlZk192T5SYHlPzUMYhiswC+++TC4U/GUoqn7Dx08wHYyF8CdzOi8zDYAQGfjEgAhAFnjCwttVKejQuFwr9vl+orn+QOTp06dU1ZSku5yuSqNRuMjEdaINR6vZ63f77/NbDa/XVVXu/I/cbcskRn4uAGKwLjV04wZX8QO++NuWX5jQkFO7rSBjrctv9E66EySy83Iun3KxEmpv1WgX3KpxsiSqTnMK+nn+U4HEB7ElsPsfhb9mXkG7+DgC3GnGM1pY2P9JiV5AHexwxXhP3yj0MzOQO7+vxjssZ9SYNnSpRyl9JyrnZ2eMZAEkV9yKQYAJo+fcK6/hzBb/NXQWs4I2o+uGE2dPBkL5i/g39v03vsAvBzHmQkhe41Go+Tz+a43m837g8Fgdm9v7yyj0VjFqpgBACLHcTOjo6NXejyeFRaLZa+u6xFWq3VtX1/fJzab7bVDR488cR5ZchmLOPRrYHXV+V6mycmf5GfnLB90NTY/WRqdkpWWvh0AphcXZ7Pd0FmJFbIo3SqLklo0adLoZGn0KQC4YNr00Wy8Nlbb+imZFv+a+1qEEb5zd+K4GWWVFe8O/D56oqRMEARTKBSaWZCTezAcCo/8F6wPFB5s7Wfaowkhowty83ae7ehYORgZFTXVPyWr/9coQlkV/pwtHA4rBbm5S3/UgVLC8/zB0oryIp7nqv/FKwHAVAAH7HZ7kFKqlpafnGsfMmQDABDyi24kCr/mJR247PWvbVx+ASiltzgcjoP52TnxRqOxgVLqCQQCPp/PFzd5/IRil9P1IKsE9gJIk0XJDGCWoqkXx8XFTec4jp86eco8t9udnGgf8irP8/rPKBH5r7b6vzH2CJYhPnqul/PnzDU1NTWJhBDdZrM1BYPBGJ/PZ9V13cDzvK+3t7fTYDBEsriiK5raDQBTJk6K9fv9Vr/PZ6CUBiYXFTkPHzr0aWVtzfyfkOUldpL7q5vEEqmIf1ewyEpNe7JowqTE87xOYN6T/y3ud/DOXMnK+R3n2WLfT0T8c8HWMsg+zxXZzSx+7GbU3fdzg/4/3xkVUC6DxbIAAAAASUVORK5CYII="

/***/ }),

/***/ "./src/img/logocedej.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "552db2462d740029604f8a833cf8a78d.png";

/***/ }),

/***/ "./src/img/logocnrs.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "23cc18ab640fc7fb6ad52091f2990713.png";

/***/ }),

/***/ "./src/img/logoephe.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "a4a26fd02d902dd67bfd8c7fb5a88b0a.png";

/***/ }),

/***/ "./src/img/logomae.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "5b1e0f53bfeeaee77d4c0bc8d601fd18.png";

/***/ }),

/***/ "./src/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__("./node_modules/babel-polyfill/lib/index.js");

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__("./node_modules/react-dom/index.js");

var _reactRedux = __webpack_require__("./node_modules/react-redux/es/index.js");

var _reactRouterDom = __webpack_require__("./node_modules/react-router-dom/es/index.js");

var _config = __webpack_require__("./src/config.js");

var _configure = __webpack_require__("./src/store/configure.js");

var _configure2 = _interopRequireDefault(_configure);

var _api = __webpack_require__("./src/services/api/index.js");

var _api2 = _interopRequireDefault(_api);

var _App = __webpack_require__("./src/components/App.js");

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = (0, _configure2.default)({}, { api: _api2.default.create() });

var renderApp = function renderApp() {
  return _react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(
      _reactRouterDom.BrowserRouter,
      { basename: _config.basename },
      _react2.default.createElement(_App2.default, null)
    )
  );
};

var root = document.getElementById('app');
(0, _reactDom.render)(renderApp(), root);
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(store, 'store', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/index.js');

  __REACT_HOT_LOADER__.register(renderApp, 'renderApp', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/index.js');

  __REACT_HOT_LOADER__.register(root, 'root', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/index.js');
}();

;

/***/ }),

/***/ "./src/services/api/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseEndpoint = exports.parseSettings = exports.parseJSON = exports.checkStatus = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

__webpack_require__("./node_modules/whatwg-fetch/fetch.js");

var _queryString = __webpack_require__("./node_modules/query-string/index.js");

var _lodash = __webpack_require__("./node_modules/lodash.merge/index.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _config = __webpack_require__("./src/config.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } // https://github.com/diegohaz/arc/wiki/API-service


var checkStatus = exports.checkStatus = function checkStatus(response) {
  if (response.ok) {
    return response;
  }
  var error = new Error(response.status + ' ' + response.statusText);
  error.response = response;
  throw error;
};

var parseJSON = exports.parseJSON = function parseJSON(response) {
  return response.json();
};

var parseSettings = function parseSettings() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _ref$method = _ref.method,
      method = _ref$method === undefined ? 'get' : _ref$method,
      data = _ref.data,
      locale = _ref.locale,
      otherSettings = _objectWithoutProperties(_ref, ['method', 'data', 'locale']);

  var headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Accept-Language': locale
  };
  var settings = _extends({
    body: data ? JSON.stringify(data) : undefined,
    method: method,
    headers: headers
  }, otherSettings);
  return settings;
};

exports.parseSettings = parseSettings;
var parseEndpoint = exports.parseEndpoint = function parseEndpoint(endpoint, params) {
  var url = endpoint.indexOf('http') === 0 ? endpoint : _config.apiUrl + endpoint;
  var querystring = params ? '?' + (0, _queryString.stringify)(params) : '';
  return '' + url + querystring;
};

var api = {};

api.request = function (endpoint) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var params = _ref2.params,
      settings = _objectWithoutProperties(_ref2, ['params']);

  return fetch(parseEndpoint(endpoint, params), parseSettings(settings)).then(checkStatus).then(parseJSON);
};

['delete', 'get'].forEach(function (method) {
  api[method] = function (endpoint, settings) {
    return api.request(endpoint, _extends({ method: method }, settings));
  };
});

['post', 'put', 'patch'].forEach(function (method) {
  api[method] = function (endpoint, data, settings) {
    return api.request(endpoint, _extends({ method: method, data: data }, settings));
  };
});

api.getMapData = function () {
  return api.get('/data/compiled.json');
};

api.create = function () {
  var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    settings: settings,

    setToken: function setToken(token) {
      this.settings.headers = _extends({}, this.settings.headers, {
        Authorization: 'Bearer ' + token
      });
    },
    unsetToken: function unsetToken() {
      this.settings.headers = _extends({}, this.settings.headers, {
        Authorization: undefined
      });
    },
    request: function request(endpoint, settings) {
      return api.request(endpoint, (0, _lodash2.default)({}, this.settings, settings));
    },
    post: function post(endpoint, data, settings) {
      return this.request(endpoint, _extends({ method: 'post', data: data }, settings));
    },
    get: function get(endpoint, settings) {
      return this.request(endpoint, _extends({ method: 'get' }, settings));
    },
    put: function put(endpoint, data, settings) {
      return this.request(endpoint, _extends({ method: 'put', data: data }, settings));
    },
    patch: function patch(endpoint, data, settings) {
      return this.request(endpoint, _extends({ method: 'patch', data: data }, settings));
    },
    delete: function _delete(endpoint, settings) {
      return this.request(endpoint, _extends({ method: 'delete' }, settings));
    }
  };
};

var _default = api;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(checkStatus, 'checkStatus', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/api/index.js');

  __REACT_HOT_LOADER__.register(parseJSON, 'parseJSON', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/api/index.js');

  __REACT_HOT_LOADER__.register(parseSettings, 'parseSettings', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/api/index.js');

  __REACT_HOT_LOADER__.register(parseEndpoint, 'parseEndpoint', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/api/index.js');

  __REACT_HOT_LOADER__.register(api, 'api', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/api/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/api/index.js');
}();

;

/***/ }),

/***/ "./src/services/carto/download.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fileSaver = __webpack_require__("./node_modules/file-saver/FileSaver.js");

var _fileSaver2 = _interopRequireDefault(_fileSaver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(_ref) {
  var format = _ref.format,
      blob = _ref.blob;

  return new Promise(function (resolve, reject) {
    try {
      var ts = ('' + new Date().getTime()).substring(5);
      var fn = 'export-' + ts + '.' + format;
      _fileSaver2.default.saveAs(blob, fn);
      resolve(true);
    } catch (e) {
      console.error('error while downloading', e);
      reject(e);
    }
  });
};

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/carto/download.js');
}();

;

/***/ }),

/***/ "./src/services/carto/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _preview = __webpack_require__("./src/services/carto/preview.js");

var _preview2 = _interopRequireDefault(_preview);

var _render = __webpack_require__("./src/services/carto/render/index.js");

var _render2 = _interopRequireDefault(_render);

var _download = __webpack_require__("./src/services/carto/download.js");

var _download2 = _interopRequireDefault(_download);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var carto = {
  render: _render2.default,
  preview: _preview2.default,
  download: _download2.default
};

var _default = carto;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(carto, 'carto', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/carto/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/carto/index.js');
}();

;

/***/ }),

/***/ "./src/services/carto/preview.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _leafletImage = __webpack_require__("./node_modules/leaflet-image/index.js");

var _leafletImage2 = _interopRequireDefault(_leafletImage);

var _formats = __webpack_require__("./src/utils/formats.js");

var _formats2 = _interopRequireDefault(_formats);

var _images = __webpack_require__("./src/images/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var A4px = _formats2.default.A4px;


var mapToImage = function mapToImage(mapRef) {
  return new Promise(function (resolve, reject) {
    (0, _leafletImage2.default)(mapRef, function (err, canvas) {
      if (err) {
        reject(err);
      } else {
        resolve({ canvas: canvas, mapRef: mapRef });
      }
    }, { x: A4px[0], y: A4px[1] });
  });
};

var addScaleToCanvas = function addScaleToCanvas(canvas, mapRef) {
  var scaleHeight = 17;
  var scaleWidth = function scaleWidth(scale) {
    return parseInt(scale.style.width.replace('px', ''), 10);
  };
  var scaleText = function scaleText(scale) {
    return scale.innerText;
  };
  var ctx = canvas.getContext('2d');
  var cw = canvas.width,
      ch = canvas.height;

  var scales = mapRef._controlContainer.querySelectorAll('.leaflet-control-scale-line');
  var kmScale = scales[0];
  var mileScale = scales[1];
  // first we draw the km scale.
  var offy = 100;
  var offx = 10;
  var rectFill = 'rgba(255, 255, 255, 0.5)';
  ctx.beginPath();
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 2;
  ctx.textAlign = 'end';
  var kmw = scaleWidth(kmScale);
  var kmt = scaleText(kmScale);
  ctx.fillStyle = rectFill;
  ctx.fillRect(cw - offx - kmw, ch - offy - scaleHeight, kmw, scaleHeight);

  ctx.moveTo(cw - offx, ch - offy - scaleHeight);
  ctx.lineTo(cw - offx, ch - offy);
  ctx.lineTo(cw - offx - kmw, ch - offy);
  ctx.lineTo(cw - offx - kmw, ch - offy - scaleHeight);
  ctx.stroke();
  ctx.fillStyle = '#000';
  ctx.fillText(kmt, cw - offx - 4, ch - offy - 4, kmw);
  // then the mile scale
  var mw = scaleWidth(mileScale);
  var mt = scaleText(mileScale);

  ctx.fillStyle = rectFill;
  ctx.fillRect(cw - offx - mw, ch - offy, mw, scaleHeight);

  ctx.moveTo(cw - offx, ch - (offy - scaleHeight));
  ctx.lineTo(cw - offx, ch - offy);
  ctx.lineTo(cw - offx - mw, ch - offy);
  ctx.lineTo(cw - offx - mw, ch - (offy - scaleHeight));
  ctx.stroke();

  ctx.fillStyle = '#000';
  ctx.fillText(mt, cw - offx - 4, ch - (offy - 14), mw);
  ctx.closePath();
};

var addWatermarkToCanvas = function addWatermarkToCanvas(canvas) {
  return new Promise(function (resolve) {
    var ctx = canvas.getContext('2d');
    var cw = canvas.width,
        ch = canvas.height;

    var img = new Image();
    var offx = 10;
    var offy = 10;
    img.src = _images.Watermark;
    img.onload = function () {
      var iw = img.width,
          ih = img.height;

      ctx.drawImage(img, cw - offx - iw, ch - offy - ih, iw, ih);
      resolve(canvas);
    };
  });
};

var addMapOverlay = function addMapOverlay(_ref) {
  var canvas = _ref.canvas,
      mapRef = _ref.mapRef;

  return new Promise(function (resolve, reject) {
    try {
      addScaleToCanvas(canvas, mapRef);
      addWatermarkToCanvas(canvas, mapRef).then(function (canvas) {
        resolve({
          canvas: canvas,
          url: canvas.toDataURL('image/png', 1)
        });
      }).catch(reject);
    } catch (e) {
      reject(e);
    }
  });
};

var preview = function preview(mapRef) {
  return mapToImage(mapRef).then(addMapOverlay);
};

var _default = preview;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(A4px, 'A4px', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/carto/preview.js');

  __REACT_HOT_LOADER__.register(mapToImage, 'mapToImage', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/carto/preview.js');

  __REACT_HOT_LOADER__.register(addScaleToCanvas, 'addScaleToCanvas', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/carto/preview.js');

  __REACT_HOT_LOADER__.register(addWatermarkToCanvas, 'addWatermarkToCanvas', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/carto/preview.js');

  __REACT_HOT_LOADER__.register(addMapOverlay, 'addMapOverlay', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/carto/preview.js');

  __REACT_HOT_LOADER__.register(preview, 'preview', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/carto/preview.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/carto/preview.js');
}();

;

/***/ }),

/***/ "./src/services/carto/render/generateDownloadable.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jspdf = __webpack_require__("./node_modules/jspdf/dist/jspdf.debug.js");

var _jspdf2 = _interopRequireDefault(_jspdf);

var _jszip = __webpack_require__("./node_modules/jszip/lib/index.js");

var _jszip2 = _interopRequireDefault(_jszip);

var _formats = __webpack_require__("./src/utils/formats.js");

var _formats2 = _interopRequireDefault(_formats);

__webpack_require__("./src/utils/canvasToBlob.js");

var _rotatePreview = __webpack_require__("./src/services/carto/render/rotatePreview.js");

var _rotatePreview2 = _interopRequireDefault(_rotatePreview);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var generateImagesArchive = function generateImagesArchive(_ref) {
  var mapPreview = _ref.mapPreview,
      legendImage = _ref.legendImage,
      legendMoreInfosImage = _ref.legendMoreInfosImage,
      format = _ref.format,
      data = _objectWithoutProperties(_ref, ['mapPreview', 'legendImage', 'legendMoreInfosImage', 'format']);

  var zip = new _jszip2.default();
  var addImage = function addImage(img, name) {
    return new Promise(function (resolve) {
      img.toBlob(function (blob) {
        zip.file(name + '.' + format, blob);
        resolve();
      });
    });
  };

  return new Promise(function (resolve, reject) {
    Promise.all([addImage(mapPreview.canvas, 'map'), addImage(legendImage, 'legend'), addImage(legendMoreInfosImage, 'legend-infos')]).then(function () {
      zip.generateAsync({ type: 'blob' }).then(function (blob) {
        resolve(_extends({ blob: blob, format: 'zip' }, data));
      }).catch(reject);
    });
  });
};

var generatePDF = function generatePDF(_ref2) {
  var mapPreview = _ref2.mapPreview,
      legendImage = _ref2.legendImage,
      legendMoreInfosImage = _ref2.legendMoreInfosImage,
      data = _objectWithoutProperties(_ref2, ['mapPreview', 'legendImage', 'legendMoreInfosImage']);

  var i = 0;
  var addPage = function addPage(pdf, img) {
    if (i > 0) {
      pdf.addPage();
    }
    var imgData = img.toDataURL('image/png', 0.8);
    pdf.addImage(imgData, 0, 0, (0, _formats.px2mm)(img.width), (0, _formats.px2mm)(img.height));
    i += 1;
  };

  return new Promise(function (resolve, reject) {
    try {
      var pdf = new _jspdf2.default({ unit: 'mm' });
      addPage(pdf, mapPreview.canvas);
      addPage(pdf, legendImage);
      addPage(pdf, legendMoreInfosImage);
      var blob = pdf.output('blob');
      resolve(_extends({ blob: blob }, data));
    } catch (e) {
      reject(e);
    }
  });
};

var generateDownloadable = function generateDownloadable(_ref3) {
  var format = _ref3.format,
      data = _objectWithoutProperties(_ref3, ['format']);

  switch (format) {
    case _formats2.default.PDF:
      return (0, _rotatePreview2.default)(_extends({ format: format }, data)).then(generatePDF);
    case _formats2.default.PNG:
      return generateImagesArchive(_extends({ format: format }, data));
    default:
      return generateImagesArchive(_extends({ format: format }, data));
  }
};

var _default = generateDownloadable;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(generateImagesArchive, 'generateImagesArchive', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/carto/render/generateDownloadable.js');

  __REACT_HOT_LOADER__.register(generatePDF, 'generatePDF', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/carto/render/generateDownloadable.js');

  __REACT_HOT_LOADER__.register(generateDownloadable, 'generateDownloadable', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/carto/render/generateDownloadable.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/carto/render/generateDownloadable.js');
}();

;

/***/ }),

/***/ "./src/services/carto/render/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _renderPrintLegend = __webpack_require__("./src/services/carto/render/renderPrintLegend.js");

var _renderPrintLegend2 = _interopRequireDefault(_renderPrintLegend);

var _generateDownloadable = __webpack_require__("./src/services/carto/render/generateDownloadable.js");

var _generateDownloadable2 = _interopRequireDefault(_generateDownloadable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var render = function render(data) {
  return (0, _renderPrintLegend2.default)(data) // render legend as image
  .then(_generateDownloadable2.default); // generate the downloadable file
};

var _default = render;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(render, 'render', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/carto/render/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/carto/render/index.js');
}();

;

/***/ }),

/***/ "./src/services/carto/render/renderPrintLegend.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__("./node_modules/react-dom/index.js");

var _html2canvas = __webpack_require__("./node_modules/html2canvas/dist/html2canvas.js");

var _html2canvas2 = _interopRequireDefault(_html2canvas);

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

// convert rendered legend to an image with html2canvas.
var convertToImage = function convertToImage(node) {
  return new Promise(function (resolve, reject) {
    var style = window.getComputedStyle(node);
    var h = Math.round(parseFloat(style.getPropertyValue('height').replace('px', '')));
    var w = Math.round(parseFloat(style.getPropertyValue('width').replace('px', '')));
    var size = {
      width: w,
      height: h
    };

    var opts = _extends({}, size, {
      onrendered: function onrendered(canvas) {
        resolve(canvas);
      }
    });
    try {
      (0, _html2canvas2.default)(node, opts);
    } catch (e) {
      reject(e);
    }
  });
};

// render the legen HTML node
var renderHtml = function renderHtml(component) {
  var removeAllChildren = function removeAllChildren(node) {
    node.childNodes.forEach(function (child) {
      return node.removeChild(child);
    });
  };

  return new Promise(function (resolve, reject) {
    try {
      var renderContainer = document.getElementById('render');
      removeAllChildren(renderContainer);
      (0, _reactDom.render)(component, renderContainer, function () {
        var rendered = renderContainer.childNodes[0];
        resolve(rendered);
      });
    } catch (e) {
      reject(e);
    }
  });
};

var renderLegend = function renderLegend(_ref) {
  var layers = _ref.layers,
      filters = _ref.filters,
      circleSizes = _ref.circleSizes,
      data = _objectWithoutProperties(_ref, ['layers', 'filters', 'circleSizes']);

  var props = { layers: layers, filters: filters, print: true, circleSizes: circleSizes };
  var component = _react2.default.createElement(_components.AtlasLegend, props);

  return new Promise(function (resolve) {
    renderHtml(component).then(convertToImage).then(function (canvas) {
      resolve(_extends({ legendImage: canvas }, data));
    });
  });
};

var renderMoreInfos = function renderMoreInfos(data) {
  return new Promise(function (resolve) {
    renderHtml(_react2.default.createElement(_components.LegendMoreInfosPrint, null)).then(convertToImage).then(function (canvas) {
      resolve(_extends({ legendMoreInfosImage: canvas }, data));
    });
  });
};

// allows to render the map's legend & convert it to an image
var renderPrintLegend = function renderPrintLegend(data) {
  return new Promise(function (resolve) {
    var holder = document.querySelector('.render-holder');
    holder.style.overflow = 'visible';

    renderLegend(data).then(renderMoreInfos).then(function (data) {
      holder.style.overflow = 'hidden';
      resolve(data);
    });
  });
};

var _default = renderPrintLegend;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(convertToImage, 'convertToImage', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/carto/render/renderPrintLegend.js');

  __REACT_HOT_LOADER__.register(renderHtml, 'renderHtml', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/carto/render/renderPrintLegend.js');

  __REACT_HOT_LOADER__.register(renderLegend, 'renderLegend', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/carto/render/renderPrintLegend.js');

  __REACT_HOT_LOADER__.register(renderMoreInfos, 'renderMoreInfos', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/carto/render/renderPrintLegend.js');

  __REACT_HOT_LOADER__.register(renderPrintLegend, 'renderPrintLegend', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/carto/render/renderPrintLegend.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/carto/render/renderPrintLegend.js');
}();

;

/***/ }),

/***/ "./src/services/carto/render/rotatePreview.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var rotatePreview = function rotatePreview(_ref) {
  var mapPreview = _ref.mapPreview,
      data = _objectWithoutProperties(_ref, ['mapPreview']);

  return new Promise(function (resolve, reject) {
    try {
      var img = new Image();
      var canvas = document.createElement('canvas');
      img.src = mapPreview.url;
      img.onload = function () {
        var iw = img.width;
        var ih = img.height;
        var cw = ih;
        var ch = iw;

        canvas.width = cw;
        canvas.height = ch;
        var ctx = canvas.getContext('2d');
        // rotation code took from
        // https://jsfiddle.net/AbdiasSoftware/Hq7p2/
        ctx.translate(cw * 0.5, ch * 0.5);
        ctx.rotate(-(Math.PI * 0.5));
        ctx.translate(-(iw * 0.5), -(ih * 0.5));
        ctx.drawImage(img, 0, 0);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        resolve(_extends({ mapPreview: { canvas: canvas } }, data));
      };
    } catch (e) {
      reject(e);
    }
  });
};

var _default = rotatePreview;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(rotatePreview, 'rotatePreview', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/carto/render/rotatePreview.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/services/carto/render/rotatePreview.js');
}();

;

/***/ }),

/***/ "./src/store recursive \\.\\/.+\\/actions\\.js$":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./atlas/actions.js": "./src/store/atlas/actions.js",
	"./circles/actions.js": "./src/store/circles/actions.js",
	"./data/actions.js": "./src/store/data/actions.js",
	"./export/actions.js": "./src/store/export/actions.js",
	"./filters/actions.js": "./src/store/filters/actions.js",
	"./layers/actions.js": "./src/store/layers/actions.js",
	"./legend/actions.js": "./src/store/legend/actions.js",
	"./modal/actions.js": "./src/store/modal/actions.js",
	"./sidebar/actions.js": "./src/store/sidebar/actions.js",
	"./tutorial/actions.js": "./src/store/tutorial/actions.js"
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/store recursive \\.\\/.+\\/actions\\.js$";

/***/ }),

/***/ "./src/store recursive \\.\\/.+\\/middleware\\.js$":
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./src/store recursive \\.\\/.+\\/middleware\\.js$";

/***/ }),

/***/ "./src/store recursive \\.\\/.+\\/reducer\\.js$":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./atlas/reducer.js": "./src/store/atlas/reducer.js",
	"./circles/reducer.js": "./src/store/circles/reducer.js",
	"./data/reducer.js": "./src/store/data/reducer.js",
	"./export/reducer.js": "./src/store/export/reducer.js",
	"./filters/reducer.js": "./src/store/filters/reducer.js",
	"./layers/reducer.js": "./src/store/layers/reducer.js",
	"./legend/reducer.js": "./src/store/legend/reducer.js",
	"./modal/reducer.js": "./src/store/modal/reducer.js",
	"./sidebar/reducer.js": "./src/store/sidebar/reducer.js",
	"./tutorial/reducer.js": "./src/store/tutorial/reducer.js"
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/store recursive \\.\\/.+\\/reducer\\.js$";

/***/ }),

/***/ "./src/store recursive \\.\\/.+\\/sagas\\.js$":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./data/sagas.js": "./src/store/data/sagas.js",
	"./export/sagas.js": "./src/store/export/sagas.js"
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/store recursive \\.\\/.+\\/sagas\\.js$";

/***/ }),

/***/ "./src/store recursive \\.\\/.+\\/selectors\\.js$":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./atlas/selectors.js": "./src/store/atlas/selectors.js",
	"./circles/selectors.js": "./src/store/circles/selectors.js",
	"./data/selectors.js": "./src/store/data/selectors.js",
	"./export/selectors.js": "./src/store/export/selectors.js",
	"./filters/selectors.js": "./src/store/filters/selectors.js",
	"./layers/selectors.js": "./src/store/layers/selectors.js",
	"./legend/selectors.js": "./src/store/legend/selectors.js",
	"./modal/selectors.js": "./src/store/modal/selectors.js",
	"./sidebar/selectors.js": "./src/store/sidebar/selectors.js",
	"./tutorial/selectors.js": "./src/store/tutorial/selectors.js"
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/store recursive \\.\\/.+\\/selectors\\.js$";

/***/ }),

/***/ "./src/store/actions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://github.com/diegohaz/arc/wiki/Actions
var req = __webpack_require__("./src/store recursive \\.\\/.+\\/actions\\.js$");

req.keys().forEach(function (key) {
  var actions = req(key);

  Object.keys(actions).forEach(function (name) {
    module.exports[name] = actions[name];
  });
});
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(req, 'req', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/actions.js');
}();

;

/***/ }),

/***/ "./src/store/atlas/actions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var RENDER = exports.RENDER = 'map/render/start';
var RENDER_SUCCESS = exports.RENDER_SUCCESS = 'map/render/success';
var RENDER_FAIL = exports.RENDER_FAIL = 'map/render/fail';
var MAP_READY = exports.MAP_READY = 'map/ready';

var SHOW_CONTEXTUAL_INFO = exports.SHOW_CONTEXTUAL_INFO = 'map/legend/show_info';
var HIDE_CONTEXTUAL_INFO = exports.HIDE_CONTEXTUAL_INFO = 'map/legend/hide_info';

var ZOOM = exports.ZOOM = 'map/zoom/end';

var zoom = exports.zoom = function zoom() {
  return {
    type: ZOOM
  };
};

var mapReady = exports.mapReady = function mapReady() {
  return { type: MAP_READY };
};

var startRender = exports.startRender = function startRender() {
  return { type: RENDER };
};

var renderSuccess = exports.renderSuccess = function renderSuccess() {
  return { type: RENDER_SUCCESS };
};

var showContextualInfo = exports.showContextualInfo = function showContextualInfo(data) {
  return {
    type: SHOW_CONTEXTUAL_INFO,
    data: data
  };
};

var hideContextualInfo = exports.hideContextualInfo = function hideContextualInfo() {
  return {
    type: HIDE_CONTEXTUAL_INFO
  };
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(RENDER, 'RENDER', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/atlas/actions.js');

  __REACT_HOT_LOADER__.register(RENDER_SUCCESS, 'RENDER_SUCCESS', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/atlas/actions.js');

  __REACT_HOT_LOADER__.register(RENDER_FAIL, 'RENDER_FAIL', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/atlas/actions.js');

  __REACT_HOT_LOADER__.register(MAP_READY, 'MAP_READY', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/atlas/actions.js');

  __REACT_HOT_LOADER__.register(SHOW_CONTEXTUAL_INFO, 'SHOW_CONTEXTUAL_INFO', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/atlas/actions.js');

  __REACT_HOT_LOADER__.register(HIDE_CONTEXTUAL_INFO, 'HIDE_CONTEXTUAL_INFO', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/atlas/actions.js');

  __REACT_HOT_LOADER__.register(ZOOM, 'ZOOM', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/atlas/actions.js');

  __REACT_HOT_LOADER__.register(zoom, 'zoom', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/atlas/actions.js');

  __REACT_HOT_LOADER__.register(mapReady, 'mapReady', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/atlas/actions.js');

  __REACT_HOT_LOADER__.register(startRender, 'startRender', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/atlas/actions.js');

  __REACT_HOT_LOADER__.register(renderSuccess, 'renderSuccess', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/atlas/actions.js');

  __REACT_HOT_LOADER__.register(showContextualInfo, 'showContextualInfo', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/atlas/actions.js');

  __REACT_HOT_LOADER__.register(hideContextualInfo, 'hideContextualInfo', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/atlas/actions.js');
}();

;

/***/ }),

/***/ "./src/store/atlas/reducer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _selectors = __webpack_require__("./src/store/atlas/selectors.js");

var _actions = __webpack_require__("./src/store/atlas/actions.js");

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// const mimeType = (format='pdf')=>{
//   return format === 'png' ? 'image/png': 'application/pdf';
// };

var _default = function _default() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _selectors.initialState;
  var action = arguments[1];

  switch (action.type) {
    case actions.RENDER:
      return _extends({}, state, {
        isRendering: true
      });
    case actions.RENDER_SUCCESS:
      return _extends({}, state, {
        isRendering: false
      });
    case actions.RENDER_FAIL:
      return _extends({}, state, {
        isRendering: false,
        renderingError: action.error
      });

    case actions.SHOW_CONTEXTUAL_INFO:
      return _extends({}, state, {
        isContextualInfoVisible: true,
        contextualInfo: action.data
      });

    case actions.HIDE_CONTEXTUAL_INFO:
      return _extends({}, state, {
        isContextualInfoVisible: false
      });
    default:
      return state;
  }
};

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/atlas/reducer.js');
}();

;

/***/ }),

/***/ "./src/store/atlas/selectors.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var initialState = exports.initialState = {
  isRendering: true,
  isContextualInfoVisible: false,
  contextualInfo: null
};

var contextualInfo = exports.contextualInfo = function contextualInfo(state) {
  return state.contextualInfo;
};
var isContextualInfoVisible = exports.isContextualInfoVisible = function isContextualInfoVisible(state) {
  return state.isContextualInfoVisible;
};
var isRendering = exports.isRendering = function isRendering(state) {
  return state.isRendering;
};
var format = exports.format = function format(state) {
  return state.renderData.format;
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(initialState, "initialState", "/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/atlas/selectors.js");

  __REACT_HOT_LOADER__.register(contextualInfo, "contextualInfo", "/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/atlas/selectors.js");

  __REACT_HOT_LOADER__.register(isContextualInfoVisible, "isContextualInfoVisible", "/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/atlas/selectors.js");

  __REACT_HOT_LOADER__.register(isRendering, "isRendering", "/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/atlas/selectors.js");

  __REACT_HOT_LOADER__.register(format, "format", "/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/atlas/selectors.js");
}();

;

/***/ }),

/***/ "./src/store/circles/actions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var SET_CIRCLE_SIZES_REFS = exports.SET_CIRCLE_SIZES_REFS = 'CIRCLES/SET_REFS';
var ON_ADD = exports.ON_ADD = 'CIRCLES/ON_ADD';

var onAdd = exports.onAdd = function onAdd(refs) {
  return { type: ON_ADD, refs: refs };
};

var setCircleSizesRefs = exports.setCircleSizesRefs = function setCircleSizesRefs(refs) {
  return {
    type: SET_CIRCLE_SIZES_REFS,
    refs: refs
  };
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(SET_CIRCLE_SIZES_REFS, 'SET_CIRCLE_SIZES_REFS', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/circles/actions.js');

  __REACT_HOT_LOADER__.register(ON_ADD, 'ON_ADD', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/circles/actions.js');

  __REACT_HOT_LOADER__.register(onAdd, 'onAdd', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/circles/actions.js');

  __REACT_HOT_LOADER__.register(setCircleSizesRefs, 'setCircleSizesRefs', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/circles/actions.js');
}();

;

/***/ }),

/***/ "./src/store/circles/reducer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _selectors = __webpack_require__("./src/store/circles/selectors.js");

var _actions = __webpack_require__("./src/store/circles/actions.js");

var actions = _interopRequireWildcard(_actions);

var _actions2 = __webpack_require__("./src/store/atlas/actions.js");

var atlasActions = _interopRequireWildcard(_actions2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var getSizes = function getSizes(_ref) {
  var refs = _ref.refs;

  var sizes = {};
  if (!refs) {
    return {};
  }
  Object.keys(refs).forEach(function (key) {
    var leafletElement = refs[key].leafletElement;

    if (key === '01') {
      var parts = leafletElement._parts[0];
      if (parts && parts.length > 1) {
        var radius = (parts[1].x - parts[0].x) / 2;
        sizes[key] = radius;
      }
    } else if (leafletElement._radius) {
      sizes[key] = leafletElement._radius;
    }
  });
  return sizes;
};

var _default = function _default() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _selectors.initialState;
  var action = arguments[1];

  switch (action.type) {
    case actions.SET_CIRCLE_SIZES_REFS:
      return _extends({}, state, {
        refs: action.refs
      });
    case actions.ON_ADD:
      return _extends({}, state, {
        sizes: getSizes(action)
      });
    case atlasActions.ZOOM:
      return _extends({}, state, {
        sizes: getSizes(state)
      });
    default:
      return state;
  }
};

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(getSizes, 'getSizes', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/circles/reducer.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/circles/reducer.js');
}();

;

/***/ }),

/***/ "./src/store/circles/selectors.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var initialState = exports.initialState = {
  refs: {},
  sizes: {}
};

var sizes = exports.sizes = function sizes(state) {
  return state.sizes;
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(initialState, "initialState", "/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/circles/selectors.js");

  __REACT_HOT_LOADER__.register(sizes, "sizes", "/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/circles/selectors.js");
}();

;

/***/ }),

/***/ "./src/store/configure.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = __webpack_require__("./node_modules/redux/es/index.js");

var _reduxSaga = __webpack_require__("./node_modules/redux-saga/es/index.js");

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

var _config = __webpack_require__("./src/config.js");

var _middlewares = __webpack_require__("./src/store/middlewares.js");

var _middlewares2 = _interopRequireDefault(_middlewares);

var _reducer = __webpack_require__("./src/store/reducer.js");

var _reducer2 = _interopRequireDefault(_reducer);

var _sagas = __webpack_require__("./src/store/sagas.js");

var _sagas2 = _interopRequireDefault(_sagas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } // https://github.com/diegohaz/arc/wiki/Redux-modules


var devtools = _config.isDev && _config.isBrowser && window.devToolsExtension ? window.devToolsExtension : function () {
  return function (fn) {
    return fn;
  };
};

var configureStore = function configureStore(initialState) {
  var services = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var sagaMiddleware = (0, _reduxSaga2.default)();

  var enhancers = [_redux.applyMiddleware.apply(undefined, _toConsumableArray(_middlewares2.default).concat([sagaMiddleware])), devtools()];

  var store = (0, _redux.createStore)(_reducer2.default, initialState, _redux.compose.apply(undefined, enhancers));

  sagaMiddleware.run(_sagas2.default, services);

  return store;
};

var _default = configureStore;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(devtools, 'devtools', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/configure.js');

  __REACT_HOT_LOADER__.register(configureStore, 'configureStore', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/configure.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/configure.js');
}();

;

/***/ }),

/***/ "./src/store/data/actions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var DATA_LOAD = exports.DATA_LOAD = 'DATA/LOAD';
var DATA_LOAD_SUCCESS = exports.DATA_LOAD_SUCCESS = 'DATA/LOAD/SUCCESS';
var DATA_LOAD_FAIL = exports.DATA_LOAD_FAIL = 'DATA/LOAD/FAIL';

var loadData = exports.loadData = function loadData() {
  return { type: DATA_LOAD };
};

var loadSuccess = exports.loadSuccess = function loadSuccess(data) {
  return {
    type: DATA_LOAD_SUCCESS,
    data: data
  };
};

var loadFailure = exports.loadFailure = function loadFailure(error) {
  return {
    type: DATA_LOAD_FAIL,
    error: error
  };
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(DATA_LOAD, 'DATA_LOAD', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/data/actions.js');

  __REACT_HOT_LOADER__.register(DATA_LOAD_SUCCESS, 'DATA_LOAD_SUCCESS', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/data/actions.js');

  __REACT_HOT_LOADER__.register(DATA_LOAD_FAIL, 'DATA_LOAD_FAIL', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/data/actions.js');

  __REACT_HOT_LOADER__.register(loadData, 'loadData', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/data/actions.js');

  __REACT_HOT_LOADER__.register(loadSuccess, 'loadSuccess', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/data/actions.js');

  __REACT_HOT_LOADER__.register(loadFailure, 'loadFailure', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/data/actions.js');
}();

;

/***/ }),

/***/ "./src/store/data/reducer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _actions = __webpack_require__("./src/store/data/actions.js");

var actions = _interopRequireWildcard(_actions);

var _selectors = __webpack_require__("./src/store/data/selectors.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var _default = function _default() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _selectors.initialState;
  var action = arguments[1];

  switch (action.type) {
    case actions.DATA_LOAD:
      return _extends({}, state, {
        isLoading: true
      });

    case actions.DATA_LOAD_SUCCESS:
      return _extends({}, state, {
        isLoading: false,
        data: action.data
      });
    case actions.DATA_LOAD_FAIL:
      return _extends({}, state, {
        isLoading: false,
        error: action.error
      });
    default:
      return state;
  }
};

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/data/reducer.js');
}();

;

/***/ }),

/***/ "./src/store/data/sagas.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.loadData = loadData;
exports.watchLoadData = watchLoadData;

var _effects = __webpack_require__("./node_modules/redux-saga/es/effects.js");

var _data = __webpack_require__("./src/utils/data.js");

var _api = __webpack_require__("./src/services/api/index.js");

var _api2 = _interopRequireDefault(_api);

var _actions = __webpack_require__("./src/store/data/actions.js");

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [loadData, watchLoadData].map(regeneratorRuntime.mark);

// import simplify from '@turf/simplify';
// const simplifyPolygon = (feature) => (
//  simplify(feature, 0.001)
// );

function loadData() {
  var _ref, aridity, temperatures, circles, deserts, waterLabels, lakes, rivers, lakesAndRivers, dataToTurfize, data;

  return regeneratorRuntime.wrap(function loadData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return (0, _effects.call)(_api2.default.getMapData);

        case 3:
          _ref = _context.sent;
          aridity = _ref.aridity;
          temperatures = _ref.temperatures;
          circles = _ref.circles;
          deserts = _ref.deserts;
          waterLabels = _ref.waterLabels;
          lakes = _ref.lakes;
          rivers = _ref.rivers;
          lakesAndRivers = {
            lakes: lakes,
            rivers: rivers
          };


          aridity.features = aridity.features.filter(function (a) {
            return a.properties.d_TYPE != null;
          });

          circles.features = circles.features.filter(function (c) {
            return c.properties.size_ != null && c.properties.colours != null;
          });

          temperatures.features = temperatures.features.filter(function (t) {
            return parseInt(t.properties.Temperatur, 10) > 0;
          });

          dataToTurfize = {
            aridity: aridity,
            temperatures: temperatures,
            circles: circles
          };


          Object.keys(dataToTurfize).forEach(function (i) {
            (0, _data.turfizeGeoJSON)(dataToTurfize[i].features);
          });

          data = _extends({}, dataToTurfize, {
            deserts: deserts,
            lakesAndRivers: lakesAndRivers,
            waterLabels: waterLabels
          });
          _context.next = 20;
          return (0, _effects.put)(actions.loadSuccess(data));

        case 20:
          _context.next = 27;
          break;

        case 22:
          _context.prev = 22;
          _context.t0 = _context['catch'](0);

          console.error('Data loading failed', _context.t0);
          _context.next = 27;
          return (0, _effects.put)(actions.loadFailure(_context.t0));

        case 27:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this, [[0, 22]]);
}

function watchLoadData() {
  var data;
  return regeneratorRuntime.wrap(function watchLoadData$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (false) {
            _context2.next = 8;
            break;
          }

          _context2.next = 3;
          return (0, _effects.take)(actions.DATA_LOAD);

        case 3:
          data = _context2.sent;
          _context2.next = 6;
          return (0, _effects.call)(loadData, data);

        case 6:
          _context2.next = 0;
          break;

        case 8:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked[1], this);
}

var _default = regeneratorRuntime.mark(function _default() {
  return regeneratorRuntime.wrap(function _default$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return (0, _effects.fork)(watchLoadData);

        case 2:
        case 'end':
          return _context3.stop();
      }
    }
  }, _default, this);
});

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(loadData, 'loadData', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/data/sagas.js');

  __REACT_HOT_LOADER__.register(watchLoadData, 'watchLoadData', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/data/sagas.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/data/sagas.js');
}();

;

/***/ }),

/***/ "./src/store/data/selectors.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var initialState = exports.initialState = {
  data: null,
  isLoading: false
};

var data = exports.data = function data(state) {
  return state.data;
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(initialState, "initialState", "/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/data/selectors.js");

  __REACT_HOT_LOADER__.register(data, "data", "/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/data/selectors.js");
}();

;

/***/ }),

/***/ "./src/store/export/actions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var CLOSE_MODAL = exports.CLOSE_MODAL = 'EXPORT/MODAL/CLOSE';
var OPEN_MODAL = exports.OPEN_MODAL = 'EXPORT/MODAL/OPEN';
var BIND_MAP_REFERENCE = exports.BIND_MAP_REFERENCE = 'EXPORT/MAP/BIND_REF';
var PREVIEW_EXPORT = exports.PREVIEW_EXPORT = 'EXPORT/PREVIEW/START';
var PREVIEW_DONE = exports.PREVIEW_DONE = 'EXPORT/PREVIEW/DONE';
var PREVIEW_FAIL = exports.PREVIEW_FAIL = 'EXPORT/PREVIEW/FAIL';

var RENDER_DOWNLOADABLE = exports.RENDER_DOWNLOADABLE = 'map/render/downloadable';
var RENDER_DOWNLOADABLE_SUCCESS = exports.RENDER_DOWNLOADABLE_SUCCESS = 'map/render/downloadable/success';
var RENDER_DOWNLOADABLE_FAIL = exports.RENDER_DOWNLOADABLE_FAIL = 'map/render/downloadable/fail';

var DOWNLOAD_MAP = exports.DOWNLOAD_MAP = 'map/download';
var DOWNLOAD_MAP_SUCCESS = exports.DOWNLOAD_MAP_SUCCESS = 'map/download/success';
var DOWNLOAD_MAP_FAIL = exports.DOWNLOAD_MAP_FAIL = 'map/download/fail';

var bindMapReference = exports.bindMapReference = function bindMapReference(mapReference) {
  return {
    type: BIND_MAP_REFERENCE,
    mapReference: mapReference
  };
};

var previewExport = exports.previewExport = function previewExport(mapRef) {
  return {
    type: PREVIEW_EXPORT,
    mapReference: mapRef
  };
};

var previewDone = exports.previewDone = function previewDone(preview) {
  return {
    type: PREVIEW_DONE,
    preview: preview
  };
};

var previewFail = exports.previewFail = function previewFail(error) {
  return {
    type: PREVIEW_FAIL,
    error: error
  };
};

var openExportModal = exports.openExportModal = function openExportModal() {
  return { type: OPEN_MODAL };
};
var closeExportModal = exports.closeExportModal = function closeExportModal() {
  return { type: CLOSE_MODAL };
};

var renderDownloadableMapSuccess = exports.renderDownloadableMapSuccess = function renderDownloadableMapSuccess() {
  return {
    type: RENDER_DOWNLOADABLE_SUCCESS
  };
};

var renderDownloadableMap = exports.renderDownloadableMap = function renderDownloadableMap(data, resolve, reject) {
  return _extends({
    type: RENDER_DOWNLOADABLE
  }, data, {
    resolve: resolve,
    reject: reject
  });
};

var renderDownloadableMapFailure = exports.renderDownloadableMapFailure = function renderDownloadableMapFailure(error, resolve, reject) {
  return {
    type: RENDER_DOWNLOADABLE_FAIL,
    error: error,
    resolve: resolve,
    reject: reject
  };
};

var downloadMap = exports.downloadMap = function downloadMap(data, resolve, reject) {
  return _extends({
    type: DOWNLOAD_MAP
  }, data, {
    resolve: resolve,
    reject: reject
  });
};

var mapDownloadSuccess = exports.mapDownloadSuccess = function mapDownloadSuccess(data) {
  return _extends({
    type: DOWNLOAD_MAP_SUCCESS
  }, data);
};

var mapDownloadFailure = exports.mapDownloadFailure = function mapDownloadFailure(error) {
  return {
    type: DOWNLOAD_MAP_FAIL, error: error
  };
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(CLOSE_MODAL, 'CLOSE_MODAL', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/actions.js');

  __REACT_HOT_LOADER__.register(OPEN_MODAL, 'OPEN_MODAL', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/actions.js');

  __REACT_HOT_LOADER__.register(BIND_MAP_REFERENCE, 'BIND_MAP_REFERENCE', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/actions.js');

  __REACT_HOT_LOADER__.register(PREVIEW_EXPORT, 'PREVIEW_EXPORT', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/actions.js');

  __REACT_HOT_LOADER__.register(PREVIEW_DONE, 'PREVIEW_DONE', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/actions.js');

  __REACT_HOT_LOADER__.register(PREVIEW_FAIL, 'PREVIEW_FAIL', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/actions.js');

  __REACT_HOT_LOADER__.register(RENDER_DOWNLOADABLE, 'RENDER_DOWNLOADABLE', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/actions.js');

  __REACT_HOT_LOADER__.register(RENDER_DOWNLOADABLE_SUCCESS, 'RENDER_DOWNLOADABLE_SUCCESS', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/actions.js');

  __REACT_HOT_LOADER__.register(RENDER_DOWNLOADABLE_FAIL, 'RENDER_DOWNLOADABLE_FAIL', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/actions.js');

  __REACT_HOT_LOADER__.register(DOWNLOAD_MAP, 'DOWNLOAD_MAP', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/actions.js');

  __REACT_HOT_LOADER__.register(DOWNLOAD_MAP_SUCCESS, 'DOWNLOAD_MAP_SUCCESS', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/actions.js');

  __REACT_HOT_LOADER__.register(DOWNLOAD_MAP_FAIL, 'DOWNLOAD_MAP_FAIL', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/actions.js');

  __REACT_HOT_LOADER__.register(bindMapReference, 'bindMapReference', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/actions.js');

  __REACT_HOT_LOADER__.register(previewExport, 'previewExport', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/actions.js');

  __REACT_HOT_LOADER__.register(previewDone, 'previewDone', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/actions.js');

  __REACT_HOT_LOADER__.register(previewFail, 'previewFail', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/actions.js');

  __REACT_HOT_LOADER__.register(openExportModal, 'openExportModal', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/actions.js');

  __REACT_HOT_LOADER__.register(closeExportModal, 'closeExportModal', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/actions.js');

  __REACT_HOT_LOADER__.register(renderDownloadableMapSuccess, 'renderDownloadableMapSuccess', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/actions.js');

  __REACT_HOT_LOADER__.register(renderDownloadableMap, 'renderDownloadableMap', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/actions.js');

  __REACT_HOT_LOADER__.register(renderDownloadableMapFailure, 'renderDownloadableMapFailure', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/actions.js');

  __REACT_HOT_LOADER__.register(downloadMap, 'downloadMap', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/actions.js');

  __REACT_HOT_LOADER__.register(mapDownloadSuccess, 'mapDownloadSuccess', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/actions.js');

  __REACT_HOT_LOADER__.register(mapDownloadFailure, 'mapDownloadFailure', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/actions.js');
}();

;

/***/ }),

/***/ "./src/store/export/reducer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _selectors = __webpack_require__("./src/store/export/selectors.js");

var _actions = __webpack_require__("./src/store/export/actions.js");

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var _default = function _default() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _selectors.initialState;
  var action = arguments[1];

  switch (action.type) {
    case actions.BIND_MAP_REFERENCE:
      return _extends({}, state, {
        mapRef: action.mapReference
      });
    case actions.OPEN_MODAL:
      return _extends({}, state, {
        modalOpened: true
      });
    case actions.CLOSE_MODAL:
      return _extends({}, state, {
        modalOpened: false
      });
    case actions.PREVIEW_EXPORT:
      return _extends({}, state, {
        previewing: true
      });
    case actions.PREVIEW_DONE:
      return _extends({}, state, {
        preview: action.preview,
        previewing: false
      });
    case actions.PREVIEW_FAIL:
      return _extends({}, state, {
        previewing: false,
        error: action.error
      });
    case actions.RENDER_DOWNLOADABLE:
      return _extends({}, state, {
        renderingDownloadable: true
      });
    case actions.RENDER_DOWNLOADABLE_SUCCES:
      return _extends({}, state, {
        renderingDownloadable: false
      });
    case actions.RENDER_DOWNLOADABLE_FAILURE:
      return _extends({}, state, {
        error: action.error,
        renderingDownloadable: false
      });
    case actions.DOWNLOAD_MAP_SUCCESS:
      return _extends({}, state, {
        renderingDownloadable: false
      });
    case actions.DOWNLOAD_MAP_FAIL:
      return _extends({}, state, {
        renderingDownloadable: false,
        error: action.error
      });
    default:
      return state;
  }
};

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/reducer.js');
}();

;

/***/ }),

/***/ "./src/store/export/sagas.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.previewMap = previewMap;
exports.watchPreviewMap = watchPreviewMap;
exports.downloadMap = downloadMap;
exports.renderDownloadableMap = renderDownloadableMap;
exports.watchRenderDownloadableMap = watchRenderDownloadableMap;
exports.watchDownloadMap = watchDownloadMap;

var _effects = __webpack_require__("./node_modules/redux-saga/es/effects.js");

var _carto = __webpack_require__("./src/services/carto/index.js");

var _carto2 = _interopRequireDefault(_carto);

var _actions = __webpack_require__("./src/store/export/actions.js");

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [previewMap, watchPreviewMap, downloadMap, renderDownloadableMap, watchRenderDownloadableMap, watchDownloadMap].map(regeneratorRuntime.mark);

function previewMap(_ref) {
  var mapReference = _ref.mapReference;
  var data;
  return regeneratorRuntime.wrap(function previewMap$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return (0, _effects.call)(_carto2.default.preview, mapReference);

        case 3:
          data = _context.sent;
          _context.next = 6;
          return (0, _effects.put)(actions.previewDone(data));

        case 6:
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context['catch'](0);
          _context.next = 12;
          return (0, _effects.put)(actions.previewFail(_context.t0));

        case 12:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this, [[0, 8]]);
}

function watchPreviewMap() {
  var data;
  return regeneratorRuntime.wrap(function watchPreviewMap$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (false) {
            _context2.next = 8;
            break;
          }

          _context2.next = 3;
          return (0, _effects.take)(actions.PREVIEW_EXPORT);

        case 3:
          data = _context2.sent;
          _context2.next = 6;
          return (0, _effects.call)(previewMap, data);

        case 6:
          _context2.next = 0;
          break;

        case 8:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked[1], this);
}

function downloadMap(renderedMap) {
  var data;
  return regeneratorRuntime.wrap(function downloadMap$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return (0, _effects.call)(_carto2.default.download, renderedMap);

        case 3:
          data = _context3.sent;
          _context3.next = 6;
          return (0, _effects.put)(actions.mapDownloadSuccess(data));

        case 6:
          _context3.next = 12;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3['catch'](0);
          _context3.next = 12;
          return (0, _effects.put)(actions.mapDownloadFailure(_context3.t0));

        case 12:
        case 'end':
          return _context3.stop();
      }
    }
  }, _marked[2], this, [[0, 8]]);
}

function renderDownloadableMap(renderData) {
  var data;
  return regeneratorRuntime.wrap(function renderDownloadableMap$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return (0, _effects.call)(_carto2.default.render, renderData);

        case 3:
          data = _context4.sent;
          _context4.next = 6;
          return (0, _effects.call)(downloadMap, data);

        case 6:
          _context4.next = 13;
          break;

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4['catch'](0);

          console.error('Error during downloadable map rendering', _context4.t0);
          _context4.next = 13;
          return (0, _effects.put)(actions.renderDownloadableMapFailure(_context4.t0));

        case 13:
        case 'end':
          return _context4.stop();
      }
    }
  }, _marked[3], this, [[0, 8]]);
}

function watchRenderDownloadableMap() {
  var data;
  return regeneratorRuntime.wrap(function watchRenderDownloadableMap$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (false) {
            _context5.next = 8;
            break;
          }

          _context5.next = 3;
          return (0, _effects.take)(actions.RENDER_DOWNLOADABLE);

        case 3:
          data = _context5.sent;
          _context5.next = 6;
          return (0, _effects.call)(renderDownloadableMap, data);

        case 6:
          _context5.next = 0;
          break;

        case 8:
        case 'end':
          return _context5.stop();
      }
    }
  }, _marked[4], this);
}

function watchDownloadMap() {
  var data;
  return regeneratorRuntime.wrap(function watchDownloadMap$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          if (false) {
            _context6.next = 8;
            break;
          }

          _context6.next = 3;
          return (0, _effects.take)(actions.DOWNLOAD_MAP);

        case 3:
          data = _context6.sent;
          _context6.next = 6;
          return (0, _effects.call)(downloadMap, data);

        case 6:
          _context6.next = 0;
          break;

        case 8:
        case 'end':
          return _context6.stop();
      }
    }
  }, _marked[5], this);
}

var _default = regeneratorRuntime.mark(function _default() {
  return regeneratorRuntime.wrap(function _default$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return (0, _effects.fork)(watchPreviewMap);

        case 2:
          _context7.next = 4;
          return (0, _effects.fork)(watchRenderDownloadableMap);

        case 4:
          _context7.next = 6;
          return (0, _effects.fork)(watchDownloadMap);

        case 6:
        case 'end':
          return _context7.stop();
      }
    }
  }, _default, this);
});

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(previewMap, 'previewMap', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/sagas.js');

  __REACT_HOT_LOADER__.register(watchPreviewMap, 'watchPreviewMap', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/sagas.js');

  __REACT_HOT_LOADER__.register(downloadMap, 'downloadMap', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/sagas.js');

  __REACT_HOT_LOADER__.register(renderDownloadableMap, 'renderDownloadableMap', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/sagas.js');

  __REACT_HOT_LOADER__.register(watchRenderDownloadableMap, 'watchRenderDownloadableMap', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/sagas.js');

  __REACT_HOT_LOADER__.register(watchDownloadMap, 'watchDownloadMap', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/sagas.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/sagas.js');
}();

;

/***/ }),

/***/ "./src/store/export/selectors.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var initialState = exports.initialState = {
  modalOpened: false,
  mapRef: null,
  previewing: false,
  mapPreview: null,
  exporting: false,
  renderingDownloadable: false
};

var mapReference = exports.mapReference = function mapReference(state) {
  return state.mapRef;
};
var mapPreview = exports.mapPreview = function mapPreview(state) {
  return state.preview;
};
var isPreviewing = exports.isPreviewing = function isPreviewing(state) {
  return state.previewing;
};
var isRenderingDownloadable = exports.isRenderingDownloadable = function isRenderingDownloadable(state) {
  return state.renderingDownloadable;
};
var isModalOpened = exports.isModalOpened = function isModalOpened(state) {
  return state.modalOpened;
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(initialState, "initialState", "/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/selectors.js");

  __REACT_HOT_LOADER__.register(mapReference, "mapReference", "/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/selectors.js");

  __REACT_HOT_LOADER__.register(mapPreview, "mapPreview", "/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/selectors.js");

  __REACT_HOT_LOADER__.register(isPreviewing, "isPreviewing", "/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/selectors.js");

  __REACT_HOT_LOADER__.register(isRenderingDownloadable, "isRenderingDownloadable", "/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/selectors.js");

  __REACT_HOT_LOADER__.register(isModalOpened, "isModalOpened", "/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/export/selectors.js");
}();

;

/***/ }),

/***/ "./src/store/filters/actions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var TOGGLE_ARIDITY_VISIBILITY = exports.TOGGLE_ARIDITY_VISIBILITY = 'FILTERS/ARIDITY/TOGGLE';
var TOGGLE_CIRCLE_SIZE_VISIBILITY = exports.TOGGLE_CIRCLE_SIZE_VISIBILITY = 'FILTERS/CIRCLES/SIZES/TOGGLE';
var TOGGLE_CIRCLE_TYPE_VISIBILITY = exports.TOGGLE_CIRCLE_TYPE_VISIBILITY = 'FILTERS/CIRCLES/TYPES/TOGGLE';
var TOGGLE_TEMPERATURE_TYPE_VISIBILITY = exports.TOGGLE_TEMPERATURE_TYPE_VISIBILITY = 'FILTERS/TEMPERATURES/TOGGLE';

var toggleTemperatureVisibility = exports.toggleTemperatureVisibility = function toggleTemperatureVisibility(temperature, type) {
  return {
    type: TOGGLE_TEMPERATURE_TYPE_VISIBILITY,
    temperature: temperature,
    temperatureType: type
  };
};

var toggleAridityVisibility = exports.toggleAridityVisibility = function toggleAridityVisibility(aridity) {
  return {
    type: TOGGLE_ARIDITY_VISIBILITY,
    aridity: aridity
  };
};

var toggleCircleSizeVisibility = exports.toggleCircleSizeVisibility = function toggleCircleSizeVisibility(circleSize) {
  return {
    type: TOGGLE_CIRCLE_SIZE_VISIBILITY,
    circleSize: circleSize
  };
};

var toggleCircleTypeVisibility = exports.toggleCircleTypeVisibility = function toggleCircleTypeVisibility(circleType) {
  return {
    type: TOGGLE_CIRCLE_TYPE_VISIBILITY,
    circleType: circleType
  };
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(TOGGLE_ARIDITY_VISIBILITY, 'TOGGLE_ARIDITY_VISIBILITY', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/actions.js');

  __REACT_HOT_LOADER__.register(TOGGLE_CIRCLE_SIZE_VISIBILITY, 'TOGGLE_CIRCLE_SIZE_VISIBILITY', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/actions.js');

  __REACT_HOT_LOADER__.register(TOGGLE_CIRCLE_TYPE_VISIBILITY, 'TOGGLE_CIRCLE_TYPE_VISIBILITY', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/actions.js');

  __REACT_HOT_LOADER__.register(TOGGLE_TEMPERATURE_TYPE_VISIBILITY, 'TOGGLE_TEMPERATURE_TYPE_VISIBILITY', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/actions.js');

  __REACT_HOT_LOADER__.register(toggleTemperatureVisibility, 'toggleTemperatureVisibility', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/actions.js');

  __REACT_HOT_LOADER__.register(toggleAridityVisibility, 'toggleAridityVisibility', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/actions.js');

  __REACT_HOT_LOADER__.register(toggleCircleSizeVisibility, 'toggleCircleSizeVisibility', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/actions.js');

  __REACT_HOT_LOADER__.register(toggleCircleTypeVisibility, 'toggleCircleTypeVisibility', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/actions.js');
}();

;

/***/ }),

/***/ "./src/store/filters/reducer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _temperatures = __webpack_require__("./src/utils/temperatures.js");

var temperaturesTypes = _interopRequireWildcard(_temperatures);

var _actions = __webpack_require__("./src/store/filters/actions.js");

var actions = _interopRequireWildcard(_actions);

var _actions2 = __webpack_require__("./src/store/data/actions.js");

var _selectors = __webpack_require__("./src/store/filters/selectors.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var filterTemperatures = function filterTemperatures(original, temperatures) {
  var types = temperaturesTypes.filter(temperatures).map(function (t) {
    return '' + t.value;
  });
  var result = [];
  if (types.length > 0) {
    var f = function f(t) {
      return types.indexOf(t.properties.Temperatur) > -1;
    };
    result = original.temperatures.features.filter(f);
  }
  return result;
};

var filterAridity = function filterAridity(original, aridity) {
  var types = Object.keys(aridity).filter(function (type) {
    return aridity[type].visible;
  });
  var result = [];

  if (types.length > 0) {
    var f = function f(aridity) {
      return types.indexOf(aridity.properties.d_TYPE) > -1;
    };
    result = original.aridity.features.filter(f);
  }
  return result;
};

var filterCircles = function filterCircles(original, _ref) {
  var sizes = _ref.sizes,
      types = _ref.types;

  var visibleTypes = Object.keys(types).filter(function (key) {
    return types[key].visible;
  });

  var visibleSizes = Object.keys(sizes).filter(function (key) {
    return sizes[key].visible;
  });

  var sizeFilter = function sizeFilter(circle) {
    return visibleSizes.indexOf(circle.properties.size_) > -1;
  };

  var typeFilter = function typeFilter(circle) {
    return visibleTypes.indexOf(circle.properties.colours) > -1;
  };
  var result = [];
  if (visibleSizes.length > 0) {
    var f = sizeFilter;
    if (visibleTypes.length > 0) {
      f = function f(circle) {
        return sizeFilter(circle) && typeFilter(circle);
      };
    }
    result = original.circles.features.filter(f);
  }

  return result;
};

var visibleTypesCount = function visibleTypesCount(types) {
  return Object.keys(types).filter(function (key) {
    return types[key].visible;
  }).length;
};

var toggleTemperatureTypeVisibility = function toggleTemperatureTypeVisibility(state, action) {
  var temperatures = _extends({}, state.temperatures, _defineProperty({}, action.temperature, _extends({}, state.temperatures[action.temperature], _defineProperty({}, action.temperatureType.name, _extends({}, action.temperatureType, {
    visible: !action.temperatureType.visible
  })))));

  var tempsCount = function tempsCount(_ref2) {
    var winter = _ref2.winter,
        summer = _ref2.summer;
    return visibleTypesCount(winter) + visibleTypesCount(summer);
  };

  var counts = _extends({}, state.counts, {
    temperatures: {
      original: state.counts.temperatures.original,
      previous: tempsCount(state.temperatures),
      current: tempsCount(temperatures)
    }
  });
  return _extends({}, state, {
    temperatures: temperatures,
    counts: counts,
    filtered: _extends({}, state.filtered, {
      temperatures: _extends({}, state.original.temperatures, {
        features: filterTemperatures(state.original, temperatures)
      })
    })
  });
};

var toggleAridityVisibility = function toggleAridityVisibility(state, action) {
  var aridity = _extends({}, state.aridity, _defineProperty({}, action.aridity.name, _extends({}, action.aridity, {
    visible: !state.aridity[action.aridity.name].visible
  })));
  var counts = _extends({}, state.counts, {
    aridity: {
      original: state.counts.aridity.original,
      previous: visibleTypesCount(state.aridity),
      current: visibleTypesCount(aridity)
    }
  });

  return _extends({}, state, {
    aridity: aridity,
    counts: counts,
    filtered: _extends({}, state.filtered, {
      aridity: _extends({}, state.original.aridity, {
        features: filterAridity(state.original, aridity)
      })
    })
  });
};

// makes a circle size visible or not.
var toggleCircleSizeVisibility = function toggleCircleSizeVisibility(state, action) {
  var size = state.circles.sizes[action.circleSize.name];

  var _circles = _extends({}, state.circles, {
    sizes: _extends({}, state.circles.sizes, _defineProperty({}, size.name, _extends({}, size, {
      visible: !size.visible
    })))
  });

  return _extends({}, state, {
    circles: _circles,
    filtered: _extends({}, state.filtered, {
      circles: _extends({}, state.filtered.circles, {
        features: filterCircles(state.original, _circles)
      })
    })
  });
};

var toggleCircleTypeVisibility = function toggleCircleTypeVisibility(state, action) {
  var type = state.circles.types[action.circleType.name];
  var _circles = _extends({}, state.circles, {
    types: _extends({}, state.circles.types, _defineProperty({}, type.name, _extends({}, type, {
      visible: !type.visible
    })))
  });

  return _extends({}, state, {
    circles: _circles,
    filtered: _extends({}, state.filtered, {
      circles: _extends({}, state.original.circles, {
        features: filterCircles(state.original, _circles)
      })
    })
  });
};

var _default = function _default() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _selectors.initialState;
  var action = arguments[1];

  var result = void 0;
  switch (action.type) {
    case _actions2.DATA_LOAD_SUCCESS:
      result = _extends({}, state, {
        original: action.data,
        filtered: action.data
      });
      break;
    case actions.TOGGLE_TEMPERATURE_TYPE_VISIBILITY:
      result = toggleTemperatureTypeVisibility(state, action);
      break;
    case actions.TOGGLE_ARIDITY_VISIBILITY:
      result = toggleAridityVisibility(state, action);
      break;
    case actions.TOGGLE_CIRCLE_SIZE_VISIBILITY:
      result = toggleCircleSizeVisibility(state, action);
      break;
    case actions.TOGGLE_CIRCLE_TYPE_VISIBILITY:
      result = toggleCircleTypeVisibility(state, action);
      break;
    default:
      result = state;
      break;
  }
  return result;
};

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(filterTemperatures, 'filterTemperatures', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/reducer.js');

  __REACT_HOT_LOADER__.register(filterAridity, 'filterAridity', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/reducer.js');

  __REACT_HOT_LOADER__.register(filterCircles, 'filterCircles', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/reducer.js');

  __REACT_HOT_LOADER__.register(visibleTypesCount, 'visibleTypesCount', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/reducer.js');

  __REACT_HOT_LOADER__.register(toggleTemperatureTypeVisibility, 'toggleTemperatureTypeVisibility', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/reducer.js');

  __REACT_HOT_LOADER__.register(toggleAridityVisibility, 'toggleAridityVisibility', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/reducer.js');

  __REACT_HOT_LOADER__.register(toggleCircleSizeVisibility, 'toggleCircleSizeVisibility', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/reducer.js');

  __REACT_HOT_LOADER__.register(toggleCircleTypeVisibility, 'toggleCircleTypeVisibility', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/reducer.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/reducer.js');
}();

;

/***/ }),

/***/ "./src/store/filters/selectors.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var initialState = exports.initialState = {
  isUpdatingUnionMask: true,
  originalCounts: {
    temperatures: 7,
    aridity: 4
  },
  counts: {
    temperatures: {
      original: 7,
      previous: 7,
      current: 7
    },
    aridity: {
      original: 4,
      previous: 4,
      current: 4
    }
  },
  temperatures: {
    winter: {
      A: {
        name: 'A',
        visible: true
      },
      B: {
        name: 'B',
        visible: true
      },
      C: {
        name: 'C',
        visible: true
      },
      D: {
        name: 'D',
        visible: true
      }
    },
    summer: {
      A: {
        name: 'A',
        visible: true
      },
      B: {
        name: 'B',
        visible: true
      },
      C: {
        name: 'C',
        visible: true
      }
    }
  },
  aridity: {
    Hyper: {
      name: 'Hyper',
      visible: true
    },
    Aride: {
      name: 'Aride',
      visible: true
    },
    Semi: {
      name: 'Semi',
      visible: true
    },
    Sub_humide: {
      name: 'Sub_humide',
      visible: true
    }
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
      '07': { name: '07', visible: true }
    },
    types: {
      A: {
        visible: true,
        name: 'A'
      },
      B: {
        visible: true,
        name: 'B'
      },
      C: {
        visible: true,
        name: 'C'
      },
      D: {
        visible: true,
        name: 'D'
      },
      E: {
        visible: true,
        name: 'E'
      },
      F: {
        visible: true,
        name: 'F'
      }
    }
  },
  original: null,
  filtered: null
};

var winterTemperatures = exports.winterTemperatures = function winterTemperatures(state) {
  return state.temperatures.winter;
};
var summerTemperatures = exports.summerTemperatures = function summerTemperatures(state) {
  return state.temperatures.summer;
};

var aridity = exports.aridity = function aridity(state, name) {
  switch (name) {
    case 'hyper':
      return state.aridity.Hyper;
    case 'arid':
      return state.aridity.Aride;
    case 'semi':
      return state.aridity.Semi;
    case 'subHumide':
      return state.aridity.Sub_humide;
    default:
      return null;
  }
};

var circlesTypes = exports.circlesTypes = function circlesTypes(state) {
  return state.circles.types;
};
var circlesSizes = exports.circlesSizes = function circlesSizes(state) {
  return state.circles.sizes;
};

var dryMonths = exports.dryMonths = function dryMonths(state) {
  return state.circles.month_range;
};

var filters = exports.filters = function filters(state) {
  return state;
};
var isUpdatingUnionMask = exports.isUpdatingUnionMask = function isUpdatingUnionMask(state) {
  return state.isUpdatingUnionMask;
};
var data = exports.data = function data(state) {
  return state.filtered;
};
var counts = exports.counts = function counts(state) {
  return state.counts;
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(initialState, 'initialState', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/selectors.js');

  __REACT_HOT_LOADER__.register(winterTemperatures, 'winterTemperatures', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/selectors.js');

  __REACT_HOT_LOADER__.register(summerTemperatures, 'summerTemperatures', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/selectors.js');

  __REACT_HOT_LOADER__.register(aridity, 'aridity', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/selectors.js');

  __REACT_HOT_LOADER__.register(circlesTypes, 'circlesTypes', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/selectors.js');

  __REACT_HOT_LOADER__.register(circlesSizes, 'circlesSizes', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/selectors.js');

  __REACT_HOT_LOADER__.register(dryMonths, 'dryMonths', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/selectors.js');

  __REACT_HOT_LOADER__.register(filters, 'filters', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/selectors.js');

  __REACT_HOT_LOADER__.register(isUpdatingUnionMask, 'isUpdatingUnionMask', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/selectors.js');

  __REACT_HOT_LOADER__.register(data, 'data', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/selectors.js');

  __REACT_HOT_LOADER__.register(counts, 'counts', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/filters/selectors.js');
}();

;

/***/ }),

/***/ "./src/store/layers/actions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var TOGGLE_LAYER_VISIBILITY = exports.TOGGLE_LAYER_VISIBILITY = 'LAYERS/TOGGLE';

var toggleLayerVisibility = exports.toggleLayerVisibility = function toggleLayerVisibility(layer) {
  return {
    type: TOGGLE_LAYER_VISIBILITY,
    layer: layer
  };
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(TOGGLE_LAYER_VISIBILITY, 'TOGGLE_LAYER_VISIBILITY', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/layers/actions.js');

  __REACT_HOT_LOADER__.register(toggleLayerVisibility, 'toggleLayerVisibility', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/layers/actions.js');
}();

;

/***/ }),

/***/ "./src/store/layers/reducer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _actions = __webpack_require__("./src/store/layers/actions.js");

var actions = _interopRequireWildcard(_actions);

var _selectors = __webpack_require__("./src/store/layers/selectors.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = function _default() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _selectors.initialState;
  var action = arguments[1];

  switch (action.type) {
    case actions.TOGGLE_LAYER_VISIBILITY:
      return _extends({}, state, _defineProperty({}, action.layer.name, _extends({}, action.layer, {
        visible: !state[action.layer.name].visible
      })));
    default:
      return state;
  }
};

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/layers/reducer.js');
}();

;

/***/ }),

/***/ "./src/store/layers/selectors.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var NAMES = {
  TEMPS: 'temperatures',
  CIRCLES: 'circles',
  ARIDITY: 'aridity'
};

var initialState = exports.initialState = {
  aridity: {
    name: NAMES.ARIDITY,
    visible: true
  },
  temperatures: {
    name: NAMES.TEMPS,
    visible: true
  },
  circles: {
    name: NAMES.CIRCLES,
    visible: true
  }
};

var layers = exports.layers = function layers(state) {
  return state;
};
var layerByName = exports.layerByName = function layerByName() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var name = arguments[1];
  return state[name];
};
var isLayerVisible = exports.isLayerVisible = function isLayerVisible() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var layer = arguments[1];
  return layerByName(state, layer.name).visible;
};
var aridity = exports.aridity = function aridity() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  return state.aridity;
};
var temperatures = exports.temperatures = function temperatures() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  return state.temperatures;
};
var circles = exports.circles = function circles() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  return layerByName(state, NAMES.CIRCLES);
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(NAMES, 'NAMES', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/layers/selectors.js');

  __REACT_HOT_LOADER__.register(initialState, 'initialState', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/layers/selectors.js');

  __REACT_HOT_LOADER__.register(layers, 'layers', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/layers/selectors.js');

  __REACT_HOT_LOADER__.register(layerByName, 'layerByName', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/layers/selectors.js');

  __REACT_HOT_LOADER__.register(isLayerVisible, 'isLayerVisible', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/layers/selectors.js');

  __REACT_HOT_LOADER__.register(aridity, 'aridity', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/layers/selectors.js');

  __REACT_HOT_LOADER__.register(temperatures, 'temperatures', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/layers/selectors.js');

  __REACT_HOT_LOADER__.register(circles, 'circles', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/layers/selectors.js');
}();

;

/***/ }),

/***/ "./src/store/legend/actions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var TOGGLE_LEGEND = exports.TOGGLE_LEGEND = 'LEGEND/TOGGLE';
var SHOW_MORE_INFOS = exports.SHOW_MORE_INFOS = 'LEGEND/INFOS/SHOW';
var HIDE_MORE_INFOS = exports.HIDE_MORE_INFOS = 'LEGEND/INFOS/HIDE';

var toggleLegend = exports.toggleLegend = function toggleLegend() {
  return {
    type: TOGGLE_LEGEND
  };
};

var hideMoreInfos = exports.hideMoreInfos = function hideMoreInfos() {
  return {
    type: HIDE_MORE_INFOS
  };
};

var showMoreInfos = exports.showMoreInfos = function showMoreInfos() {
  return {
    type: SHOW_MORE_INFOS
  };
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(TOGGLE_LEGEND, 'TOGGLE_LEGEND', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/legend/actions.js');

  __REACT_HOT_LOADER__.register(SHOW_MORE_INFOS, 'SHOW_MORE_INFOS', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/legend/actions.js');

  __REACT_HOT_LOADER__.register(HIDE_MORE_INFOS, 'HIDE_MORE_INFOS', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/legend/actions.js');

  __REACT_HOT_LOADER__.register(toggleLegend, 'toggleLegend', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/legend/actions.js');

  __REACT_HOT_LOADER__.register(hideMoreInfos, 'hideMoreInfos', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/legend/actions.js');

  __REACT_HOT_LOADER__.register(showMoreInfos, 'showMoreInfos', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/legend/actions.js');
}();

;

/***/ }),

/***/ "./src/store/legend/reducer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _selectors = __webpack_require__("./src/store/legend/selectors.js");

var _actions = __webpack_require__("./src/store/legend/actions.js");

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var _default = function _default() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _selectors.initialState;
  var action = arguments[1];

  switch (action.type) {
    case actions.TOGGLE_LEGEND:
      return _extends({}, state, {
        opened: !state.opened
      });
    case actions.SHOW_MORE_INFOS:
      return _extends({}, state, {
        showMoreInfos: true
      });
    case actions.HIDE_MORE_INFOS:
      return _extends({}, state, {
        showMoreInfos: false
      });
    default:
      return state;
  }
};

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/legend/reducer.js');
}();

;

/***/ }),

/***/ "./src/store/legend/selectors.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var initialState = exports.initialState = {
  opened: true,
  showMoreInfos: false
};
var isOpened = exports.isOpened = function isOpened() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  return state.opened;
};

var moreInfosVisible = exports.moreInfosVisible = function moreInfosVisible(state) {
  return state.showMoreInfos;
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(initialState, "initialState", "/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/legend/selectors.js");

  __REACT_HOT_LOADER__.register(isOpened, "isOpened", "/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/legend/selectors.js");

  __REACT_HOT_LOADER__.register(moreInfosVisible, "moreInfosVisible", "/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/legend/selectors.js");
}();

;

/***/ }),

/***/ "./src/store/middlewares.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var req = __webpack_require__("./src/store recursive \\.\\/.+\\/middleware\\.js$");

module.exports = req.keys().map(function (key) {
  return req(key).default;
});
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(req, 'req', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/middlewares.js');
}();

;

/***/ }),

/***/ "./src/store/modal/actions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var MODAL_SHOW = exports.MODAL_SHOW = 'MODAL/SHOW';
var MODAL_HIDE = exports.MODAL_HIDE = 'MODAL/HIDE';

var modalShow = exports.modalShow = function modalShow(name) {
  return {
    type: MODAL_SHOW,
    name: name
  };
};

var modalHide = exports.modalHide = function modalHide(name) {
  return {
    type: MODAL_HIDE,
    name: name
  };
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(MODAL_SHOW, 'MODAL_SHOW', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/modal/actions.js');

  __REACT_HOT_LOADER__.register(MODAL_HIDE, 'MODAL_HIDE', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/modal/actions.js');

  __REACT_HOT_LOADER__.register(modalShow, 'modalShow', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/modal/actions.js');

  __REACT_HOT_LOADER__.register(modalHide, 'modalHide', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/modal/actions.js');
}();

;

/***/ }),

/***/ "./src/store/modal/reducer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _selectors = __webpack_require__("./src/store/modal/selectors.js");

var _actions = __webpack_require__("./src/store/modal/actions.js");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = function _default() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _selectors.initialState;
  var action = arguments[1];

  switch (action.type) {
    case _actions.MODAL_SHOW:
      return _extends({}, state, _defineProperty({}, action.name, true));
    case _actions.MODAL_HIDE:
      if (action.name) {
        return _extends({}, state, _defineProperty({}, action.name, false));
      }
      return _selectors.initialState;
    default:
      return state;
  }
};

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/modal/reducer.js');
}();

;

/***/ }),

/***/ "./src/store/modal/selectors.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var initialState = exports.initialState = {};

var isOpen = exports.isOpen = function isOpen() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var name = arguments[1];
  return !!state[name];
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(initialState, "initialState", "/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/modal/selectors.js");

  __REACT_HOT_LOADER__.register(isOpen, "isOpen", "/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/modal/selectors.js");
}();

;

/***/ }),

/***/ "./src/store/reducer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = __webpack_require__("./node_modules/lodash.camelcase/index.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _redux = __webpack_require__("./node_modules/redux/es/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://github.com/diegohaz/arc/wiki/Reducers
var reducers = {};

var req = __webpack_require__("./src/store recursive \\.\\/.+\\/reducer\\.js$");

req.keys().forEach(function (key) {
  var storeName = (0, _lodash2.default)(key.replace(/\.\/(.+)\/.+$/, '$1'));
  reducers[storeName] = req(key).default;
});

var _default = (0, _redux.combineReducers)(reducers);

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(reducers, 'reducers', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/reducer.js');

  __REACT_HOT_LOADER__.register(req, 'req', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/reducer.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/reducer.js');
}();

;

/***/ }),

/***/ "./src/store/sagas.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _effects = __webpack_require__("./node_modules/redux-saga/es/effects.js");

var req = __webpack_require__("./src/store recursive \\.\\/.+\\/sagas\\.js$"); // https://github.com/diegohaz/arc/wiki/Sagas


var sagas = req.keys().map(function (key) {
  return req(key).default;
});

var _default = regeneratorRuntime.mark(function _default() {
  var services = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return regeneratorRuntime.wrap(function _default$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _effects.all)(sagas.map(function (saga) {
            return (0, _effects.fork)(saga, services);
          }));

        case 2:
        case 'end':
          return _context.stop();
      }
    }
  }, _default, this);
});

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(req, 'req', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/sagas.js');

  __REACT_HOT_LOADER__.register(sagas, 'sagas', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/sagas.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/sagas.js');
}();

;

/***/ }),

/***/ "./src/store/selectors.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://github.com/diegohaz/arc/wiki/Selectors
var upperFirst = __webpack_require__("./node_modules/lodash.upperfirst/index.js");

var req = __webpack_require__("./src/store recursive \\.\\/.+\\/selectors\\.js$");

req.keys().forEach(function (key) {
  var storeName = key.replace(/\.\/(.+)\/.+$/, '$1');
  var fromName = 'from' + upperFirst(storeName);
  var selectors = req(key);
  var getState = function getState() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return state[storeName] || {};
  };

  module.exports[fromName] = {};

  Object.keys(selectors).forEach(function (name) {
    var selector = selectors[name];
    if (typeof selector === 'function') {
      module.exports[fromName][name] = function (state) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return selector.apply(undefined, [getState(state)].concat(args));
      };
    }
  });
});
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(req, 'req', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/selectors.js');
}();

;

/***/ }),

/***/ "./src/store/sidebar/actions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var TOGGLE_SIDEBAR = exports.TOGGLE_SIDEBAR = 'SIDEBAR/TOGGLE';

var toggleSidebar = exports.toggleSidebar = function toggleSidebar() {
  return {
    type: TOGGLE_SIDEBAR
  };
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(TOGGLE_SIDEBAR, 'TOGGLE_SIDEBAR', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/sidebar/actions.js');

  __REACT_HOT_LOADER__.register(toggleSidebar, 'toggleSidebar', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/sidebar/actions.js');
}();

;

/***/ }),

/***/ "./src/store/sidebar/reducer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _selectors = __webpack_require__("./src/store/sidebar/selectors.js");

var _actions = __webpack_require__("./src/store/sidebar/actions.js");

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var _default = function _default() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _selectors.initialState;
  var action = arguments[1];

  switch (action.type) {
    case actions.TOGGLE_SIDEBAR:
      return {
        opened: !state.opened
      };
    default:
      return state;
  }
};

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/sidebar/reducer.js');
}();

;

/***/ }),

/***/ "./src/store/sidebar/selectors.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var initialState = exports.initialState = {
  opened: true
};
var isOpened = exports.isOpened = function isOpened() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  return state.opened;
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(initialState, "initialState", "/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/sidebar/selectors.js");

  __REACT_HOT_LOADER__.register(isOpened, "isOpened", "/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/sidebar/selectors.js");
}();

;

/***/ }),

/***/ "./src/store/tutorial/actions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var HIDE_TUTORIAL = exports.HIDE_TUTORIAL = 'TUTORIAL/HIDE';
var hideTutorial = exports.hideTutorial = function hideTutorial() {
  return { type: HIDE_TUTORIAL };
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(HIDE_TUTORIAL, 'HIDE_TUTORIAL', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/tutorial/actions.js');

  __REACT_HOT_LOADER__.register(hideTutorial, 'hideTutorial', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/tutorial/actions.js');
}();

;

/***/ }),

/***/ "./src/store/tutorial/reducer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _selectors = __webpack_require__("./src/store/tutorial/selectors.js");

var _actions = __webpack_require__("./src/store/tutorial/actions.js");

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var _default = function _default() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _selectors.initialState;
  var action = arguments[1];

  switch (action.type) {
    case actions.HIDE_TUTORIAL:
      return _extends({}, state, {
        visible: false
      });
    default:
      return state;
  }
};

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/tutorial/reducer.js');
}();

;

/***/ }),

/***/ "./src/store/tutorial/selectors.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var initialState = exports.initialState = {
  visible: true
};

var isVisible = exports.isVisible = function isVisible(state) {
  return state.visible;
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(initialState, "initialState", "/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/tutorial/selectors.js");

  __REACT_HOT_LOADER__.register(isVisible, "isVisible", "/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/store/tutorial/selectors.js");
}();

;

/***/ }),

/***/ "./src/utils/aridity.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// TODO: prévoir i18n
var ARIDITY = {
  Hyper: {
    name: 'Hyper Aride',
    description: 'La zone **hyper-aride** (P/Etp moins de 0,03) correspond au désert vrai, avec possibilité d\'une ou plusieurs années sans pluies, soit sans aucune végétation, soit avec des éphémérophytes et quelques buissons dans les lits d\'oueds.',
    precipitations: 'moins de 0,03'
  },
  Aride: {
    name: 'Aride',
    description: 'La zone **aride** (P/Etp de 0,03 à 0,20) comprend des régions avec espèces épineuses ou succulentes, et végétation annuelle clairsemée; l\'élevage nomade y est praticable, mais la culture sans irrigation n\'y est généralement pas possible.',
    precipitations: 'de 0,03 à 0,20'
  },
  Semi: {
    name: 'Semi-Aride',
    description: 'La zone **semi-aride**(**P/Etp de 0,20 à 0,50**) comprend des steppes ou des formations tropicales buissonnantes sur couvert herbacé plus ou moins discontinu avec plus grande fréquence de graminées pérennes; l\'élevage sédentaire y est possible ainsi que la culture non irriguée.',
    precipitations: 'de 0,20 à 0,50'
  },
  Sub_humide: {
    description: 'La zone **sub-humide** (**P/Etp de 0,50 à 0,75**) comprend principalement certains types de savanes tropicales, des maquis et chaparrals de climat méditérranéen, ainsi que les steppes sur chernozem.',
    name: 'Sub-humide',
    precipitations: 'de 0,50 à 0,75'
  }
};

var allAridity = exports.allAridity = function allAridity() {
  return Object.keys(ARIDITY).map(function (key) {
    var aridity = ARIDITY[key];
    return _extends({}, aridity, {
      value: key
    });
  });
};

var getInfos = exports.getInfos = function getInfos(aridity) {
  return ARIDITY[aridity.name || aridity];
};

var getName = exports.getName = function getName(aridity) {
  return getInfos(aridity).name;
};
var getDescription = exports.getDescription = function getDescription(aridity) {
  return getInfos(aridity).description;
};
var getPrecipitations = exports.getPrecipitations = function getPrecipitations(aridity) {
  return getInfos(aridity).precipitations;
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(ARIDITY, 'ARIDITY', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/aridity.js');

  __REACT_HOT_LOADER__.register(allAridity, 'allAridity', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/aridity.js');

  __REACT_HOT_LOADER__.register(getInfos, 'getInfos', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/aridity.js');

  __REACT_HOT_LOADER__.register(getName, 'getName', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/aridity.js');

  __REACT_HOT_LOADER__.register(getDescription, 'getDescription', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/aridity.js');

  __REACT_HOT_LOADER__.register(getPrecipitations, 'getPrecipitations', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/aridity.js');
}();

;

/***/ }),

/***/ "./src/utils/boundaries.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BOUNDARY_COLOR = 'rgba(0,0,0,0.7)';
var TEETH_GAP = 20;
var BOUNDARY_WIDTH = 1.33;

// inspiration from svg-path-properties

var pathProperties = exports.pathProperties = function () {
  function pathProperties(pathStr, id) {
    _classCallCheck(this, pathProperties);

    var path = document.querySelector('#path-' + id);
    if (!path) {
      path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('id', 'path-' + id);
      var util = document.querySelector('#pathUtil');
      util.append(path);
    }
    path.setAttribute('d', pathStr);
    this.path = path;
  }

  _createClass(pathProperties, [{
    key: 'tanAt',
    value: function tanAt(l) {
      var p1 = this.pointAt(l);
      var p2 = this.pointAt(l + 1);
      // took from https://github.com/rveciana/svg-path-properties/blob/master/src/linear.js
      var module = Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
      return {
        x: (p2.x - p1.x) / module,
        y: (p2.y - p1.y) / module
      };
    }
  }, {
    key: 'pointAt',
    value: function pointAt(l) {
      return this.path.getPointAtLength(l);
    }
  }, {
    key: 'totalLength',
    value: function totalLength() {
      return this.path.getTotalLength();
    }
  }]);

  return pathProperties;
}();

var BOUNDARIES = exports.BOUNDARIES = {
  TEETH: 'teeth',
  FULL: 'full',
  DASHED: 'dashed',
  NONE: null
};

var deg2rad = function deg2rad(deg) {
  return deg * (Math.PI / 180);
};
var rad2deg = function rad2deg(rad) {
  return rad * (180 / Math.PI);
};

var triangleAt = function triangleAt(path, l) {
  var base = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;
  var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 4;

  var point = path.properties.pointAt(l);
  var tan = path.properties.tanAt(l);
  var angle = Math.atan(tan.y / tan.x);
  // find the angle to rotate
  var triangleAngle = deg2rad(rad2deg(angle) - 90);
  var x0 = point.x - base / 2 * tan.x;
  var y0 = point.y - base / 2 * tan.y;

  var x1 = point.x + base / 2 * tan.x;
  var y1 = point.y + base / 2 * tan.y;

  var sx0 = point.x - height * Math.cos(triangleAngle);
  var sy0 = point.y - height * Math.sin(triangleAngle);

  var sx1 = point.x + height * Math.cos(triangleAngle);
  var sy1 = point.y + height * Math.sin(triangleAngle);

  return {
    base0: [x0, y0],
    base1: [x1, y1],
    tops: [[sx0, sy0], [sx1, sy1]]
  };
};

var teethBoundaries = function teethBoundaries(_ref) {
  var context = _ref.context,
      path = _ref.path,
      _ref$gap = _ref.gap,
      gap = _ref$gap === undefined ? TEETH_GAP : _ref$gap;

  // piste d'optimisation:
  // au lieu de faire (pour chaque triangle) une verif sur l'appartenance
  // d'un point à un chemin nous pouvons calculer le "centroid" de chaque
  // chemin puis tester la distance absolue entre ce centre et les sommet
  // du triangle.
  var path2d = new Path2D(path.path);
  var nbMarkers = Math.floor(path.length / gap) + 1;
  context.save();
  context.strokeStyle = BOUNDARY_COLOR;
  context.lineWidth = BOUNDARY_WIDTH;
  context.lineJoin = 'round';
  context.stroke(path2d);
  context.fillStyle = BOUNDARY_COLOR;
  // optimisation possible: faire un prérendu des triangle et dessiner
  // ensuite les triangle
  for (var i = 1; i <= nbMarkers; i += 1) {
    var l = i * gap;

    var _triangleAt = triangleAt(path, l),
        base0 = _triangleAt.base0,
        base1 = _triangleAt.base1,
        tops = _triangleAt.tops;

    var top = tops.find(function (p) {
      var isInPath = context.isPointInPath(path2d, p[0], p[1]);
      return path.isExterior ? isInPath : !isInPath;
    });
    if (!top) {
      top = tops[0];
    }

    context.moveTo(base0[0], base0[1]);
    context.lineTo(base1[0], base1[1]);
    context.lineTo(top[0], top[1]);
    context.fill();
  }
  context.clip();
  context.restore();
};

var fullBoundaries = function fullBoundaries(_ref2) {
  var context = _ref2.context,
      path = _ref2.path;

  var path2d = new Path2D(path.path);
  context.strokeStyle = BOUNDARY_COLOR;
  context.lineWidth = BOUNDARY_WIDTH;
  context.save();
  context.stroke(path2d);
  context.clip();
  context.restore();
};

var dashedBoundaries = function dashedBoundaries(_ref3) {
  var context = _ref3.context,
      path = _ref3.path;

  var path2d = new Path2D(path.path);
  context.strokeStyle = BOUNDARY_COLOR;
  context.lineWidth = BOUNDARY_WIDTH;
  context.setLineDash([5, 5]);
  context.save();
  context.stroke(path2d);
  context.clip();
  context.restore();
  context.setLineDash([]);
};

var addBoundary = function addBoundary(_ref4) {
  var pattern = _ref4.pattern,
      options = _objectWithoutProperties(_ref4, ['pattern']);

  switch (pattern.boundaries) {
    case BOUNDARIES.TEETH:
      teethBoundaries(_extends({ pattern: pattern }, options));
      break;
    case BOUNDARIES.FULL:
      fullBoundaries(_extends({ pattern: pattern }, options));
      break;
    case BOUNDARIES.DASHED:
      dashedBoundaries(_extends({ pattern: pattern }, options));
      break;
    default:
      break;
  }
};

exports.addBoundary = addBoundary;
var initData = function initData(_ref5) {
  var boundaries = _ref5.boundaries,
      context = _ref5.context,
      drawPath = _ref5.drawPath;

  var i = 0;
  var boundary = void 0;
  var _boundaries = [];
  var len = boundaries.length;
  var fnPath = function fnPath(feature) {
    return drawPath(feature, context).toString();
  };

  for (i; i < len; i += 1) {
    boundary = boundaries[i];
    var path = fnPath(boundary);
    var id = boundary.tags.OBJECTID_1 + '-' + i;
    // console.log('boundary id:', id);
    var properties = new pathProperties(path, id);
    _boundaries.push({
      isExterior: true,
      boundary: boundary,
      properties: properties,
      length: properties.totalLength(),
      path: path
    });
  }
  return _boundaries;
};

var addBoundaries = function addBoundaries(_ref6) {
  var patterns = _ref6.patterns,
      boundaries = _ref6.boundaries,
      drawPath = _ref6.drawPath,
      context = _ref6.context,
      options = _objectWithoutProperties(_ref6, ['patterns', 'boundaries', 'drawPath', 'context']);

  var path = void 0;
  var i = 0;
  var pathes = initData({ boundaries: boundaries, drawPath: drawPath, context: context });
  var len = pathes.length;
  for (i; i < len; i += 1) {
    path = pathes[i];
    var pattern = patterns.findByKey(path.boundary.tags.d_TYPE);
    if (pattern && pattern.boundaries) {
      addBoundary(_extends({ pattern: pattern, path: path, context: context }, options));
    }
  }
};
exports.addBoundaries = addBoundaries;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(BOUNDARY_COLOR, 'BOUNDARY_COLOR', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/boundaries.js');

  __REACT_HOT_LOADER__.register(TEETH_GAP, 'TEETH_GAP', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/boundaries.js');

  __REACT_HOT_LOADER__.register(BOUNDARY_WIDTH, 'BOUNDARY_WIDTH', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/boundaries.js');

  __REACT_HOT_LOADER__.register(pathProperties, 'pathProperties', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/boundaries.js');

  __REACT_HOT_LOADER__.register(BOUNDARIES, 'BOUNDARIES', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/boundaries.js');

  __REACT_HOT_LOADER__.register(deg2rad, 'deg2rad', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/boundaries.js');

  __REACT_HOT_LOADER__.register(rad2deg, 'rad2deg', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/boundaries.js');

  __REACT_HOT_LOADER__.register(triangleAt, 'triangleAt', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/boundaries.js');

  __REACT_HOT_LOADER__.register(teethBoundaries, 'teethBoundaries', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/boundaries.js');

  __REACT_HOT_LOADER__.register(fullBoundaries, 'fullBoundaries', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/boundaries.js');

  __REACT_HOT_LOADER__.register(dashedBoundaries, 'dashedBoundaries', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/boundaries.js');

  __REACT_HOT_LOADER__.register(addBoundary, 'addBoundary', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/boundaries.js');

  __REACT_HOT_LOADER__.register(initData, 'initData', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/boundaries.js');

  __REACT_HOT_LOADER__.register(addBoundaries, 'addBoundaries', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/boundaries.js');
}();

;

/***/ }),

/***/ "./src/utils/canvasToBlob.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable */

/* canvas-toBlob.js
 * A canvas.toBlob() implementation.
 * 2016-05-26
 * 
 * By Eli Grey, http://eligrey.com and Devin Samarin, https://github.com/eboyjr
 * License: MIT
 *   See https://github.com/eligrey/canvas-toBlob.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, regexp: true, confusion: true, es5: true, vars: true, white: true,
  plusplus: true */

/*! @source http://purl.eligrey.com/github/canvas-toBlob.js/blob/master/canvas-toBlob.js */

(function (view) {
	"use strict";

	var Uint8Array = view.Uint8Array,
	    HTMLCanvasElement = view.HTMLCanvasElement,
	    canvas_proto = HTMLCanvasElement && HTMLCanvasElement.prototype,
	    is_base64_regex = /\s*;\s*base64\s*(?:;|$)/i,
	    to_data_url = "toDataURL",
	    base64_ranks,
	    decode_base64 = function decode_base64(base64) {
		var len = base64.length,
		    buffer = new Uint8Array(len / 4 * 3 | 0),
		    i = 0,
		    outptr = 0,
		    last = [0, 0],
		    state = 0,
		    save = 0,
		    rank,
		    code,
		    undef;
		while (len--) {
			code = base64.charCodeAt(i++);
			rank = base64_ranks[code - 43];
			if (rank !== 255 && rank !== undef) {
				last[1] = last[0];
				last[0] = code;
				save = save << 6 | rank;
				state++;
				if (state === 4) {
					buffer[outptr++] = save >>> 16;
					if (last[1] !== 61 /* padding character */) {
							buffer[outptr++] = save >>> 8;
						}
					if (last[0] !== 61 /* padding character */) {
							buffer[outptr++] = save;
						}
					state = 0;
				}
			}
		}
		// 2/3 chance there's going to be some null bytes at the end, but that
		// doesn't really matter with most image formats.
		// If it somehow matters for you, truncate the buffer up outptr.
		return buffer;
	};
	if (Uint8Array) {
		base64_ranks = new Uint8Array([62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 0, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51]);
	}
	if (HTMLCanvasElement && (!canvas_proto.toBlob || !canvas_proto.toBlobHD)) {
		if (!canvas_proto.toBlob) canvas_proto.toBlob = function (callback, type /*, ...args*/) {
			if (!type) {
				type = "image/png";
			}if (this.mozGetAsFile) {
				callback(this.mozGetAsFile("canvas", type));
				return;
			}if (this.msToBlob && /^\s*image\/png\s*(?:$|;)/i.test(type)) {
				callback(this.msToBlob());
				return;
			}

			var args = Array.prototype.slice.call(arguments, 1),
			    dataURI = this[to_data_url].apply(this, args),
			    header_end = dataURI.indexOf(","),
			    data = dataURI.substring(header_end + 1),
			    is_base64 = is_base64_regex.test(dataURI.substring(0, header_end)),
			    blob;
			if (Blob.fake) {
				// no reason to decode a data: URI that's just going to become a data URI again
				blob = new Blob();
				if (is_base64) {
					blob.encoding = "base64";
				} else {
					blob.encoding = "URI";
				}
				blob.data = data;
				blob.size = data.length;
			} else if (Uint8Array) {
				if (is_base64) {
					blob = new Blob([decode_base64(data)], { type: type });
				} else {
					blob = new Blob([decodeURIComponent(data)], { type: type });
				}
			}
			callback(blob);
		};

		if (!canvas_proto.toBlobHD && canvas_proto.toDataURLHD) {
			canvas_proto.toBlobHD = function () {
				to_data_url = "toDataURLHD";
				var blob = this.toBlob();
				to_data_url = "toDataURL";
				return blob;
			};
		} else {
			canvas_proto.toBlobHD = canvas_proto.toBlob;
		}
	}
})(typeof self !== "undefined" && self || typeof window !== "undefined" && window || undefined.content || undefined);
;

var _temp = function () {
	if (typeof __REACT_HOT_LOADER__ === 'undefined') {
		return;
	}
}();

;

/***/ }),

/***/ "./src/utils/circles.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.monthsDescription = exports.circleMonths = exports.getDroughtMonths = exports.sizesForRange = exports.circleColor = exports.colorByValue = exports.droughtRegimeSingle = exports.droughtRegimeHelp = exports.droughtFullRegime = exports.droughtRegime = exports.allDroughtRegimes = undefined;

var _utils = __webpack_require__("./src/utils/index.js");

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var DROUGHTS = [{
  value: 'A',
  regime_single: 'régime à pluie d\'hiver (parfois décalées vers le printemps)',
  regime: 'Régimes à pluie d\'hiver',
  regime_full: 'Régimes à pluies d\'hiver (parfois décalées vers le printemps) : la sécheresse est maximale en été.',
  color: '#468fba'
}, {
  value: 'B',
  regime_single: 'régime à deux saisons de pluies',
  regime: 'Régimes à deux saisons de pluies',
  regime_full: 'Régimes à deux saisons de pluies, l\'une vers la fin de l\'automne, l\'autre au début du printemps : la sécheresse d\'hiver est moins marquée et plus courte que celle d\'été.',
  color: '#498b45'
}, {
  value: 'C',
  regime_single: 'régime à pluies d\'été (parfois décalées vers l\'automne)',
  regime: 'Régimes à pluies d\'été',
  regime_full: 'Régimes à pluies d\'été (parfois décalées vers l\'automne) : la sécheresse est maximale en hiver.',
  color: '#e15e46'
}, {
  value: 'D',
  regime_single: 'régime à deux saisons de pluies',
  regime: 'Régimes à deux saisons de pluies',
  regime_full: 'Régimes à deux saisons de pluies, l\'une vers la fin du printemps, l\'autre au début de l\'automne: la sécheresse d\'été est moins marquée et plus courte que celle d\'hiver.',
  color: '#fea959'
}, {
  value: 'E',
  regime_single: 'régime à deux saisons de pluies',
  regime: 'Régimes à deux saisons de pluies',
  regime_full: 'Régimes à deux saisons de pluies, l\'une en été, l\'autre en hiver : les sécheresses, bien marquées, sont au printemps et en automne.',
  color: '#7e6ba3'
}, {
  value: 'F',
  regime_single: 'régime irrégulier',
  regime: 'Régimes irréguliers',
  regime_full: 'Régimes irréguliers : les pluies sont soit accidentelles et sans date prévisible, soit, dans les régions moins sèches réparties au long de l\'année sans maximum bien marqué, ou avec des maximums sans date prévisible.',
  color: '#858288'
}];

var allDroughtRegimes = exports.allDroughtRegimes = function allDroughtRegimes() {
  return DROUGHTS;
};
var NUMBER_OF_MONTHS = [{
  value: '01',
  description: 'moins de 1',
  months: [1]
}, {
  value: '02',
  description: '1,2,3',
  months: [1, 3]
}, {
  value: '03',
  description: '4,5',
  months: [4, 5]
}, {
  value: '04',
  description: '6,7',
  months: [6, 7]
}, {
  value: '05',
  description: '8,9',
  months: [8, 9]
}, {
  value: '06',
  description: '10,11',
  months: [10, 11]
}, {
  value: '07',
  description: '12 mois',
  months: [12]
}];
var DROUGHTS_OBJ = utils.arrToObj(DROUGHTS);

var droughtRegime = exports.droughtRegime = function droughtRegime(value) {
  return DROUGHTS_OBJ[value].regime;
};

var droughtFullRegime = exports.droughtFullRegime = function droughtFullRegime(value) {
  return DROUGHTS_OBJ[value].regime_full;
};
var droughtRegimeHelp = exports.droughtRegimeHelp = function droughtRegimeHelp(value) {
  return DROUGHTS_OBJ[value].regime_help;
};
var droughtRegimeSingle = exports.droughtRegimeSingle = function droughtRegimeSingle(value) {
  return DROUGHTS_OBJ[value].regime_single;
};

var colorByValue = exports.colorByValue = function colorByValue(value) {
  return DROUGHTS_OBJ[value].color;
};

var circleColor = exports.circleColor = function circleColor(_ref) {
  var colours = _ref.properties.colours;
  return colorByValue(colours);
};

var sizesForRange = exports.sizesForRange = function sizesForRange(range) {
  var f = function f(_ref2) {
    var months = _ref2.months;
    return utils.inRange(months, range);
  };
  return NUMBER_OF_MONTHS.filter(f);
};

var NB_MONTHS_OBJ = utils.arrToObj(NUMBER_OF_MONTHS);

var getDroughtMonths = exports.getDroughtMonths = function getDroughtMonths(size) {
  return NB_MONTHS_OBJ[size].months;
};
var circleMonths = exports.circleMonths = function circleMonths(_ref3) {
  var size_ = _ref3.properties.size_;
  return NB_MONTHS_OBJ[size_].months;
};

var monthsDescription = exports.monthsDescription = function monthsDescription(size) {
  return NB_MONTHS_OBJ[size].description;
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(DROUGHTS, 'DROUGHTS', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/circles.js');

  __REACT_HOT_LOADER__.register(allDroughtRegimes, 'allDroughtRegimes', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/circles.js');

  __REACT_HOT_LOADER__.register(NUMBER_OF_MONTHS, 'NUMBER_OF_MONTHS', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/circles.js');

  __REACT_HOT_LOADER__.register(DROUGHTS_OBJ, 'DROUGHTS_OBJ', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/circles.js');

  __REACT_HOT_LOADER__.register(droughtRegime, 'droughtRegime', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/circles.js');

  __REACT_HOT_LOADER__.register(droughtFullRegime, 'droughtFullRegime', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/circles.js');

  __REACT_HOT_LOADER__.register(droughtRegimeHelp, 'droughtRegimeHelp', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/circles.js');

  __REACT_HOT_LOADER__.register(droughtRegimeSingle, 'droughtRegimeSingle', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/circles.js');

  __REACT_HOT_LOADER__.register(colorByValue, 'colorByValue', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/circles.js');

  __REACT_HOT_LOADER__.register(circleColor, 'circleColor', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/circles.js');

  __REACT_HOT_LOADER__.register(sizesForRange, 'sizesForRange', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/circles.js');

  __REACT_HOT_LOADER__.register(NB_MONTHS_OBJ, 'NB_MONTHS_OBJ', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/circles.js');

  __REACT_HOT_LOADER__.register(getDroughtMonths, 'getDroughtMonths', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/circles.js');

  __REACT_HOT_LOADER__.register(circleMonths, 'circleMonths', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/circles.js');

  __REACT_HOT_LOADER__.register(monthsDescription, 'monthsDescription', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/circles.js');
}();

;

/***/ }),

/***/ "./src/utils/constants.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var FACEBOOK_APP_ID = exports.FACEBOOK_APP_ID = '709249142599099';

var FACEBOOK_SDK_VERSION = exports.FACEBOOK_SDK_VERSION = 'v2.10';

var TWEET_INTENT_URL = exports.TWEET_INTENT_URL = 'https://twitter.com/intent/tweet';

var TWEET_TEXT = exports.TWEET_TEXT = 'Créez votre carte personnalisée des zones arides sur aridityworldmap.org';

var TWEET_HASHTAGS = exports.TWEET_HASHTAGS = '';
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(FACEBOOK_APP_ID, 'FACEBOOK_APP_ID', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/constants.js');

  __REACT_HOT_LOADER__.register(FACEBOOK_SDK_VERSION, 'FACEBOOK_SDK_VERSION', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/constants.js');

  __REACT_HOT_LOADER__.register(TWEET_INTENT_URL, 'TWEET_INTENT_URL', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/constants.js');

  __REACT_HOT_LOADER__.register(TWEET_TEXT, 'TWEET_TEXT', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/constants.js');

  __REACT_HOT_LOADER__.register(TWEET_HASHTAGS, 'TWEET_HASHTAGS', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/constants.js');
}();

;

/***/ }),

/***/ "./src/utils/data.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.turfizeGeoJSON = exports.filterFeatures = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _helpers = __webpack_require__("./node_modules/@turf/helpers/index.js");

var _circle = __webpack_require__("./node_modules/@turf/circle/index.js");

var _circle2 = _interopRequireDefault(_circle);

var _inside = __webpack_require__("./node_modules/@turf/inside/index.js");

var _inside2 = _interopRequireDefault(_inside);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var filterFeatures = exports.filterFeatures = function filterFeatures(data, latLng) {
  var pt = (0, _helpers.point)([latLng.lng, latLng.lat]);
  var result = {};
  Object.keys(data).forEach(function (i) {
    var set = data[i];
    if ((typeof set === 'undefined' ? 'undefined' : _typeof(set)) === _typeof({})) {
      set = set.features;
    }
    var matching = set.find(function (f) {
      return f._turfObj && (0, _inside2.default)(pt, f._turfObj);
    });

    if (matching) {
      result[i] = matching;
    }
  });
  return result;
};

var GeoJSON = {
  Polygon: 'Polygon',
  MultiPolygon: 'MultiPolygon',
  Point: 'Point'
};

var featureToCircle = function featureToCircle(feature) {
  var size = parseInt(feature.properties.size_, 10);
  var coords = feature.geometry.coordinates;
  var radius = size * 20;
  var center = (0, _helpers.point)(coords);
  var steps = 15;
  return (0, _circle2.default)(center, radius, steps);
};

var turfizeGeoJSON = exports.turfizeGeoJSON = function turfizeGeoJSON(data) {
  data.forEach(function (feature) {
    var coords = feature.geometry.coordinates;
    switch (feature.geometry.type) {
      case GeoJSON.Polygon:
        feature._turfObj = (0, _helpers.polygon)(coords);
        break;
      case GeoJSON.MultiPolygon:
        feature._turfObj = (0, _helpers.multiPolygon)(coords);
        break;
      case GeoJSON.Point:
        feature._turfObj = featureToCircle(feature);
        break;
      default:
        break;
    }
  });
  return data;
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(filterFeatures, 'filterFeatures', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/data.js');

  __REACT_HOT_LOADER__.register(GeoJSON, 'GeoJSON', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/data.js');

  __REACT_HOT_LOADER__.register(featureToCircle, 'featureToCircle', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/data.js');

  __REACT_HOT_LOADER__.register(turfizeGeoJSON, 'turfizeGeoJSON', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/data.js');
}();

;

/***/ }),

/***/ "./src/utils/formats.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var FORMATS = {
  PDF: 'pdf',
  PNG: 'png',
  A4: [297, 210]
};

var PIXELS_PER_MM = 3.779528;
var mm2px = exports.mm2px = function mm2px(mm) {
  return mm * PIXELS_PER_MM;
};
var px2mm = exports.px2mm = function px2mm(px) {
  return Math.round(px / PIXELS_PER_MM);
};

FORMATS.A4px = FORMATS.A4.map(mm2px);

var _default = FORMATS;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(FORMATS, 'FORMATS', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/formats.js');

  __REACT_HOT_LOADER__.register(PIXELS_PER_MM, 'PIXELS_PER_MM', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/formats.js');

  __REACT_HOT_LOADER__.register(mm2px, 'mm2px', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/formats.js');

  __REACT_HOT_LOADER__.register(px2mm, 'px2mm', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/formats.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/formats.js');
}();

;

/***/ }),

/***/ "./src/utils/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.visibleTypes = exports.fakeContext = exports.inRange = exports.arrToObj = exports.debugCanvas = exports.isFunction = exports.noop = exports.updateTooltips = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _reactTooltip = __webpack_require__("./node_modules/react-tooltip/dist/index.js");

var _reactTooltip2 = _interopRequireDefault(_reactTooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var updateTooltips = exports.updateTooltips = function updateTooltips() {
  _reactTooltip2.default.rebuild();
};

var noop = exports.noop = function noop() {
  return null;
};
var isFunction = exports.isFunction = function isFunction(f) {
  return (typeof f === 'undefined' ? 'undefined' : _typeof(f)) === (typeof noop === 'undefined' ? 'undefined' : _typeof(noop));
};
var debugCanvas = exports.debugCanvas = function debugCanvas(canvas) {
  var width = canvas.width,
      height = canvas.height;

  var strF = 'width=' + width + ' height=' + height;
  window.open(canvas.toDataURL('image/png', 1), 'DebugCanvasWindow', strF);
};

var arrToObj = exports.arrToObj = function arrToObj(arr) {
  var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (v) {
    return v.value;
  };

  var obj = {};
  arr.forEach(function (v) {
    obj[key(v)] = v;
  });
  return obj;
};

var inRange = exports.inRange = function inRange(a, b) {
  return a[0] >= b[0] && a[a.length - 1] <= b[b.length - 1];
};

var fakeContext = exports.fakeContext = function fakeContext() {
  return document.createElement('canvas').getContext('2d');
};

var visibleTypes = exports.visibleTypes = function visibleTypes(types) {
  return Object.keys(types).map(function (name) {
    return types[name];
  }).filter(function (type) {
    return type.visible;
  });
};
// export { data, patterns, boundaries };

;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(updateTooltips, 'updateTooltips', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/index.js');

  __REACT_HOT_LOADER__.register(noop, 'noop', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/index.js');

  __REACT_HOT_LOADER__.register(isFunction, 'isFunction', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/index.js');

  __REACT_HOT_LOADER__.register(debugCanvas, 'debugCanvas', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/index.js');

  __REACT_HOT_LOADER__.register(arrToObj, 'arrToObj', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/index.js');

  __REACT_HOT_LOADER__.register(inRange, 'inRange', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/index.js');

  __REACT_HOT_LOADER__.register(fakeContext, 'fakeContext', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/index.js');

  __REACT_HOT_LOADER__.register(visibleTypes, 'visibleTypes', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/index.js');
}();

;

/***/ }),

/***/ "./src/utils/patterns.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initPatterns = exports.findPattern = exports.findPatternByValue = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Author: Pierre Bellon <pierre@skoli.fr>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _utils = __webpack_require__("./src/utils/index.js");

var _boundaries = __webpack_require__("./src/utils/boundaries.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PATTERNS = [{
  // hyper aride: pas de motif, bordure
  key: 'Hyper',
  stripes: null,
  boundaries: _boundaries.BOUNDARIES.TEETH
}, {
  // aride: pas de motif, bordure pleine
  key: 'Aride',
  stripes: null,
  boundaries: _boundaries.BOUNDARIES.FULL
}, {
  // semi-aride: motif -45*, bordure partielle (dashed)
  key: 'Semi',
  stripes: { gap: 7, rotate: 45, thickness: 1 },
  boundaries: _boundaries.BOUNDARIES.DASHED
}, {
  // sub-humide: motif -45* + 45, pas de bordure
  key: 'Sub_humide',
  stripes: { gap: 7, rotate: 45, thickness: 1, plaid: true },
  boundaries: _boundaries.BOUNDARIES.NONE
}];

var addStripes = function addStripes(canvas, _ref) {
  var _ref$offset = _ref.offset,
      offset = _ref$offset === undefined ? 0 : _ref$offset,
      _ref$plaid = _ref.plaid,
      plaid = _ref$plaid === undefined ? false : _ref$plaid,
      gap = _ref.gap,
      thickness = _ref.thickness;
  var width = canvas.width,
      height = canvas.height;

  var ctx = canvas.getContext('2d');
  var diagLength = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
  var stripeGap = gap || thickness;
  var tile = thickness + stripeGap;
  var repeats = (diagLength * 2 + offset) / tile;

  ctx.strokeStyle = '#BFBFBF';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeWidth = thickness;
  // clear canvas
  // ctx.clearRect(0, 0, width, height);

  for (var i = 0; i < repeats; i += 1) {
    // ctx.fillStyle =
    ctx.beginPath();
    var off = 0 + i * tile;
    var x = off - width;
    ctx.moveTo(x, 0);
    ctx.lineTo(off, width);
    ctx.stroke();
    if (plaid) {
      ctx.moveTo(x, height);
      ctx.lineTo(off, 0);
      ctx.stroke();
    }
    ctx.closePath();
  }
};

var createCanvasPattern = function createCanvasPattern(_ref2) {
  var stripes = _ref2.stripes;

  var p = document.createElement('canvas');
  p.width = 16;
  p.height = 16;
  addStripes(p, stripes);
  return p;
};

var findPatternByValue = exports.findPatternByValue = function findPatternByValue(value) {
  return PATTERNS.find(function (_ref3) {
    var key = _ref3.key;
    return key === value;
  });
};

var findPattern = exports.findPattern = function findPattern(_ref4) {
  var type = _ref4.properties.d_TYPE;

  return PATTERNS.find(function (_ref5) {
    var key = _ref5.key;
    return key === type;
  });
};

var PatternList = function () {
  function PatternList(patterns) {
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _utils.fakeContext)();

    _classCallCheck(this, PatternList);

    this.patterns = patterns;
    this.context = context;
    this.initPatterns();
  }

  _createClass(PatternList, [{
    key: 'initPatterns',
    value: function initPatterns() {
      var _this = this;

      this.patterns = this.patterns.map(function (pattern) {
        var _pattern = pattern;
        if (pattern.stripes) {
          var canvasPattern = createCanvasPattern(pattern);
          _pattern = _extends({}, pattern, {
            canvasPattern: _this.context.createPattern(canvasPattern, 'repeat')
          });
        }
        return _pattern;
      });
    }
  }, {
    key: 'findByKey',
    value: function findByKey(_key) {
      return this.patterns.find(function (_ref6) {
        var key = _ref6.key;
        return key === _key;
      });
    }
  }, {
    key: 'findByFeature',
    value: function findByFeature(aridity) {
      return this.findByKey(aridity.properties.d_TYPE);
    }
  }, {
    key: 'all',
    value: function all() {
      return this.patterns;
    }
  }]);

  return PatternList;
}();

var initPatterns = exports.initPatterns = function initPatterns(context) {
  return new PatternList(PATTERNS, context);
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(PATTERNS, 'PATTERNS', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/patterns.js');

  __REACT_HOT_LOADER__.register(addStripes, 'addStripes', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/patterns.js');

  __REACT_HOT_LOADER__.register(createCanvasPattern, 'createCanvasPattern', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/patterns.js');

  __REACT_HOT_LOADER__.register(findPatternByValue, 'findPatternByValue', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/patterns.js');

  __REACT_HOT_LOADER__.register(findPattern, 'findPattern', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/patterns.js');

  __REACT_HOT_LOADER__.register(PatternList, 'PatternList', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/patterns.js');

  __REACT_HOT_LOADER__.register(initPatterns, 'initPatterns', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/patterns.js');
}();

;

/***/ }),

/***/ "./src/utils/styles.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var sidebar = exports.sidebar = {
  width: 250
};

var navbar = exports.navbar = {
  height: 50
};

var legend = exports.legend = {
  width: 370
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(sidebar, "sidebar", "/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/styles.js");

  __REACT_HOT_LOADER__.register(navbar, "navbar", "/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/styles.js");

  __REACT_HOT_LOADER__.register(legend, "legend", "/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/styles.js");
}();

;

/***/ }),

/***/ "./src/utils/temperatures.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findTemperature = exports.getWinterRange = exports.getSummerRange = exports.findByValue = exports.filter = undefined;

var _utils = __webpack_require__("./src/utils/index.js");

var TEMPERATURES = [{
  value: 1,
  winter: 'A',
  winter_range: [20, 30],
  summer: 'A',
  summer_range: [30],
  color: '#b76648'
}, {
  value: 2,
  winter: 'A',
  winter_range: [20, 30],
  summer: 'B',
  summer_range: [20, 30],
  color: '#e07a54'
}, {
  value: 3,
  winter: 'B',
  winter_range: [10, 20],
  summer: 'A',
  summer_range: [30],
  color: '#bf7534'
}, {
  winter: 'B',
  winter_range: [10, 20],
  summer: 'B',
  summer_range: [20, 30],
  value: 4,
  color: '#e68839'
}, {
  value: 5,
  winter: 'B',
  winter_range: [10, 20],
  summer: 'C',
  summer_range: [10, 20],
  color: '#edad78'
}, {
  value: 6,
  winter: 'C',
  winter_range: [0, 10],
  summer: 'A',
  summer_range: [30],
  color: '#c19931'
}, {
  value: 7,
  winter: 'C',
  winter_range: [0, 10],
  summer: 'B',
  summer_range: [20, 30],
  color: '#e3b131'
}, {
  value: 8,
  winter: 'C',
  winter_range: [0, 10],
  summer: 'C',
  summer_range: [10, 20],
  color: '#e8c66b'
}, {
  value: 9,
  winter: 'D',
  winter_range: [0],
  summer: 'A',
  summer_range: [30],
  color: '#95a053'
}, {
  winter: 'D',
  winter_range: [0],
  summer: 'B',
  summer_range: [20, 30],
  value: 10,
  color: '#abb85c'
}, {
  winter: 'D',
  winter_range: [0],
  summer: 'C',
  summer_range: [10, 20],
  value: 11,
  color: '#c4cd8d'
}];

var TEMPS_OBJ = (0, _utils.arrToObj)(TEMPERATURES);

var filter = exports.filter = function filter(_ref) {
  var winter = _ref.winter,
      summer = _ref.summer;

  var winterVisible = Object.keys(winter).map(function (type) {
    return winter[type];
  }).filter(function (type) {
    return type.visible;
  }).map(function (type) {
    return type.name;
  });

  var summerVisible = Object.keys(summer).map(function (type) {
    return summer[type];
  }).filter(function (type) {
    return type.visible;
  }).map(function (type) {
    return type.name;
  });

  return TEMPERATURES.filter(function (temp) {
    return winterVisible.indexOf(temp.winter) > -1 && summerVisible.indexOf(temp.summer) > -1;
  });
};

var findByValue = exports.findByValue = function findByValue(value) {
  return TEMPS_OBJ[value];
};
var getSummerRange = exports.getSummerRange = function getSummerRange(value) {
  return findByValue(value).summer_range;
};
var getWinterRange = exports.getWinterRange = function getWinterRange(value) {
  return findByValue(value).winter_range;
};

var findTemperature = exports.findTemperature = function findTemperature(_ref2) {
  var Temperatur = _ref2.properties.Temperatur;
  return findByValue(Temperatur);
};

var _default = TEMPERATURES;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(TEMPERATURES, 'TEMPERATURES', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/temperatures.js');

  __REACT_HOT_LOADER__.register(TEMPS_OBJ, 'TEMPS_OBJ', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/temperatures.js');

  __REACT_HOT_LOADER__.register(filter, 'filter', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/temperatures.js');

  __REACT_HOT_LOADER__.register(findByValue, 'findByValue', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/temperatures.js');

  __REACT_HOT_LOADER__.register(getSummerRange, 'getSummerRange', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/temperatures.js');

  __REACT_HOT_LOADER__.register(getWinterRange, 'getWinterRange', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/temperatures.js');

  __REACT_HOT_LOADER__.register(findTemperature, 'findTemperature', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/temperatures.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/utils/temperatures.js');
}();

;

/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./node_modules/webpack-dev-server/client/index.js?http:/localhost:3000");
__webpack_require__("./src/index.js");
module.exports = __webpack_require__("./node_modules/webpack/hot/only-dev-server.js");


/***/ })

},[1]);
//# sourceMappingURL=app.4dc720d3df7e29b1d517.js.map