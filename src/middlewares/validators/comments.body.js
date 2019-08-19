import validator from 'validator';

const CommentValidation = (req, res, next) => {
  if (validator.isEmpty(req.body.body)) {
    return res.status(400).send({
      message: 'Comment body is required'
    });
  }
  next();
};
export default CommentValidation;
