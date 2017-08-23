const arrToObj = (arr, key=(v)=>v.value)=>{
  const obj = {};
  for(let i in arr){
    const v = arr[i];
    obj[key(v)] = v;
  };
  return obj;
}
 
const inRange = (a,b) => (a[0] >= b[0] ) && (a[a.length - 1] <= b[b.length-1]);
export * from './data';
export { arrToObj, inRange };
