webpackHotUpdate(0,{

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

/***/ })

})
//# sourceMappingURL=0.551b1ed30f74ce891c70.hot-update.js.map