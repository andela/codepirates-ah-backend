import multer from 'multer';

const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/jpeg|png|gif$i/)) {
      return cb(null, false, new Error('That image is not supported'));
    }
    cb(null, true);
  }
});

export default upload;
