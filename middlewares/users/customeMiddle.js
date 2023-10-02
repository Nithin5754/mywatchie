const UserAuthentication = (req, res, next) => {
  console.log('req.session.isUser:', req.session.isUser);
  if (req.session && req.session.isUser) {
    next();
  } else {
    console.log('Redirecting to /home');
    return res.redirect('/');
  }
};

module.exports = UserAuthentication;
