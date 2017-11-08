import i18n from '../i18n';
import Project from './project.md';
import Contribute from './participate.md';
import LegendInfos from './modal.md';
import Tutorial from './tutorial.md';

const _default = {};
const frReq = require.context('./fr', true, /.+\.md$/)
const enReq = require.context('./en', true, /.+\.md$/)

frReq.keys().forEach((key) => {
  _default[key]['fr'] = frReq(key).default;
})

enReq.keys().forEach((key) => {
  _default[key]['en'] = enReq(key).default;
})

_default.keys().forEach((key) => {
  _default[key].localized = () => {
    const lng = i18n.language;
    return _default[key][lng];
  }
})
module.exports = _default;
