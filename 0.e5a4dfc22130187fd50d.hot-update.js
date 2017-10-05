webpackHotUpdate(0,{

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

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

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
    { href: to, title: title, rel: 'noopener noreferrer', target: '_blank' },
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
  return height || 'auto';
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
        { to: 'https://www.ephe.fr/', title: 'Visiter le site de l\'\xC9cole Pratique des Hautes \xC9tudes' },
        _react2.default.createElement('img', { alt: 'Logo EPHEE', src: _logoephe2.default, height: props.horizontal ? 80 : 110 })
      )
    ),
    _react2.default.createElement(
      ImgHolder,
      null,
      _react2.default.createElement(
        Link,
        { to: 'http://www.cnrs.fr', title: 'Visiter le site du CNRS' },
        _react2.default.createElement('img', { alt: 'Logo CNRS', src: _logocnrs2.default, height: props.horizontal ? 70 : 100 })
      )
    ),
    _react2.default.createElement(
      ImgHolder,
      null,
      _react2.default.createElement(
        Link,
        { alt: 'Logo CEDEJ', to: 'http://cedej-eg.org', title: 'Visiter le site du CEDEJ' },
        _react2.default.createElement('img', { src: _logocedej2.default, height: props.horizontal ? 80 : 110 })
      )
    ),
    _react2.default.createElement(
      ImgHolder,
      null,
      _react2.default.createElement(
        Link,
        { to: 'http://www.diplomatie.gouv.fr/fr/', title: 'Visiter le site du Minist\xE8re' },
        _react2.default.createElement('img', { alt: 'Logo MAE', src: _logomae2.default, height: props.horizontal ? 70 : 110 })
      )
    )
  );
};

PartnersLogo.propTypes = {
  horizontal: _propTypes2.default.bool
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

/***/ })

})
//# sourceMappingURL=0.e5a4dfc22130187fd50d.hot-update.js.map