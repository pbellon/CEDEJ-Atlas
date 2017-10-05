webpackHotUpdate(0,{

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

/***/ })

})
//# sourceMappingURL=0.6b1fc1bf0aa3c2dbe413.hot-update.js.map