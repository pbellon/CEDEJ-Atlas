webpackHotUpdate(0,{

/***/ "./src/components/molecules/LegendMoreInfos/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  margin-top: 1em;\n'], ['\n  margin-top: 1em;\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

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

LegendMoreInfos.propTypes = {
  opened: _propTypes2.default.bool,
  show: _propTypes2.default.func,
  hide: _propTypes2.default.func
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

/***/ })

})
//# sourceMappingURL=0.a0980c5994a382584685.hot-update.js.map