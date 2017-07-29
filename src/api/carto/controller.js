import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import pdf from 'html-pdf';
import {Atlas as AtlasContainer} from 'containers';

const renderAtlas = (data)=>{
  const { canvas } = data;
  return new Promise((resolve, reject)=>{
    try {
      resolve(renderToStaticMarkup(<AtlasContainer print={ true } canvasURL={ canvas }/>));
    } catch(e) {
      reject(e);
    }
  });
}

const htmlToPdf = (html, format='pdf')=>{
  return new Promise((resolve, reject)=>{
    const opts = {
      format: 'Letter',
      orientation: 'landscape',
      quality: 95,
      type: format
    };

    pdf.create(html, opts).toStream((err, buffer)=>{
      if(err){ reject(err); }
      resolve(buffer);
    });
  });
};

const render = (req, res, next) =>{
  const data = req.body || {format:'pdf'};
  renderAtlas(data)
    .then((html)=>htmlToPdf(html, data.format))
    .then((stream)=>{
      const type = data.format;
      const fn = ('map-'+(new Date()).getTime()).substring(5) +'.'+ type;
      const mimetype = (type === 'pdf') ? 'application/pdf' : 'image/png';
      res.setHeader('Content-Disposition', `inline; filename=${fn}`);
      res.type(mimetype);
      res.status(200);
      stream.pipe(res);
    })
    .catch(next);
}

export { render };
