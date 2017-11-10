import i18n from '../i18n';

export const detect_locales = (match) => {
  let locale = match.params.locale;
  if (locale && i18n.options.whitelist.indexOf(locale) > -1) {
    if(i18n.language !== locale){
      i18n.changeLanguage(locale);
    }
  } else {
    if(i18n.language !== 'fr'){
      i18n.changeLanguage('fr');
    }
  }
}

export const key = (name) => name.replace(/\W/g, '')
