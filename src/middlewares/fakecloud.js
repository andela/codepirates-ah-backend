import fakeUpload from '../../test/mock/mock.cloud';

const fakeCloud = (req, res, next) => {
  req.auth = fakeUpload.auth;
  req.body = fakeUpload.body;
  req.files = fakeUpload.files;
  next();
};
export default fakeCloud;
