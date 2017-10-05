webpackHotUpdate(0,{

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


      var shouldUpdateTooltips = circlesVisible !== toLayers.circles.visible || aridityVisible !== toLayers.aridity.visible || (0, _utils.visibleTypes)(types).length !== (0, _utils.visibleTypes)(toFilters.circles.types).length || (0, _utils.visibleTypes)(aridity).length !== (0, _utils.visibleTypes)(toFilters.aridity).length;

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

/***/ })

})
//# sourceMappingURL=0.31143a589c6ee9709b03.hot-update.js.map