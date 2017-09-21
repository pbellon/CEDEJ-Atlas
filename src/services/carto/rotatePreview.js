const rotatePreview = ({mapPreview, ...data})=>{
  return new Promise((resolve, reject)=>{
    try {
      const img = new Image();
      const canvas = document.createElement('canvas');
      img.src = mapPreview;
      img.onload = ()=>{
        const iw = img.width;
        const ih = img.height;
        const cw = ih;
        const ch = iw;

        canvas.width = cw;
        canvas.height = ch;
        const ctx = canvas.getContext('2d');
        // rotation code took from
        // https://jsfiddle.net/AbdiasSoftware/Hq7p2/
        ctx.translate(cw*0.5, ch*0.5);
        ctx.rotate(-Math.PI/2);
        ctx.translate(-iw*0.5, -ih*0.5);
        ctx.drawImage(img,0,0);
        ctx.setTransform(1,0,0,1,0,0); 
        resolve({mapPreview:canvas, ...data}); 
      }
    } catch(e) {
      reject(e);
    }
  });
}

export default rotatePreview;
