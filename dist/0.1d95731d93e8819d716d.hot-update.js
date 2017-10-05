webpackHotUpdate(0,{

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

/***/ })

})
//# sourceMappingURL=0.1d95731d93e8819d716d.hot-update.js.map