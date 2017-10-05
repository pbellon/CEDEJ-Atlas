webpackHotUpdate(0,{

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
  toggle: _propTypes2.default.bool,
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

/***/ })

})
//# sourceMappingURL=0.f9e88c0190e06aa10e65.hot-update.js.map