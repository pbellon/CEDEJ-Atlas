webpackHotUpdate(0,{

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
        version: _constants.FACEBOOK_SDK_VERSION
      },
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

/***/ })

})
//# sourceMappingURL=0.0ae488f6354d8b50cdd2.hot-update.js.map