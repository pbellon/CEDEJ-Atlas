import FileSaver from 'file-saver';

export default ({ format, blob }) => {
  return new Promise((resolve, reject) => {
    try {
      const ts = `${(new Date()).getTime()}`.substring(5);
      const fn = `export-${ts}.${format}`;
      FileSaver.saveAs(blob, fn);
      resolve(true);
    } catch (e) {
      console.error('error while downloading', e);
      reject(e);
    }
  });
};

