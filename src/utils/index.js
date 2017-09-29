import ReactTooltip from 'react-tooltip';

export const updateTooltips = ()=>{
  ReactTooltip.rebuild();
}
export const noop = ()=>null;

export const debugCanvas = (canvas)=>{
  const { width, height } = canvas;
  const strF = `width=${width} height=${height}`;
  window.open(canvas.toDataURL('image/png', 1), 'DebugCanvasWindow', strF);
}

export const arrToObj = (arr, key = (v) => v.value) => {
  const obj = {};
  arr.forEach(v => {
    obj[key(v)] = v;
  });
  return obj;
};
 
export const inRange = (a, b) => (
  (a[0] >= b[0]) && (a[a.length - 1] <= b[b.length - 1])
);

export const fakeContext = () => document.createElement('canvas')
  .getContext('2d');

export const visibleTypes = (types) => {
  return Object.keys(types)
    .map( name => types[name])
    .filter(type => type.visible);
};
// export { data, patterns, boundaries };
