import i18n from 'i18n';
const t = (aridity, key) => i18n.t(`atlas:aridity.${aridity.name || aridity}.${key}`);
export const getName = (aridity) => t(aridity, 'name');
export const getDescription = (aridity) => t(aridity, 'description');
export const getPrecipitations = (aridity) => t(aridity, 'precipitations');
