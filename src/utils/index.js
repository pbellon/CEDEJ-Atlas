const arrToObj = (arr, key=(v)=>v.value)=>{
  const obj = {};
  for(let i in arr){
    const v = arr[i];
    obj[key(v)] = v;
  };
  return obj;
}
 
export { arrToObj };
