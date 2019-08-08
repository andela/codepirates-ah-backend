const admin = (req, res, next) => {
  if (!(req.auth.role === 'admin')) {
    return res.status(403).send({
      status: 403,
      message: 'Access denied. This service is strictly reserved to the admin.'
    });
  }
  next();
};
export default admin;
