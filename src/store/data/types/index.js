import TEMPERATURES from './temperatures';
import CIRCLES from './circles';

const __obj = (arr)=>{
  const obj = {};
  arr.forEach((v)=>{
    obj[v.value] = v;
  });
  return obj;
}

const TEMPS_OBJ = __obj(TEMPERATURES);
export const findTemperature = (t)=>{
  return TEMPS_OBJ[t.properties.Temperatur];
}

const CIRCLES_OBJ = __obj(CIRCLES);

export const findCircle = ({properties})=>{
  return CIRCLES_OBJ[properties.colours];
}
