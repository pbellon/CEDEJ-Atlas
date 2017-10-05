webpackHotUpdate(0,{

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
    _react2.default.createElement(_components.Checkbox, { disabled: disabled,
      label: label,
      onBeforeChange: render,
      onChange: disabled ? _utils.noop : onToggle,
      checked: toggled })
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

/***/ })

})
//# sourceMappingURL=0.4a1fa51106252e0ffe49.hot-update.js.map