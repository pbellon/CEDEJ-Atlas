const i18n = require('../i18n').default; 

const _default = {};

const fnToName = (fn) => {
  const splitted = fn.split('/');
  return splitted[splitted.length - 1].split('.')[0];
};

const req = require.context('.', true, /.md$/);

req.keys().forEach(fn => {
  const lng = fn.substring(2, 4);
  const name = fnToName(fn);
  module.exports[name] = module.exports[name] || {
    localized: function(){
      const lng = i18n.language || i18n.options.fallbackLng[0];
      return this[lng];
    }
  };
  module.exports[name][lng] = req(`./${lng}/${name}.md`);
});

