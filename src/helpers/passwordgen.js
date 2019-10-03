const randPass = () => {
  let password = '';
  const pattern = /[a-z].*[0-9].*/;
  while (!pattern.test(password)) {
    password = (Math.random() + 1).toString(36).substring(4);
  }
  return password;
};

export default randPass;
