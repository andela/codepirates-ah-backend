export default (userPassword) => {
  const regularExpression = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
  const valid = regularExpression.test(userPassword);
  return valid;
};
