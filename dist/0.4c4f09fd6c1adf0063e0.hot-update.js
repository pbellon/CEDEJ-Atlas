webpackHotUpdate(0,{

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

LegendElement.propTypes = {
  size: PropTypes.object,
  height: PropTypes.number
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
    return parseInt(a.key, 10) > parseInt(b.key, 10);
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
              (0, _circles.monthsDescription)(skey)
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

PrintCircleMonthRangeLegend.propTypes = {
  sizes: PropTypes.object
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

/***/ })

})
//# sourceMappingURL=0.4c4f09fd6c1adf0063e0.hot-update.js.map