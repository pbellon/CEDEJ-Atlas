import { latLng } from 'leaflet';

const getScaled = function (ex) {
  return ((ex/2) / 40075017) * 360;
};

const TrianglePoints = (center, radius)=>{
  const width =  getScaled(radius) * 6;
  const height = getScaled(radius) * 5;
  center = latLng(center);
  const left = latLng([
    center.lat + (height / 2), center.lng - (width / 2)
  ]);
  const right = latLng([
    center.lat + (height /2), center.lng + (width / 2)
  ]);
  const bottom = latLng([
    center.lat - (height / 2), center.lng
  ]);

  return [
    left, right, bottom
  ];

};
export default TrianglePoints; 
