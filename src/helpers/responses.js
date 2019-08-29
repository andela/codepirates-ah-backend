import Util from './util';

const util = new Util();

export const notFound = (msg) => {
  util.setError(404, `${msg} not found`);
  return util;
};

export const error = (msg, code = 400) => {
  util.setError(code, msg);
  return util;
};

export const success = (msg, data = null) => {
  util.setSuccess(200, msg, data);
  return util;
};

export const created = (msg, data) => {
  util.setSuccess(201, msg, data);
  return util;
};
