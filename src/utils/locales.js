import i18n from '../i18n';

export const detect_locales = (match) => {
  let locale = match.params.locale;
  if (locale && i18n.options.whitelist.indexOf(locale) > -1) {
    i18n.changeLanguage(locale);
  }
}

export const key = (name) => name.replace(/\W/g, '')
